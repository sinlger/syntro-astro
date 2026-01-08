import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import cloudflare from '@astrojs/cloudflare'
export default defineConfig({
  site: "https://excel2vcf.com",
  integrations: [sitemap(), react()],
  i18n: {
    locales: ["zh", "en", "ja", "ko", "fr", "de", "es"], // 支持的语言列表：中文、英文、日文、韩文、法文、德文、西班牙文
    defaultLocale: "zh", 
    routing: {
      // 保持为 true，以便 Astro 能在构建时生成 /zh/ 和 /en/ 路径
      prefixDefaultLocale: true, 
    },
  },
  output: 'server',
  adapter: cloudflare(),
  vite: {
    plugins: [tailwindcss()],
  },
});
