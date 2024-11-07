import { Roboto } from "next/font/google";
import Head from 'next/head'
import { Toaster } from "@/components/ui/toaster"

const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
})

export default function Layout({ children }) {
  return (
    <div className={[roboto.className, 'bg-gray-100', 'bg-blend-darken']}>
      <Head>
        <title>My page title</title>
      </Head>
      <main>{children}</main>
      <Toaster />
    </div>
  )
}