import type { Metadata } from "next";
import "./globals.css";

const isGitHubPages = process.env.GITHUB_PAGES === "true";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const assetPath = (path: string) => `${basePath}${path}`;

export const metadata: Metadata = {
  metadataBase: isGitHubPages ? new URL("https://guilhermeazevedo1.github.io") : undefined,
  title: "Como uma máquina aprende? | Aula interativa",
  description:
    "Apresentação educacional interativa sobre aprendizagem de máquina, Scikit-learn, avaliação, clustering, redes neurais e AutoML.",
  icons: {
    icon: assetPath("/favicon.svg"),
    shortcut: assetPath("/favicon.svg"),
  },
  openGraph: {
    title: "Como uma máquina aprende? | Aula interativa",
    description:
      "Uma experiência didática com 24 capítulos, simulações e notebook em Python.",
    images: [assetPath("/og-v2.png")],
  },
  twitter: {
    card: "summary_large_image",
    title: "Como uma máquina aprende? | Aula interativa",
    description:
      "Explore algoritmos, métricas, clustering, redes neurais e AutoML com interações visuais.",
    images: [assetPath("/og-v2.png")],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
