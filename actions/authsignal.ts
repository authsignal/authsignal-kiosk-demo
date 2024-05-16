"use server";

import { redirect } from "next/navigation";
import { authsignal } from "./client";
import crypto from "crypto";
import axios from "axios";

export const claimAnonymousChallenge = async ({
  email,
  challengeId,
}: {
  email: string;
  challengeId: string;
}): Promise<
  | {
      notEnrolled?: boolean;
      isClaimedOrExpired?: boolean;
    }
  | undefined
> => {
  try {
    const result = await authsignal.track({
      userId: crypto.createHash("md5").update(email).digest("hex"),
      email,
      action: "enrollPasskey", // This must be the same action as the anonymous challenge initiated by the kiosk
      redirectUrl: `${process.env.NEXT_PUBLIC_URL}/api/finalize-login`,
      challengeId,
    });

    if (!result.isEnrolled) {
      return { notEnrolled: true };
    }

    redirect(result.url);
  } catch (error) {
    if (
      axios.isAxiosError(error) &&
      error.response &&
      error.response.status == 401
    ) {
      return { isClaimedOrExpired: true };
    }
    throw error;
  }
};

export type CoffeePreference = {
  coffee: string;
  size: string;
};

export const savePreference = async ({
  email,
  coffeePreference: preference,
}: {
  email: string;
  coffeePreference: CoffeePreference;
}) => {
  const userId = crypto.createHash("md5").update(email).digest("hex");
  const result = await authsignal.track({
    userId,
    email,
    action: "saveCoffeePreference",
    redirectUrl: `${process.env.NEXT_PUBLIC_URL}/api/finalize-preference`,
    scope: "add:authenticators",
  });

  // Save user's preference - you may call an external service here
  // Note: This is prior to successful authentication. You may want to do this step after validating the challenge.
  await axios.post(
    `${process.env.NEXT_PUBLIC_AUTHSIGNAL_URL}/users/${userId}`,
    {
      custom: {
        coffeePreference: {
          coffee: preference.coffee,
          size: preference.size,
        },
      },
    },
    {
      auth: {
        username: process.env.AUTHSIGNAL_SECRET!,
        password: "",
      },
    }
  );

  redirect(result.url);
};

export const getUser = async ({ userId }: { userId: string }) => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_AUTHSIGNAL_URL}/users/${userId}`,
    {
      auth: {
        username: process.env.AUTHSIGNAL_SECRET!,
        password: "",
      },
    }
  );

  return {
    email: response.data.email as string,
    coffeePreference: response.data.custom.coffeePreference as CoffeePreference,
  };
};

export const isChallengeSuccessful = async (token: string) => {
  const { isValid, userId } = await authsignal.validateChallenge({ token });

  if (isValid) {
    return { isValid: true, userId };
  }

  return { isValid: false };
};
