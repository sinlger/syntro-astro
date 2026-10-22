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
      // 关闭 Astro 默认的「非本地化路径 -> 默认语言」自动 302。
      // 这样 / 由 src/pages/index.astro 静态渲染成语言选择页（带 hreflang + x-default），
      // 而不是无条件把国际访客送到 /zh/。
      redirectToDefaultLocale: false,
    },
  },
  output: 'server',
  adapter: cloudflare(),
  vite: {
    plugins: [tailwindcss()],
  },
});
