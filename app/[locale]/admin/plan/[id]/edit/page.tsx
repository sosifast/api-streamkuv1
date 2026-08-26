import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import PlanForm from "../../plan-form";
import { updatePlan } from "../../actions";

export const metadata = {
  title: "Edit Plan — DB Movie Admin",
};

export default async function EditPlanPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const plan = await prisma.membershipPlan.findUnique({
    where: { id },
  });

  if (!plan) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.25em] text-red-400">
          Billing
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold text-white">
          Edit Plan
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Editing <span className="font-medium text-zinc-300">{plan.name}</span>
        </p>
      </div>

      {/* Form Card */}
      <div className="rounded-2xl border border-white/10 bg-[#111318] p-6">
        <PlanForm
          action={updatePlan}
          submitLabel="Save Changes"
          initialData={{
            id: plan.id,
            name: plan.name,
            priceIdr: Number(plan.priceIdr),
            priceUsd: Number(plan.priceUsd),
            expired: plan.expired,
            requestLimit: plan.requestLimit,
            bandwithLimitPerDay: plan.bandwithLimitPerDay,
          }}
        />
      </div>
    </div>
  );
}
