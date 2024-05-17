"use client";

import { isChallengeSuccessful } from "@/actions/authsignal";
import { Button, ButtonLoading } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Authsignal } from "@authsignal/browser";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function AnonymousChallenge() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    event.preventDefault();

    const authsignal = new Authsignal({
      tenantId: process.env.NEXT_PUBLIC_AUTHSIGNAL_TENANT_ID!,
      baseUrl: process.env.NEXT_PUBLIC_AUTHSIGNAL_URL!,
    });

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_AUTHSIGNAL_URL}/client/challenge`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${window.btoa(
            encodeURIComponent(process.env.NEXT_PUBLIC_AUTHSIGNAL_TENANT_ID!)
          )}`,
        },
        body: JSON.stringify({
          action: "pickup",
        }),
      }
    );

    const challengeId = (await response.json()).challengeId;

    try {
      const result = await authsignal.passkey.signIn({
        challengeId,
      });

      if (!result) {
        toast({
          title: `Failed to authenticate passkey.`,
          variant: "destructive",
        });
        return;
      }
      const { isValid, userId } = await isChallengeSuccessful(result);

      if (!isValid) {
        toast({
          title: `Failed to authenticate passkey.`,
          variant: "destructive",
        });
        return;
      }

      // Calls webhook configured on `pickup` action as part of this verify call
      // The webhook is where custom logic can be added such as collecting payment, looking up orders, or firing off other events.
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_AUTHSIGNAL_URL}/client/verify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${window.btoa(
              encodeURIComponent(process.env.NEXT_PUBLIC_AUTHSIGNAL_TENANT_ID!)
            )}`,
          },
          body: JSON.stringify({ challengeId }),
        }
      );

      const { isVerified, error } = await response.json();

      if (!isVerified) {
        toast({
          title: error,
          variant: "destructive",
        });
        return;
      }

      router.push(`/kiosk/pickup/success?userId=${userId}`);
    } catch (error) {
      if (
        // @ts-ignore
        error.message.includes(
          "The operation either timed out or was not allowed."
        )
      ) {
        // Swallow error from passkey prompt dismissal
        return;
      }

      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 space-y-6">
      <h1 className="text-3xl font-bold">Pick up your coffee</h1>

      <div className="flex flex-col space-y-2 min-w-80">
        <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
          <div className="spacer" />
          {isLoading ? (
            <ButtonLoading />
          ) : (
            <Button type="submit">Click here</Button>
          )}
        </form>
      </div>
    </main>
  );
}
