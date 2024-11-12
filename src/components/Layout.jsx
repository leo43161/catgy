import { Roboto } from "next/font/google";
import Head from 'next/head'
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "./theme-provider";

const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
})

export default function Layout({ children }) {
  return (
    <div className={[roboto.className, 'bg-gray-100', 'bg-blend-darken']}>
      <Head>
        <title>Catgy</title>
      </Head>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <main>{children}</main>
        <Toaster className="bg-primary" />
      </ThemeProvider>
    </div>
  )
}