import type {
  SidebarEntry,
  SidebarGroup,
  SidebarLink,
} from "@astrojs/starlight/utils/routing/types";

/**
 * Per-directory sidebar ordering via `_meta.ts` files.
 *
 * Each sub-folder `_meta.ts` exports a Record<string, string> of slugs in
 * display order. Items not listed appear at the end in their original order.
 * Directories without `_meta.ts` keep default alphabetical behavior.
 *
 * Topic-level and root metas (which may contain nested objects for groups)
 * are handled by build-sidebar-topics and skipped here.
 */

// Eagerly import all _meta.ts files at build time.
const metaModules = import.meta.glob<{ default: Record<string, unknown> }>(
  "/src/content/docs/**/_meta.ts",
  { eager: true },
);

// Build map: directory path (e.g. "engineering/workflow") → ordered slug array
const orderMap = new Map<string, string[]>();

for (const [filePath, mod] of Object.entries(metaModules)) {
  const meta = mod.default;
  if (!meta || typeof meta !== "object" || Array.isArray(meta)) continue;

  // filePath is like "/src/content/docs/engineering/workflow/_meta.ts"
  const dirPath = filePath
    .replace("/src/content/docs/", "")
    .replace("/_meta.ts", "");

  // Skip root and topic-level metas (handled by build-sidebar-topics)
  if (!dirPath.includes("/")) continue;

  orderMap.set(dirPath, Object.keys(meta));
}

/**
 * Determine which content directory a SidebarGroup corresponds to
 * by inspecting children's hrefs.
 */
export function inferGroupDirectory(group: SidebarGroup): string | null {
  // Strategy 1: Use a direct link child (most common — directory has .mdx files).
  // Prefer deeper links over index pages — index pages have fewer segments
  // so slice(0, -1) returns the parent directory, not the correct subdirectory.
  let bestResult: string | null = null;

  for (const child of group.entries) {
    if (child.type === "link") {
      const segments = child.href.replace(/^\/|\/$/g, "").split("/");
      if (segments.length >= 2) {
        const candidate = segments.slice(0, -1).join("/");
        if (!bestResult || candidate.length > bestResult.length) {
          bestResult = candidate;
        }
      }
    }
  }

  if (bestResult) return bestResult;

  // Strategy 2: Directory has only subdirectories (no direct .mdx files).
  // Find a child group's label (= raw directory name) in its deep link path.
  for (const child of group.entries) {
    if (child.type === "group") {
      const deepLink = findFirstLink(child);
      if (deepLink) {
        const segments = deepLink.href.replace(/^\/|\/$/g, "").split("/");
        // Normalize label to kebab-case to match directory name
        const childDirName = child.label.toLowerCase().replace(/\s+/g, "-");
        const idx = segments.indexOf(childDirName);
        if (idx > 0) {
          return segments.slice(0, idx).join("/");
        }
      }
    }
  }

  return null;
}

function findFirstLink(entry: SidebarEntry): SidebarLink | null {
  if (entry.type === "link") return entry;
  for (const child of entry.entries) {
    const found = findFirstLink(child);
    if (found) return found;
  }
  return null;
}

/**
 * Reorder a group's children to match the `_meta.ts` ordering for that directory.
 * Index pages (entries without extractable slugs) stay first.
 * Items listed in `_meta.ts` come next in that order.
 * Unlisted items appear at the end in their original order.
 */
export function reorderGroupEntries(
  entries: SidebarEntry[],
  dirPath: string,
): SidebarEntry[] {
  const order = orderMap.get(dirPath);
  if (!order) return entries;

  // Separate entries by slug availability
  const slugToEntry = new Map<string, SidebarEntry>();
  const unslugged: SidebarEntry[] = []; // e.g. index pages

  for (const entry of entries) {
    const slug = extractSlug(entry, dirPath);
    if (slug) {
      slugToEntry.set(slug, entry);
    } else {
      unslugged.push(entry);
    }
  }

  const ordered: SidebarEntry[] = [];
  const placed = new Set<SidebarEntry>();

  // Place items in _meta.ts order
  for (const slug of order) {
    const entry = slugToEntry.get(slug);
    if (entry) {
      ordered.push(entry);
      placed.add(entry);
    }
  }

  // Append remaining slugged items (not in _meta.ts) in original order
  for (const entry of entries) {
    if (!placed.has(entry) && !unslugged.includes(entry)) {
      ordered.push(entry);
    }
  }

  // Index pages first, then ordered items
  return [...unslugged, ...ordered];
}

/**
 * Extract the slug from a sidebar entry relative to a parent directory.
 * Uses the path segment immediately after dirPath in the entry's href.
 * This correctly handles flattened groups (single-child → link) and nested groups.
 */
function extractSlug(
  entry: SidebarEntry,
  dirPath: string,
): string | null {
  const link =
    entry.type === "link" ? entry : findFirstLink(entry as SidebarGroup);
  if (!link) return null;

  const segments = link.href.replace(/^\/|\/$/g, "").split("/");
  const depth = dirPath.split("/").length;

  // The slug is the segment right after the dirPath segments
  if (segments.length > depth) {
    return segments[depth] || null;
  }

  // href has same or fewer segments than dirPath (e.g. index page)
  return null;
}
