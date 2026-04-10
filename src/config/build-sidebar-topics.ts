import type { StarlightSidebarTopicsUserConfig } from "starlight-sidebar-topics";
import type { StarlightUserConfig } from "@astrojs/starlight/types";
import type { MetaConfig } from "./sidebar-types";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import rootMeta from "../content/docs/_meta";
import teamMeta from "../content/docs/team/_meta";
import productMeta from "../content/docs/product/_meta";
import engineeringMeta from "../content/docs/engineering/_meta";
import designMeta from "../content/docs/design/_meta";
import financeMeta from "../content/docs/finance/_meta";
import legalMeta from "../content/docs/legal/_meta";
import riskMeta from "../content/docs/risk/_meta";
import businessMeta from "../content/docs/business/_meta";
import marketingMeta from "../content/docs/marketing/_meta";
import industryMeta from "../content/docs/industry/_meta";

type SidebarItems = NonNullable<StarlightUserConfig["sidebar"]>;
type SidebarItem = SidebarItems[number];

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = join(__dirname, "../content/docs");

const topicMetas: Record<string, MetaConfig> = {
  team: teamMeta,
  product: productMeta,
  engineering: engineeringMeta,
  design: designMeta,
  finance: financeMeta,
  legal: legalMeta,
  risk: riskMeta,
  business: businessMeta,
  marketing: marketingMeta,
  industry: industryMeta,
};

function isDir(topicSlug: string, key: string): boolean {
  const p = join(CONTENT_DIR, topicSlug, key);
  return fs.existsSync(p) && fs.statSync(p).isDirectory();
}

function hasOverview(topicSlug: string): boolean {
  return fs.existsSync(join(CONTENT_DIR, topicSlug, "index.mdx"));
}

/** Build a single sidebar item from a slug + optional label. */
function buildItem(
  topicSlug: string,
  key: string,
  label: string,
  collapsed?: boolean,
): SidebarItem {
  if (isDir(topicSlug, key)) {
    return {
      label: label || key,
      ...(collapsed != null ? { collapsed } : {}),
      autogenerate: {
        directory: `${topicSlug}/${key}`,
        // When the directory itself is expanded, keep its sub-directories collapsed
        ...(collapsed === false ? { collapsed: true } : {}),
      },
    };
  }
  // Page reference — Starlight resolves the label from frontmatter
  return `${topicSlug}/${key}`;
}

/**
 * Parse a MetaConfig into Starlight sidebar items.
 *
 * - String value → page or directory (auto-detected via fs)
 * - Object value → sidebar group; key = group label, children get collapsed: true
 */
function buildTopicItems(topicSlug: string, meta: MetaConfig): SidebarItems {
  const items: SidebarItem[] = [];

  // Auto-prepend overview if index.mdx exists
  if (hasOverview(topicSlug)) {
    items.push({ slug: topicSlug, label: "Overview" });
  }

  for (const [key, value] of Object.entries(meta)) {
    if (typeof value === "string") {
      // Flat item — page or directory
      items.push(buildItem(topicSlug, key, value));
    } else {
      // Group — key is the group label, value is Record<string, string> of children
      const childEntries = Object.entries(value);

      // Flatten: if group wraps a single directory, autogenerate directly
      // so we don't get "TEAMS > Teams > ..." redundant nesting
      if (childEntries.length === 1) {
        const [childKey] = childEntries[0]!;
        if (isDir(topicSlug, childKey)) {
          items.push({
            label: key,
            autogenerate: { directory: `${topicSlug}/${childKey}`, collapsed: true },
          });
          continue;
        }
      }

      const groupItems: SidebarItem[] = [];
      for (const [childKey, childLabel] of childEntries) {
        groupItems.push(buildItem(topicSlug, childKey, childLabel, false));
      }
      items.push({ label: key, items: groupItems });
    }
  }

  return items;
}

export function buildSidebarTopics(): StarlightSidebarTopicsUserConfig {
  const topics: StarlightSidebarTopicsUserConfig = [];

  // Home topic (hardcoded)
  topics.push({
    label: "Home",
    link: "/",
    id: "home",
    items: [{ slug: "", label: "Welcome" }],
  });

  // Build each topic from root meta
  for (const [topicSlug, topicLabel] of Object.entries(rootMeta)) {
    if (typeof topicLabel !== "string") continue;

    const meta = topicMetas[topicSlug];
    if (!meta) throw new Error(`Unknown sidebar topic: "${topicSlug}"`);

    // If topic has an overview page, link to topic root; otherwise first page
    let link = `/${topicSlug}/`;
    if (!hasOverview(topicSlug)) {
      const firstPage = Object.keys(meta).find(
        (k) => typeof meta[k] === "string",
      );
      if (firstPage) {
        link = `/${topicSlug}/${firstPage}/`;
      }
    }

    topics.push({
      label: topicLabel,
      link,
      items: buildTopicItems(topicSlug, meta),
    });
  }

  return topics;
}
