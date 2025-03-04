import "@/faust.config.js";
import { FaustProvider } from "@faustwp/experimental-app-router/ssr";
import "./globals.css";
import Navigation from "../components/shop/Navigation";
import Footer from "../components/shop/Footer";

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <FaustProvider>
          <Navigation />
          <main>{children}</main>
          <Footer />
        </FaustProvider>
      </body>
    </html>
  );
}
