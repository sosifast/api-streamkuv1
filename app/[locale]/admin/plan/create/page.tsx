import PlanForm from "../plan-form";
import { createPlan } from "../actions";

export const metadata = {
  title: "Create Plan — DB Movie Admin",
};

export default function CreatePlanPage() {
  return (
    <div className="mx-auto max-w-2xl">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.25em] text-red-400">
          Billing
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold text-white">
          Create New Plan
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Add a new membership plan for your users.
        </p>
      </div>

      {/* Form Card */}
      <div className="rounded-2xl border border-white/10 bg-[#111318] p-6">
        <PlanForm action={createPlan} submitLabel="Create Plan" />
      </div>
    </div>
  );
}
