import Login from "./login";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <Suspense>
      <Login />
    </Suspense>
  );
}
