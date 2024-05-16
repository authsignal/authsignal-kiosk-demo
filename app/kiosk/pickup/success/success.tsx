"use client";

import { Button } from "@/components/ui/button";
import { CircleCheck } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useInterval } from "usehooks-ts";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import { CoffeePreference, getUser } from "@/actions/authsignal";

const REDIRECT_IN_SECS = 60 * 1000;
const PROGRESS_TICKER_INTERVAL = 100;
const PROGRESS_BAR_MAX = 100;

export default function Success() {
  const [redirectCountdown, setRedirectCountdown] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const [user, setUser] = useState<{
    email: string;
    coffeePreference: CoffeePreference;
  }>();

  useEffect(() => {
    if (!userId) {
      return;
    }

    const fetchUser = async () => {
      const user = await getUser({ userId });
      setUser(user);
    };

    fetchUser();
  }, [userId]);

  useInterval(() => {
    setRedirectCountdown(
      redirectCountdown +
        (PROGRESS_TICKER_INTERVAL / REDIRECT_IN_SECS) * PROGRESS_BAR_MAX
    );
  }, PROGRESS_TICKER_INTERVAL);

  useInterval(() => {
    router.replace("/kiosk/pickup");
  }, REDIRECT_IN_SECS);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 space-y-6">
      <CircleCheck size={42} color="#007c00" />
      <div className="space-y-1">
        <h1 className="text-3xl font-bold">Order pick up confirmed</h1>
        {user ? <p className="text-center text-sm">{user.email}</p> : ""}
      </div>
      {user ? (
        <div>
          <p className="text-lg">
            Your order is a {user.coffeePreference.size}{" "}
            {user.coffeePreference.coffee}
          </p>
        </div>
      ) : (
        <p className="text-lg">Fetching order...</p>
      )}
      <div className="flex flex-col space-y-2 min-w-80">
        <Button asChild>
          <Link href="/kiosk/pickup">Pick up another order</Link>
        </Button>
      </div>
      <div className="min-w-80 absolute bottom-20 space-y-2">
        <p>Redirecting...</p>
        <Progress value={redirectCountdown} className="h-2" />
      </div>
    </main>
  );
}
