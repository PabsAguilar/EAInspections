import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StartInspectionPage } from './start-inspection.page';

const routes: Routes = [
  {
    path: '',
    component: StartInspectionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StartInspectionPageRoutingModule {}
