import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Layout } from '@/components/layout/Layout'
import { AuthProvider } from '@/components/AuthProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Perfect Day - Transform Your Day',
  description: 'An app to track your day, manage tasks, and build routines for a perfect day, every day.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider defaultTheme="system">
          <AuthProvider>
            <Layout>{children}</Layout>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
