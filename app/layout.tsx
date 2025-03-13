import { FaustProvider } from "@faustwp/experimental-app-router/ssr";
import { getClient } from "@faustwp/experimental-app-router";
import { GET_HEADER_LINKS, GET_FOOTER_LINKS } from "@/lib/graphql/queries";
import "./globals.css";
import Navigation from "../components/shop/Navigation";
import Footer from "../components/shop/Footer";
import { Poppins } from "next/font/google";
import { Providers } from "./providers";
import { CartProvider } from "@/lib/context/CartContext";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export default async function RootLayout({ children }) {
  const client = await getClient();

  const [headerData, footerData] = await Promise.all([
    client.query({
      query: GET_HEADER_LINKS,
    }),
    client.query({
      query: GET_FOOTER_LINKS,
    }),
  ]);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script src="https://unpkg.com/react-scan/dist/auto.global.js" />
      </head>
      <body className={`${poppins.className} min-h-screen bg-background text-foreground`}>
        <FaustProvider>
          <CartProvider>
            <Providers>
              <Navigation
                generalSettings={headerData.data.generalSettings}
                primaryMenuItems={headerData.data.primaryMenuItems}
              />
              <main>{children}</main>
              <Footer
                menuItems={footerData.data.footerMenuItems.nodes || []}
                siteName={headerData.data.generalSettings.title}
              />
            </Providers>
          </CartProvider>
        </FaustProvider>
      </body>
    </html>
  );
}
