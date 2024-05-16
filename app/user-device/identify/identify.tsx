"use client";

import { claimAnonymousChallenge } from "@/actions/authsignal";
import { Button, ButtonLoading } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

export default function Identify() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const challengeId = searchParams.get("challengeId");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    event.preventDefault();

    const result = await claimAnonymousChallenge({
      email,
      challengeId: challengeId!,
    });

    // Redirected by server
    if (!result) {
      return;
    }

    if (result.notEnrolled) {
      toast({
        title: `No user found for ${email}.`,
        variant: "destructive",
      });
    } else if (result.isClaimedOrExpired) {
      toast({
        title: `The challenge has been claimed or expired. Please scan a new QR code.`,
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  return (
    <main className="flex h-[calc(100vh-64px)] flex-col items-center justify-center p-24 space-y-6">
      <h1 className="text-xl md:text-3xl font-bold text-center">
        Enter your email to proceed
      </h1>
      <div className="flex flex-col space-y-2 min-w-80">
        <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
          <div className="spacer" />
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
            />
          </div>
          {isLoading || !challengeId ? (
            <ButtonLoading />
          ) : (
            <Button type="submit">Confirm</Button>
          )}
        </form>
      </div>
    </main>
  );
}
