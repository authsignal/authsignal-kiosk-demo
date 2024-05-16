export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <div
        className="flex top-0 w-full h-16 items-center justify-center"
        style={{ backgroundColor: "#8B7BFF" }}
      >
        <h1 className="text-3xl font-extrabold w-full text-center">
          User Device
        </h1>
      </div>
      {children}
    </div>
  );
}
