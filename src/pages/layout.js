import { Roboto } from "next/font/google";
import "./globals.css";

const inter = Roboto({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={[inter.className, 'bg-gray-100']}>
        <h2>asdasdasd</h2>
        {children}
      </body>
    </html>
  );
}
