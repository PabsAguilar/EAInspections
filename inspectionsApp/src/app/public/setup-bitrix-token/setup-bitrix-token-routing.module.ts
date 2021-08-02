import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SetupBitrixTokenPage } from './setup-bitrix-token.page';

const routes: Routes = [
  {
    path: '',
    component: SetupBitrixTokenPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SetupBitrixTokenPageRoutingModule {}
