import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PendingInspectionsPage } from './pending-inspections.page';

const routes: Routes = [
  {
    path: '',
    component: PendingInspectionsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PendingInspectionsPageRoutingModule {}
