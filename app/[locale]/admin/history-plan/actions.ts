"use server";

import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { revalidatePath } from "next/cache";

export async function syncCryptomusPayment(historyId: string) {
  try {
    const history = await prisma.historyMembership.findUnique({
      where: { id: historyId },
      include: {
        user: true,
        membershipPlan: true,
      },
    });

    if (!history) {
      return { success: false, error: "History record not found." };
    }

    if (history.statusPayment !== "Pending") {
      return { success: false, error: "Only pending transactions can be synced." };
    }

    if (!history.invoice || history.invoice.startsWith("INV-FREE-")) {
      return { success: false, error: "This is not a Cryptomus invoice." };
    }

    const gateway = await prisma.paymentGateway.findUnique({
      where: { name: "cryptomus" },
    });

    if (!gateway || !gateway.isActive || !gateway.merchantId || !gateway.paymentKey) {
      return { success: false, error: "Cryptomus gateway is not configured or active." };
    }

    const payload = {
      order_id: history.invoice,
    };

    const payloadStr = Buffer.from(JSON.stringify(payload)).toString("base64");
    const sign = crypto.createHash("md5").update(payloadStr + gateway.paymentKey).digest("hex");

    const response = await fetch("https://api.cryptomus.com/v1/payment/info", {
      method: "POST",
      headers: {
        "merchant": gateway.merchantId,
        "sign": sign,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (result.state === 0 || result.state === 1) {
      const status = result.result.status;

      if (status === "paid" || status === "paid_over") {
        const plan = history.membershipPlan;
        const expiredAt = new Date();
        
        // If user already has an active subscription, add to it instead of replacing?
        // Let's stick to the current logic: replace/start from today.
        expiredAt.setDate(expiredAt.getDate() + plan.expired);

        await prisma.$transaction([
          prisma.historyMembership.update({
            where: { id: history.id },
            data: { statusPayment: "Success" },
          }),
          prisma.user.update({
            where: { id: history.user.id },
            data: {
              membershipPlanId: plan.id,
              membershipExpiredAt: expiredAt,
            },
          }),
        ]);

        revalidatePath("/admin/history-plan");
        return { success: true, message: "Payment successful! User subscription updated." };
      } else if (status === "expired" || status === "cancel" || status === "fail" || status === "locked") {
        let newStatus = "Cancel";
        if (status === "expired") newStatus = "Expired";
        if (status === "fail" || status === "locked") newStatus = "Error";
        
        await prisma.historyMembership.update({
          where: { id: history.id },
          data: { statusPayment: newStatus as any },
        });

        revalidatePath("/admin/history-plan");
        return { success: true, message: `Payment failed/expired. Status updated to ${newStatus}.` };
      } else {
        return { success: true, message: `Payment is still ${status}. No changes made.` };
      }
    } else {
      console.error("Cryptomus Sync error:", result);
      return { success: false, error: "Failed to check payment status with Cryptomus." };
    }
  } catch (error) {
    console.error("Sync payment error:", error);
    return { success: false, error: "Internal server error during sync." };
  }
}
