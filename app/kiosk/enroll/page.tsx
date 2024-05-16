"use client";

import { Authsignal } from "@authsignal/browser";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useInterval } from "usehooks-ts";
import QRCode from "react-qr-code";
import { Skeleton } from "@/components/ui/skeleton";
import { Button, ButtonLoading } from "@/components/ui/button";

const CHALLENGE_TTL = 10 * 60 * 1000;

export default function Order() {
  const [isLoadingChallenge, setIsLoadingChallenge] = useState(false);
  const [challengeId, setChallengeId] = useState<string>("");
  const [isChallengeClaimed, setIsChallengeClaimed] = useState(false);
  const router = useRouter();

  useEffect(() => {
    startNewChallenge();
  }, []);

  useInterval(async () => {
    await startNewChallenge();
  }, CHALLENGE_TTL);

  useInterval(
    async () => {
      const authsignal = new Authsignal({
        tenantId: process.env.NEXT_PUBLIC_AUTHSIGNAL_TENANT_ID!,
        baseUrl: process.env.NEXT_PUBLIC_AUTHSIGNAL_URL,
      });

      const result = await authsignal.kiosk.verify({
        challengeId,
      });

      if (!result.isClaimed || isLoadingChallenge) {
        return;
      }

      if (result.isClaimed) {
        setIsChallengeClaimed(true);
      }

      if (!result.isConsumed) {
        return;
      }

      if (result.isVerified) {
        router.push(`/kiosk/enroll/passkey?token=${result.accessToken}`);
      } else {
        router.push("/kiosk/enroll/fail");
      }
    },
    challengeId ? 1000 : null
  );

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 space-y-6">
      <h1 className="text-3xl font-bold">Enroll passkey</h1>
      <p className="text-gray-500 dark:text-gray-400">
        To begin, scan the QR code to identify yourself.
      </p>
      <div className="min-w-80">
        {challengeId ? (
          <div className="flex items-center justify-center min-w-full min-h-full">
            {isChallengeClaimed && (
              <svg
                aria-hidden="true"
                className="w-16 h-16 text-gray-200 animate-spin fill-blue-700 absolute"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
            )}
            <div
              className={`h-full w-full ${
                isChallengeClaimed ? "blur opacity-20" : ""
              }`}
            >
              <QRCode
                value={`${process.env.NEXT_PUBLIC_URL}/user-device/identify?challengeId=${challengeId}`}
                className="h-full w-full"
              />
            </div>
          </div>
        ) : (
          <Skeleton className="h-80 w-80 rounded-sm" />
        )}
      </div>
      {isLoadingChallenge ? (
        <ButtonLoading
          className={`${isChallengeClaimed ? "visible" : "invisible"}`}
        />
      ) : (
        <Button
          className={`${isChallengeClaimed ? "visible" : "invisible"}`}
          onClick={() => {
            {
              startNewChallenge();
            }
          }}
        >
          Start again
        </Button>
      )}
    </main>
  );

  async function startNewChallenge() {
    setIsLoadingChallenge(true);
    const authsignal = new Authsignal({
      tenantId: process.env.NEXT_PUBLIC_AUTHSIGNAL_TENANT_ID!,
      baseUrl: process.env.NEXT_PUBLIC_AUTHSIGNAL_URL,
    });

    const challengeId = await authsignal.kiosk.challenge({
      action: "enrollPasskey",
    });

    setChallengeId(challengeId);
    setIsChallengeClaimed(false);
    setIsLoadingChallenge(false);
  }
}
