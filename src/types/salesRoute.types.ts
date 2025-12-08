export interface SalesRoute {
  _id?: string;
  routeName: string;
  routeCode?: string;
  description?: string;
  areas?: string[];
  status?: "active" | "inactive";
}
