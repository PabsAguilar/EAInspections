import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ComprehensiveInspectionPage } from './comprehensive-inspection.page';

const routes: Routes = [
  {
    path: '',
    component: ComprehensiveInspectionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComprehensiveInspectionPageRoutingModule {}
