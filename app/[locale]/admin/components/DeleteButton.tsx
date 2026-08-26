"use client";

import { TrashIcon } from "@heroicons/react/24/outline";

interface DeleteButtonProps {
  id: string;
  action: (id: string) => Promise<void>;
  entityName: string;
}

export default function DeleteButton({ id, action, entityName }: DeleteButtonProps) {
  return (
    <form action={() => action(id)}>
      <button
        type="submit"
        onClick={(e) => {
          if (!confirm(`Are you sure you want to delete this ${entityName}?`)) {
            e.preventDefault();
          }
        }}
        className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-2.5 py-1 text-xs font-medium text-zinc-400 transition hover:border-red-500/40 hover:text-red-400"
      >
        <TrashIcon className="h-3 w-3" />
        Delete
      </button>
    </form>
  );
}
