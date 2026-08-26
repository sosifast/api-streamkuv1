"use client";

import { useState, useTransition } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";
import ConfirmModal from "@/app/components/ConfirmModal";

interface DeleteButtonProps {
  id: string;
  action: (id: string) => Promise<void>;
  entityName: string;
}

export default function DeleteButton({ id, action, entityName }: DeleteButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      await action(id);
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        disabled={isPending}
        className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-2.5 py-1 text-xs font-medium text-zinc-400 transition hover:border-red-500/40 hover:text-red-400 disabled:opacity-50"
      >
        <TrashIcon className="h-3 w-3" />
        {isPending ? "Deleting..." : "Delete"}
      </button>

      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
        title={`Delete ${entityName}`}
        message={`Are you sure you want to delete this ${entityName}? This action cannot be undone.`}
        confirmText="Delete"
        isDestructive={true}
      />
    </>
  );
}
