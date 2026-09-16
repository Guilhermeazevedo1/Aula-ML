import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";
const repositoryName = "Aula-ML";

const nextConfig: NextConfig = {
  ...(isGitHubPages
    ? {
        output: "export" as const,
        basePath: `/${repositoryName}`,
        assetPrefix: `/${repositoryName}/`,
        images: {
          unoptimized: true,
        },
        typescript: {
          ignoreBuildErrors: true,
        },
        trailingSlash: true,
      }
    : {}),
};

export default nextConfig;
