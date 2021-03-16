import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExpertNetworkAgreementPage } from './expert-network-agreement.page';

const routes: Routes = [
  {
    path: '',
    component: ExpertNetworkAgreementPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExpertNetworkAgreementPageRoutingModule {}
