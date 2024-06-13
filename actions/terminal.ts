"use server";

export const initializeChallenge = async (): Promise<{
  challengeId: string;
}> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_AUTHSIGNAL_URL}/terminal/challenge`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.TERMINAL_SECRET}`,
      },
    }
  );

  return await response.json();
};

export const verifyChallenge = async (
  challengeId: string
): Promise<{
  isClaimed: boolean;
  isConsumed: boolean;
  isVerified: boolean;
  accessToken?: string;
}> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_AUTHSIGNAL_URL}/terminal/verify`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.TERMINAL_SECRET}`,
      },
      body: JSON.stringify({ challengeId }),
    }
  );

  return await response.json();
};
