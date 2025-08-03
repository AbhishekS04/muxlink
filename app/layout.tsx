import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Muxlink",
  description: "Personal link tree",
  creator: 'Abhishek singh'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="dark bg-black text-white">
        <div className="dark">{children}</div>
      </body>
    </html>
  )
}
