import { Route } from "@angular/router";

export const appRoutes: Route[] = [
  {
    path: "",
    loadComponent: () => import("./components/nx-welcome.component").then((m) => m.NxWelcomeComponent)
  },
  {
    path: "card",
    loadComponent: () => import("./components/card/card.component").then((m) => m.CardComponent)
  },
  {
    path: "data",
    loadComponent: () => import("./components/data/data.component").then((m) => m.DataComponent)
  }
];
