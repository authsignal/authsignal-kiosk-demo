import { Suspense } from "react";
import Passkey from "./passkey";

export default function PasskeyPage() {
  return (
    <Suspense>
      <Passkey />
    </Suspense>
  );
}
