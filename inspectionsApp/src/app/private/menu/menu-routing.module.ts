import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuardTaskParam } from "src/app/guards/auth.guard-task-param";

import { MenuPage } from "./menu.page";

const routes: Routes = [
  {
    path: "",
    component: MenuPage,
    children: [
      {
        path: "tabs",
        loadChildren: () =>
          import("../tabs/tabs.module").then((m) => m.TabsPageModule),
      },
      {
        path: "details",
        canActivate: [AuthGuardTaskParam],
        loadChildren: () =>
          import("../inspections-details/inspections-details.module").then(
            (m) => m.InspectionsDetailsPageModule
          ),
      },
    ],
  },
  { path: "", redirectTo: "tabs", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuPageRoutingModule {}
