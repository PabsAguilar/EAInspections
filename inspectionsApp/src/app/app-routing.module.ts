import { NgModule } from "@angular/core";
import { AuthGuard } from "./guards/auth.guard";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    loadChildren: () =>
      import("./tabs/tabs.module").then((m) => m.TabsPageModule),
  },
  {
    path: "login",
    loadChildren: () =>
      import("./public/login/login.module").then((m) => m.LoginPageModule),
  },
  {
    path: "home",
    canActivate: [AuthGuard],
    loadChildren: () =>
      import("./private/home/home.module").then((m) => m.HomePageModule),
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
