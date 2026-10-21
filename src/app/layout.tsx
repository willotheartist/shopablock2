import "./globals.css";
import type { Metadata } from "next";
import { Header, Footer } from "@/components/v2/Chrome";
import { getSessionUser } from "@/lib/auth";
export const metadata: Metadata = {
  metadataBase: new URL("https://shopablock.co"),
  title: {
    default: "ShopaBlock — Your one thing. Ready to sell.",
    template: "%s · ShopaBlock",
  },
  description:
    "Turn your product into a beautifully simple shop. Create your page, connect payments and share one link.",
  openGraph: {
    type: "website",
    siteName: "ShopaBlock",
    images: [{ url: "/images/mug.webp", width: 1024, height: 1024 }],
  },
};
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();
  return (
    <html lang="en">
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Header signedIn={!!user} />
        {children}
        <Footer />
      </body>
    </html>
  );
}
