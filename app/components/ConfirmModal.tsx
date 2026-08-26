"use client";

import { useEffect } from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDestructive = true,
}: ConfirmModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="relative z-50">
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-2xl border border-white/10 bg-[#111318] px-4 pb-4 pt-5 text-left shadow-2xl shadow-black/50 transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
            <div className="sm:flex sm:items-start">
              <div
                className={`mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10 ${
                  isDestructive ? "bg-red-500/10" : "bg-blue-500/10"
                }`}
              >
                <ExclamationTriangleIcon
                  className={`h-6 w-6 ${
                    isDestructive ? "text-red-500" : "text-blue-500"
                  }`}
                  aria-hidden="true"
                />
              </div>
              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3
                  className="text-lg font-semibold leading-6 text-white"
                >
                  {title}
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-zinc-400">{message}</p>
                </div>
              </div>
            </div>
            <div className="mt-5 sm:ml-10 sm:mt-4 sm:flex sm:pl-4">
              <button
                type="button"
                className={`inline-flex w-full justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm sm:w-auto ${
                  isDestructive
                    ? "bg-red-600 hover:bg-red-500"
                    : "bg-blue-600 hover:bg-blue-500"
                }`}
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
              >
                {confirmText}
              </button>
              <button
                type="button"
                className="mt-3 inline-flex w-full justify-center rounded-xl bg-white/5 px-4 py-2.5 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-white/10 hover:bg-white/10 sm:ml-3 sm:mt-0 sm:w-auto"
                onClick={onClose}
              >
                {cancelText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
