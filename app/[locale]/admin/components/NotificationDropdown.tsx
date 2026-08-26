"use client";

import { useState, useEffect, useRef } from "react";
import Pusher from "pusher-js";
import { BellIcon } from "@heroicons/react/24/outline";

interface Notification {
  id: string;
  message: string;
  time: string;
  read: boolean;
}

export default function NotificationDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize Pusher client
    const pusher = new Pusher("6e69b3265e9c4a7a147f", {
      cluster: "ap1",
    });

    const channel = pusher.subscribe("admin-notifications");

    const handleNewNotification = (data: { message: string; time: string }) => {
      const newNotif: Notification = {
        id: Math.random().toString(36).substring(7),
        message: data.message,
        time: data.time,
        read: false,
      };
      setNotifications((prev) => [newNotif, ...prev]);
    };

    channel.bind("new-user", handleNewNotification);
    channel.bind("new-plan-checkout", handleNewNotification);
    channel.bind("payment-plan", handleNewNotification);

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen && unreadCount > 0) {
            markAllAsRead();
          }
        }}
        className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-zinc-400 transition hover:bg-white/10 hover:text-white"
      >
        <BellIcon className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute right-2 top-2 flex h-2 w-2 items-center justify-center rounded-full bg-red-500">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 origin-top-right rounded-2xl border border-white/10 bg-[#111318] py-2 shadow-2xl shadow-black/50 z-50">
          <div className="flex items-center justify-between border-b border-white/10 px-4 pb-2 pt-1">
            <h3 className="font-semibold text-white">Notifications</h3>
            {notifications.length > 0 && (
              <button
                onClick={() => setNotifications([])}
                className="text-xs text-zinc-500 hover:text-red-400 transition"
              >
                Clear all
              </button>
            )}
          </div>
          
          <div className="max-h-80 overflow-y-auto px-2 py-2">
            {notifications.length === 0 ? (
              <p className="py-4 text-center text-sm text-zinc-500">
                No new notifications.
              </p>
            ) : (
              <div className="space-y-1">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`rounded-xl p-3 text-sm transition-colors ${
                      notif.read ? "bg-transparent text-zinc-400" : "bg-white/5 text-zinc-200"
                    }`}
                  >
                    <p>{notif.message}</p>
                    <p className="mt-1 text-xs text-zinc-500">{formatTime(notif.time)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
