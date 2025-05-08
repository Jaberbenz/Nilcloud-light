import type { NextConfig } from "next";
import nextra from "nextra";

// Configuration Nextra
const withNextra = nextra({
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.jsx",
});

// Configuration principale Next.js avec Webpack
const nextConfig: NextConfig = {
  webpack(config) {
    // Trouve la règle existante pour les fichiers SVG
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.(".svg")
    );

    // Ajoute les nouvelles règles pour gérer les SVG
    config.module.rules.push(
      // Réapplique la règle existante uniquement pour les fichiers SVG avec ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // Gère les fichiers *.svg?url
      },
      // Transforme les autres SVG en composants React
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: {
          not: [...(fileLoaderRule.resourceQuery?.not || []), /url/],
        },
        use: ["@svgr/webpack"],
      }
    );

    // Exclut les fichiers SVG de la règle existante pour éviter les conflits
    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },
};

// Fusionnez les deux configurations
export default withNextra(nextConfig);
