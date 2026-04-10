import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkAutoImport from "./src/plugins/remark-auto-import.mjs";
import starlightSidebarTopics from "starlight-sidebar-topics";
import { buildSidebarTopics } from "./src/config/build-sidebar-topics";

export default defineConfig({
  integrations: [
    starlight({
      title: "Docs Template",
      favicon: "/favicon.ico",
      head: [
        {
          tag: "link",
          attrs: {
            rel: "apple-touch-icon",
            href: "/apple-icon.png",
          },
        },
        {
          tag: "link",
          attrs: {
            rel: "icon",
            type: "image/png",
            href: "/icon.png",
          },
        },
      ],
      routeMiddleware: "./src/route-data/sidebar-postprocessor.ts",
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/your-org/your-repo",
        },
      ],
      customCss: [
        "./src/styles/tailwind.css",
        "./src/styles/katex.css",
        "./src/styles/orbbit.css",
        "./src/styles/sidebar.css",
        "./src/styles/layout.css",
        "./src/styles/headings.css",
        "./src/styles/links.css",
        "./src/styles/code.css",
        "./src/styles/lists.css",
        "./src/styles/table.css",
        "./src/styles/asides.css",
        "./src/styles/badges.css",
        "./src/styles/footnotes.css",
        "./src/styles/input.css",
        "./src/styles/pagination.css",
      ],
      components: {
        Header: "./src/components/overrides/Header.astro",
        Footer: "./src/components/overrides/Footer.astro",
        Sidebar: "./src/components/overrides/Sidebar.astro",
        SidebarSublist: "./src/components/overrides/SidebarSublist.astro",
        MarkdownContent: "./src/components/overrides/MarkdownContent.astro",
        TableOfContents: "./src/components/overrides/TableOfContents.astro",
        Banner: "./src/components/overrides/Banner.astro",
        Hero: "./src/components/overrides/Hero.astro",
      },
      plugins: [starlightSidebarTopics(buildSidebarTopics())],
    }),
    react(),
  ],
  markdown: {
    remarkPlugins: [remarkMath, remarkAutoImport],
    rehypePlugins: [rehypeKatex],
  },
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ["mermaid"],
    },
  },
});
