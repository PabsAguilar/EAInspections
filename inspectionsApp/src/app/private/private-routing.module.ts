import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
  {
    path: "menu",
    loadChildren: () =>
      import("./menu/menu.module").then((m) => m.MenuPageModule),
  },
  {
    path: "inspections-details",
    loadChildren: () =>
      import("./inspections-details/inspections-details.module").then(
        (m) => m.InspectionsDetailsPageModule
      ),
  },
  {
    path: "summary",
    loadChildren: () =>
      import("./summary/summary.module").then((m) => m.SummaryPageModule),
  },
  {
    path: "scheduling-detail",
    loadChildren: () =>
      import("./scheduling-detail/scheduling-detail.module").then(
        (m) => m.SchedulingDetailPageModule
      ),
  },
  {
    path: "comprehensive-inspection",
    loadChildren: () =>
      import("./comprehensive-inspection/comprehensive-inspection.module").then(
        (m) => m.ComprehensiveInspectionPageModule
      ),
  },
  {
    path: "environmental-inspection",
    loadChildren: () =>
      import("./environmental-inspection/environmental-inspection.module").then(
        (m) => m.EnvironmentalInspectionPageModule
      ),
  },
  {
    path: "environmental-agreements",
    loadChildren: () =>
      import("./environmental-agreements/environmental-agreements.module").then(
        (m) => m.EnvironmentalAgreementsPageModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrivateRoutingModule {}
