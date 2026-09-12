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
  title: "Aprendizagem de Maquina | Aula Interativa",
  description:
    "Apresentacao didatica sobre machine learning, algoritmos do scikit-learn, AutoML, redes neurais e metricas.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "Aprendizagem de Maquina | Aula Interativa",
    description:
      "Um site-aula com visualizacoes e notebook para ensinar tipos de ML, algoritmos e avaliacao.",
    images: ["/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aprendizagem de Maquina | Aula Interativa",
    description:
      "Explore aprendizado supervisionado, nao supervisionado, scikit-learn, AutoML e metricas.",
    images: ["/og.png"],
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
