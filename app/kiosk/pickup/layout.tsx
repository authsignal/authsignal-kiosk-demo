export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <div
        className="flex absolute top-0 w-full h-16 items-center justify-center"
        style={{ backgroundColor: "#FFFA88" }}
      >
        <h1 className="text-3xl font-extrabold w-full text-center">
          Challenge Kiosk
        </h1>
      </div>
      {children}
    </div>
  );
}
