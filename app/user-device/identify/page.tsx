import Identify from "./identify";
import { Suspense } from "react";

export default function IdentifyPage() {
  return (
    <Suspense>
      <Identify />
    </Suspense>
  );
}
