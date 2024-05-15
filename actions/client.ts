import { Authsignal } from "@authsignal/node";

export const authsignal = new Authsignal({
  secret: process.env.AUTHSIGNAL_SECRET!,
  apiBaseUrl: "https://dev-api.authsignal.com/v1",
});
