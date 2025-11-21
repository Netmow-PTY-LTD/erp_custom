

import type { RouteObject } from "react-router";
import type { TUserPath } from "../types/sidebar.types";

// Dummy fallback page
const DummyPage = ({ title }: { title: string }) => (
  <div className="p-8 text-xl font-bold">{title} Page</div>
);


export const generateRoutes = (items: TUserPath[], parentPath = ""): RouteObject[] => {
  const routes: RouteObject[] = [];

  items.forEach((item) => {
    // Skip placeholders
    if (!item.url || item.url === "#") {
      // Only process children if they exist
      if (item.items && item.items.length > 0) {
        routes.push(...generateRoutes(item.items, parentPath));
      }
      return;
    }

    // Convert absolute path to relative path if parentPath exists
    let relativePath = item.url;
    if (parentPath && relativePath.startsWith("/")) {
      relativePath = relativePath.replace(/^\/?/, ""); // remove leading slash
      if (relativePath.startsWith(parentPath + "/")) {
        relativePath = relativePath.replace(parentPath + "/", "");
      }
    }

    // Add route
    routes.push({
      path: relativePath,
      element: item.element || <DummyPage title={item.title} />,
    });

    // Process children recursively
    if (item.items && item.items.length > 0) {
      routes.push(...generateRoutes(item.items, relativePath));
    }
  });

  return routes;
};
