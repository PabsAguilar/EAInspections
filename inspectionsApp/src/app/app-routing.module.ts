import { NgModule } from "@angular/core";
import { AuthGuard } from "./guards/auth.guard";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
import { AuthGuardExternal } from "./guards/auth.guard-external";

const routes: Routes = [
  {
    path: "login",
    canActivate: [AuthGuardExternal],
    loadChildren: () =>
      import("./public/login/login.module").then((m) => m.LoginPageModule),
  },
  {
    path: "menu",
    canActivate: [AuthGuard],
    loadChildren: () =>
      import("./private/menu/menu.module").then((m) => m.MenuPageModule),
  },  {
    path: 'image-modal',
    loadChildren: () => import('./components/image-modal/image-modal.module').then( m => m.ImageModalPageModule)
  },
  {
    path: 'setup-bitrix-token',
    loadChildren: () => import('./public/setup-bitrix-token/setup-bitrix-token.module').then( m => m.SetupBitrixTokenPageModule)
  },

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
