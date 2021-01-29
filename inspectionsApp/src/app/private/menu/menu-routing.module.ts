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
        loadChildren: () =>
          import("../inspections-details/inspections-details.module").then(
            (m) => m.InspectionsDetailsPageModule
          ),
      },
      {
        path: "scheduling-details",
        loadChildren: () =>
          import("../scheduling-detail/scheduling-detail.module").then(
            (m) => m.SchedulingDetailPageModule
          ),
      },
      {
        path: "start-inspection",
        loadChildren: () =>
          import("../start-inspection/start-inspection.module").then(
            (m) => m.StartInspectionPageModule
          ),
      },
      {
        path: "comprehensive-inspection",
        loadChildren: () =>
          import(
            "../comprehensive-inspection/comprehensive-inspection.module"
          ).then((m) => m.ComprehensiveInspectionPageModule),
      },

      {
        path: "environmental-inspection",
        loadChildren: () =>
          import(
            "../environmental-inspection/environmental-inspection.module"
          ).then((m) => m.EnvironmentalInspectionPageModule),
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
