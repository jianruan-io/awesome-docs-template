# docs-template

A scaffolding template for building documentation sites with **Astro +
Starlight + Tailwind 4 + React 19**, derived from the Orbbit internal docs
stack.

It ships with the full setup — sidebar topic builder, per-directory `_meta.ts`
ordering, frontmatter-driven sidebar labels, KaTeX, Mermaid auto-import,
custom Starlight component overrides, and a Tailwind 4 styling layer — but
without any project-specific content. All topic folders contain only
placeholder pages that you can replace.

## Tech Stack

- **Framework**: [Astro 6](https://astro.build/) (static site generation)
- **Docs theme**: [Starlight 0.38](https://starlight.astro.build/) +
  [`starlight-sidebar-topics`](https://github.com/HiDeoo/starlight-sidebar-topics)
- **Styling**: Tailwind CSS 4 + `@astrojs/starlight-tailwind`
- **Content**: MDX with frontmatter, organized into topics
- **Math**: `remark-math` + `rehype-katex`
- **Diagrams**: `mermaid` (auto-imported via custom remark plugin)
- **React islands**: `@astrojs/react` + React 19 (for interactive components)
- **Charts**: `recharts`
- **Icons**: `lucide-react`
- **Tooling**: TypeScript (strict), Prettier, pnpm

## Getting Started

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm build    # production build (validates the entire site)
pnpm preview  # serve the production build locally
```

## Repository Layout

```
docs-template/
|-- astro.config.mjs              # Starlight + React + Tailwind + remark/rehype wiring
|-- tsconfig.json                 # Strict TS, path aliases (@components/*, ~/*)
|-- package.json
|-- .npmrc                        # pnpm peer-dep settings
|-- .prettierrc / .prettierignore
|-- .gitignore
|-- public/                       # Static assets (favicons, images, etc.)
`-- src/
    |-- content.config.ts         # Astro content collection (Starlight docs schema)
    |-- content/
    |   `-- docs/
    |       |-- _meta.ts          # Top-level topic order/labels
    |       |-- index.mdx         # Site landing page
    |       |-- team/             # One folder per topic, each with:
    |       |   |-- _meta.ts      #   ordering + grouping config
    |       |   |-- index.mdx     #   topic overview
    |       |   `-- getting-started.mdx
    |       |-- product/
    |       |-- engineering/
    |       |-- creative/
    |       |-- finance/
    |       |-- legal/
    |       |-- risk/
    |       |-- business/
    |       |-- marketing/
    |       `-- industry/
    |-- components/
    |   |-- overrides/            # Starlight slot overrides
    |   |   |-- Header.astro
    |   |   |-- Footer.astro
    |   |   |-- Sidebar.astro
    |   |   |-- SidebarSublist.astro
    |   |   |-- MarkdownContent.astro
    |   |   |-- TableOfContents.astro
    |   |   |-- Banner.astro
    |   |   `-- Hero.astro
    |   |-- MermaidDiagram.tsx    # Auto-imported into MDX
    |   |-- ScalarApiReference.tsx
    |   |-- PricingCharts.tsx
    |   |-- ReturnBoundaryCharts.tsx
    |   `-- SystemFlywheelDiagram.tsx
    |-- config/
    |   |-- build-sidebar-topics.ts  # Reads each topic _meta.ts -> sidebar topics
    |   `-- sidebar-types.ts         # MetaConfig type used by every _meta.ts
    |-- plugins/
    |   `-- remark-auto-import.mjs   # Injects MermaidDiagram import into MDX
    |-- route-data/
    |   |-- sidebar-postprocessor.ts # Starlight middleware entry point
    |   |-- sidebar.ts               # Frontmatter title resolution + flatten
    |   `-- meta-ordering.ts         # Apply per-directory _meta.ts ordering
    `-- styles/                       # Tailwind 4 layers + topic-scoped overrides
        |-- tailwind.css
        |-- katex.css
        |-- orbbit.css
        |-- sidebar.css
        |-- layout.css
        |-- headings.css
        |-- links.css
        |-- code.css
        |-- lists.css
        |-- table.css
        |-- asides.css
        |-- badges.css
        |-- footnotes.css
        |-- input.css
        `-- pagination.css
```

## How the Sidebar Works

1. `src/content/docs/_meta.ts` declares the **top-level topics** (Team, Product,
   Engineering, ...). Each key must match a sibling directory.
2. Each topic directory has its own `_meta.ts` (`MetaConfig` shape):
   - `"slug": "Label"` -> page or directory entry
   - `"Group Label": { "slug": "Label", ... }` -> sidebar group
3. `src/config/build-sidebar-topics.ts` walks every topic `_meta.ts` and builds
   the `starlight-sidebar-topics` plugin config at build time. Directories use
   `autogenerate`, individual pages become slug references.
4. `src/route-data/sidebar-postprocessor.ts` runs as a Starlight route
   middleware to:
   - Replace kebab-case group labels with the `title` from each group's
     `index.mdx` frontmatter.
   - Reorder children using nested `_meta.ts` files (see
     `meta-ordering.ts`).
   - Flatten single-child groups into direct links.

To add a new topic, create the folder under `src/content/docs/`, add a
`_meta.ts` and `index.mdx`, then register the topic in
`src/content/docs/_meta.ts` **and** in `topicMetas` inside
`src/config/build-sidebar-topics.ts`.

## Authoring Pages

Every page is an `.mdx` file with frontmatter:

```mdx
---
title: My Page
description: Short SEO description.
---

# My Page

Regular markdown plus React components.

<MermaidDiagram
  id="my-diagram"
  chart={`
graph TB
  A[Start] --> B[End]
`}
/>
```

`MermaidDiagram` is auto-imported by the `remark-auto-import` plugin, so no
explicit `import` line is needed in MDX. Other React components must be
imported manually at the top of the file.

## Path Aliases

- `@components/*` -> `src/components/*`
- `~/*` -> `src/*`

## Customizing Branding

The default styles preserve a teal accent and the layout overrides from the
source project. To rebrand:

- Update accent color tokens in `src/styles/tailwind.css` (`--tw-accent-*`,
  `--orbbit-*`, `--color-cl1-brand-teal`).
- Replace assets in `public/` (`favicon.ico`, `apple-icon.png`, `icon.png`,
  logos).
- Update `title` and `social` entries in `astro.config.mjs`.
- Adjust copy in `src/components/overrides/Header.astro`,
  `Footer.astro`, and `Hero.astro`.
