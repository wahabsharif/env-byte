import ReduxProvider from "@/redux/ReduxProvider";
import "@/styles/globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReduxProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ReduxProvider>
  );
}
