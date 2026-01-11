import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ActiveThemeProvider } from "@/components/active-theme";
import { cookies } from "next/headers";
import { cn } from "@/lib/utils";

import "./globals.css";
import ReactQueryProvider from "@/components/providers/ReactQueryProvider";
import { SessionProvider } from "@/contexts/SessionContext ";
import { AppProvider } from "@/contexts/AppContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "@/contexts/ToastProvider";
import { Toaster } from "@/components/ui/sonner";
import { SITE_NAME } from "@/config";

const META_THEME_COLORS = {
  light: "#ffffff",
  dark: "#09090b",
}

export const metadata: Metadata = {
  title: {
    template: `%s | ${SITE_NAME}`,
    default: `${SITE_NAME}`,
  },
  description: "Manage Account and data",
  icons: {
    icon: [
      { url: "/logo/logo2.png", sizes: "any" },
      { url: "/logo/logo2.png", type: "image/png" }
    ]
  }
};

export const viewport: Viewport = {
  themeColor: META_THEME_COLORS.light,
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies()
  const activeThemeValue = cookieStore.get("active_theme")?.value
  const isScaled = activeThemeValue?.endsWith("-scaled")

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo/logo2.png" type="image/x-icon" />
      </head>
      <body
        className={cn(
          `bg-background overscroll-none antialiased`,
          activeThemeValue ? `theme-${activeThemeValue}` : "",
          isScaled ? "theme-scaled" : "",
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
          enableColorScheme
        >
          <ActiveThemeProvider initialTheme={activeThemeValue}>
            <ReactQueryProvider>
              <SessionProvider>
                <AppProvider>
                  <AuthProvider>
                    {children}
                    <ToastProvider />
                  </AuthProvider>
                </AppProvider>
              </SessionProvider>
            </ReactQueryProvider>
          </ActiveThemeProvider>
          {/* shadcn toaster */}
          <Toaster position="top-right" expand={true} richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
// BCRYPT JS