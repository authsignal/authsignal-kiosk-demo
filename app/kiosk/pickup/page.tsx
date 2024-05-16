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

    const challengeId = await authsignal.kiosk.challenge({ action: "pickup" });

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

      // Calls webhook configured on `pickup` action
      const { isVerified, error } = await authsignal.kiosk.verify({
        challengeId,
      });

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
