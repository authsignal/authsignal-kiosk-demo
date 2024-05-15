import { CircleCheck } from "lucide-react";

export default function Order() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 space-y-6">
      <CircleCheck size={42} color="#007c00" />
      <h1 className="text-3xl font-bold">Coffee preference saved!</h1>
      <p className="text-lg">See you at breakfast ☕</p>
    </main>
  );
}
