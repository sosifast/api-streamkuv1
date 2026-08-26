"use server";

import { prisma } from "@/lib/prisma";
import { cookies, headers } from "next/headers";
import crypto from "crypto";

export async function checkoutPlan(planId: string) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("dbmovie_session")?.value;

    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    const plan = await prisma.membershipPlan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      return { success: false, error: "Plan not found" };
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    const isFree = Number(plan.priceIdr) === 0;

    if (isFree) {
      // Hitung tanggal kedaluwarsa
      const expiredAt = new Date();
      expiredAt.setDate(expiredAt.getDate() + plan.expired);

      // Transaksi DB: Buat riwayat pembayaran (Success) & update profil user
      await prisma.$transaction([
        prisma.historyMembership.create({
          data: {
            userId: user.id,
            membershipPlanId: plan.id,
            statusPayment: "Success",
            invoice: `INV-FREE-${Date.now()}`,
            detailPayment: {
              method: "Free Checkout",
              processedAt: new Date().toISOString(),
            },
          },
        }),
        prisma.user.update({
          where: { id: user.id },
          data: {
            membershipPlanId: plan.id,
            membershipExpiredAt: expiredAt,
          },
        }),
      ]);

      return { success: true, message: "Free plan activated successfully!" };
    } else {
      // Pembayaran berbayar dengan Cryptomus
      const gateway = await prisma.paymentGateway.findUnique({
        where: { name: "cryptomus" },
      });

      if (!gateway || !gateway.isActive || !gateway.merchantId || !gateway.paymentKey) {
        return { success: false, error: "Payment gateway is not configured or active." };
      }

      const invoiceId = `INV-${Date.now()}`;
      const amount = Number(plan.priceUsd).toFixed(2);
      
      const reqHeaders = await headers();
      const origin = reqHeaders.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

      const payload = {
        amount: amount,
        currency: "USD",
        order_id: invoiceId,
        url_return: `${origin}/history-plan`,
        url_success: `${origin}/history-plan`,
        // url_callback will be implemented later
      };

      const payloadStr = Buffer.from(JSON.stringify(payload)).toString("base64");
      const sign = crypto.createHash("md5").update(payloadStr + gateway.paymentKey).digest("hex");

      const response = await fetch("https://api.cryptomus.com/v1/payment", {
        method: "POST",
        headers: {
          "merchant": gateway.merchantId,
          "sign": sign,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.state === 0 || result.state === 1) { // 0 or 1 usually indicates success depending on cryptomus state codes
        const paymentUrl = result.result.url;
        
        await prisma.historyMembership.create({
          data: {
            userId: user.id,
            membershipPlanId: plan.id,
            statusPayment: "Pending",
            invoice: invoiceId,
            detailPayment: {
              cryptomus_uuid: result.result.uuid,
              cryptomus_url: paymentUrl,
              amount_usd: amount,
            },
          },
        });

        return {
          success: true,
          message: "Invoice created! Redirecting to payment...",
          pending: true,
          paymentUrl: paymentUrl,
        };
      } else {
        console.error("Cryptomus API error:", result);
        return { success: false, error: "Failed to create payment invoice with gateway." };
      }
    }
  } catch (error) {
    console.error("Checkout error:", error);
    return { success: false, error: "Internal server error" };
  }
}
