"use client";

import { Button } from "@/components/ui/button";
import { CircleCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useInterval } from "usehooks-ts";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";

const REDIRECT_IN_SECS = 15 * 1000;
const PROGRESS_TICKER_INTERVAL = 100;
const PROGRESS_BAR_MAX = 100;

export default function Order() {
  const [redirectCountdown, setRedirectCountdown] = useState(0);
  const router = useRouter();

  useInterval(() => {
    setRedirectCountdown(
      redirectCountdown +
        (PROGRESS_TICKER_INTERVAL / REDIRECT_IN_SECS) * PROGRESS_BAR_MAX
    );
  }, PROGRESS_TICKER_INTERVAL);

  useInterval(() => {
    router.replace("/kiosk/enroll");
  }, REDIRECT_IN_SECS);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 space-y-6">
      <CircleCheck size={42} color="#007c00" />
      <h1 className="text-3xl font-bold">Passkey enrolled!</h1>
      <p className="text-lg">
        You can use your passkey to pick up your coffee.
      </p>
      <div className="flex flex-col space-y-2 min-w-80">
        <Button asChild>
          <Link href="/kiosk/enroll">Enroll another passkey</Link>
        </Button>
      </div>
      <div className="min-w-80 absolute bottom-20 space-y-2">
        <p>Redirecting...</p>
        <Progress value={redirectCountdown} className="h-2" />
      </div>
    </main>
  );
}
