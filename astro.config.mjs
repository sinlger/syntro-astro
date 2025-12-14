import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
// import cloudflare from '@astrojs/cloudflare'
export default defineConfig({
  site: "https://excel2vcf.com",
  integrations: [sitemap(), react()],
  i18n: {
    locales: ["zh", "en"],
    defaultLocale: "zh", 
    routing: {
      // 保持为 true，以便 Astro 能在构建时生成 /zh/ 和 /en/ 路径
      prefixDefaultLocale: true, 
    },
  },
  output: 'static',
  // adapter: cloudflare(),
  vite: {
    plugins: [tailwindcss()],
  },
});
