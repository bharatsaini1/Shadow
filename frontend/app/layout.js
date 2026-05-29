import { Fraunces, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["opsz", "wght", "SOFT", "WONK"],
  variable: "--font-display",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata = {
  title: "MentriQ Shadow | Experience the Job Before Getting the Job",
  description:
    "AI-powered career simulation platform. Work real tasks, get reviewed, practice interviews, and earn a verifiable Shadow Passport.",
};

function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            try {
              var theme = localStorage.getItem('ms_theme') || 'system';
              if (theme === 'system') {
                theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
              }
              if (theme === 'dark') {
                document.documentElement.classList.add('dark');
              }
            } catch(e) {}
          })();
        `,
      }}
    />
  );
}

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fraunces.variable} ${plusJakartaSans.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <ThemeScript />
      </head>
      <body className="bg-paper dark:bg-ink font-body text-ink-prose dark:text-prose antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
