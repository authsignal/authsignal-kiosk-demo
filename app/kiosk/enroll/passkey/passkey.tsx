"use client";

import { isChallengeSuccessful } from "@/actions/authsignal";
import { Button, ButtonLoading } from "@/components/ui/button";
import { PasskeyIcon } from "@/components/ui/passkey-icon";
import { useToast } from "@/components/ui/use-toast";
import { Authsignal } from "@authsignal/browser";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function AnonymousChallenge() {
  const [isEnrollingPasskey, setIsEnrollingPasskey] = useState(false);
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();
  const { toast } = useToast();

  const promptPasskeyEnrollment = useCallback(() => {
    if (!token) {
      return;
    }

    setIsEnrollingPasskey(true);

    const authsignal = new Authsignal({
      tenantId: process.env.NEXT_PUBLIC_AUTHSIGNAL_TENANT_ID!,
      baseUrl: process.env.NEXT_PUBLIC_AUTHSIGNAL_URL,
    });

    authsignal.passkey
      .signUp({
        token,
        authenticatorAttachment: "cross-platform",
      })
      .then(async (token) => {
        if (token && (await isChallengeSuccessful(token)).isValid) {
          router.replace("/kiosk/enroll/success");
        } else {
          alert("fail");
        }
      })
      .catch((error) => {
        if (error.message === "The authenticator was previously registered") {
          toast({
            title: "Passkey already enrolled on device",
            variant: "destructive",
          });
        } else if (
          error.message ===
            "The operation either timed out or was not allowed." ||
          error.message === "Registration ceremony was sent an abort signal"
        ) {
          // Swallow error from passkey prompt dismissal
        } else {
          toast({
            title: "The token is invalid or has expired.",
            variant: "destructive",
          });

          router.replace("/kiosk/enroll");
        }
      })
      .finally(() => {
        setIsEnrollingPasskey(false);
      });
  }, [router, toast, token]);

  useEffect(() => {
    if (!token) {
      return;
    }

    promptPasskeyEnrollment();
  }, [promptPasskeyEnrollment, searchParams, token]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 space-y-6">
      <h1 className="text-3xl font-bold">Enroll passkey</h1>
      <div className="flex flex-col space-y-2 min-w-80">
        {isEnrollingPasskey ? (
          <ButtonLoading />
        ) : (
          <Button onClick={promptPasskeyEnrollment}>
            Enroll passkey <PasskeyIcon className="w-8 h-8" />
          </Button>
        )}
        <Button
          variant={"secondary"}
          onClick={() => {
            router.replace("/kiosk/enroll");
          }}
        >
          Cancel
        </Button>
      </div>
    </main>
  );
}
