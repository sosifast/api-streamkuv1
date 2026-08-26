"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

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
      // Jika harga > 0, buat riwayat Pending
      await prisma.historyMembership.create({
        data: {
          userId: user.id,
          membershipPlanId: plan.id,
          statusPayment: "Pending",
          invoice: `INV-${Date.now()}`,
        },
      });

      return {
        success: true,
        message: "Invoice created! Redirecting to payment...",
        pending: true,
      };
    }
  } catch (error) {
    console.error("Checkout error:", error);
    return { success: false, error: "Internal server error" };
  }
}
