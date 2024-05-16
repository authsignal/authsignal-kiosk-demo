"use client";

import { CircleCheck } from "lucide-react";

export default function Success() {
  return (
    <main className="flex h-[calc(100vh-64px)] flex-col items-center justify-center p-24 space-y-6">
      <CircleCheck size={42} color="#007c00" />
      <h1 className="text-xl md:text-3xl font-bold text-center">
        Please proceed to enroll your passkey on the kiosk.
      </h1>
      <p className="text-lg text-center">You may close this tab.</p>
    </main>
  );
}
