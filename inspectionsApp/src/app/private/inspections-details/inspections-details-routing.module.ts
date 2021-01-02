import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InspectionsDetailsPage } from './inspections-details.page';

const routes: Routes = [
  {
    path: '',
    component: InspectionsDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InspectionsDetailsPageRoutingModule {}
