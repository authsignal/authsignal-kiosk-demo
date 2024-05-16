import { CircleCheck } from "lucide-react";

export default function Order() {
  return (
    <main className="flex max-h-[calc(100vh-64px)] flex-col items-center justify-center p-24 space-y-6">
      <CircleCheck size={42} color="#007c00" />
      <h1 className="text-xl md:text-3xl font-bold text-center">
        Coffee preference saved!
      </h1>
      <p className="text-lg text-center">See you at breakfast ☕</p>
    </main>
  );
}
