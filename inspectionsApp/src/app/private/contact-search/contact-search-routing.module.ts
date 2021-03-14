import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContactSearchPage } from './contact-search.page';

const routes: Routes = [
  {
    path: '',
    component: ContactSearchPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContactSearchPageRoutingModule {}
