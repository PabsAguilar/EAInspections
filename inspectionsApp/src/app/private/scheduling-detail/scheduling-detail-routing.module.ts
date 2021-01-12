import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SchedulingDetailPage } from './scheduling-detail.page';

const routes: Routes = [
  {
    path: '',
    component: SchedulingDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SchedulingDetailPageRoutingModule {}
