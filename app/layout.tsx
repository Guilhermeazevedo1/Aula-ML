import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Como uma máquina aprende? | Aula interativa",
  description:
    "Apresentação educacional interativa sobre aprendizagem de máquina, Scikit-learn, avaliação, clustering, redes neurais e AutoML.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "Como uma máquina aprende? | Aula interativa",
    description:
      "Uma experiência didática com 24 capítulos, simulações e notebook em Python.",
    images: ["/og-v2.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Como uma máquina aprende? | Aula interativa",
    description:
      "Explore algoritmos, métricas, clustering, redes neurais e AutoML com interações visuais.",
    images: ["/og-v2.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
