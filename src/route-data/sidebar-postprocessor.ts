import type { StarlightRouteData } from "@astrojs/starlight/utils/routing/types";
import { buildFrontmatterMap, processSidebar } from "./sidebar";

/**
 * Starlight route middleware that post-processes the sidebar:
 * - Replaces kebab-case group labels with frontmatter titles
 * - Flattens single-child groups into direct links
 */
export async function onRequest(
  context: { locals: { starlightRoute: StarlightRouteData } },
  next: () => Promise<void>,
) {
  // Run all prior middleware first (onion pattern)
  await next();

  const route = context.locals.starlightRoute;
  const map = await buildFrontmatterMap();
  route.sidebar = processSidebar(route.sidebar, map);
}
