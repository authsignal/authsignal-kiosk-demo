# Authsignal Kiosk Demo

This is a demo on using Authsignal to allow users to identify themselves on a kiosk.

It uses a coffee ordering/pickup scenario.

Users can select their coffee preference ahead of time on their own devices, then use an Enrollment Kiosk to enroll a passkey which can then be used at a Challenge Kiosk to pickup their coffee.

## Demo Pages

- [Selecting Coffee Preferences](https://authsignal-kiosk-demo.vercel.app/user-device/coffee)
- [Passkey Enrollment Kiosk](https://authsignal-kiosk-demo.vercel.app/kiosk/enroll)
- [Coffee Pickup Challenge Kiosk](https://authsignal-kiosk-demo.vercel.app/kiosk/pickup)

## Run this project yourself

1. Clone the repository
2. Create a copy of `.env.example` as `.env` via the command `cp .env.example .env`
3. Fill in the environment variables with your own details
4. Create the required actions this project uses `saveCoffeePreference`, `enrollPasskey` and `pickup` on your Authsignal Tenant. Specific details can be requested by contacting us.
5. Run `yarn` to install dependencies
6. Run `yarn run dev` to run locally. (See note below)

> Note: When running locally, scanning the initial QR code in the Passkey Enrollment Kiosk while redirect you to an invalid public url. There will a URL logged to the console which you can use on the machine running the application locally.
>
> Alternatively, you may want to create a free application on [Vercel](https://vercel.com/) to host the project instead.

## Experimental

This demo uses APIs that have not been finalized and is subject to change.
