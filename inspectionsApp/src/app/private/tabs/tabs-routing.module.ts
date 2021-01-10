import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuardTaskParam } from "src/app/guards/auth.guard-task-param";

import { TabsPage } from "./tabs.page";

const routes: Routes = [
  {
    path: "tabs",
    component: TabsPage,
    children: [
      {
        path: "pending-inspections",
        loadChildren: () =>
          import("../pending-inspections/pending-inspections.module").then(
            (m) => m.PendingInspectionsPageModule
          ),
      },
    
      {
        path: "scheduling",
        loadChildren: () =>
          import("../scheduling/scheduling.module").then(
            (m) => m.SchedulingPageModule
          ),
      },
      {
        path: "tab3",
        loadChildren: () =>
          import("../tab3/tab3.module").then((m) => m.Tab3PageModule),
      },
    ],
  },
  {
    path: "",
    redirectTo: "tabs/pending-inspections",
    pathMatch: "full",
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
