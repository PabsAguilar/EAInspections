import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CompanySearchPageRoutingModule } from './company-search-routing.module';

import { CompanySearchPage } from './company-search.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CompanySearchPageRoutingModule
  ],
  declarations: [CompanySearchPage]
})
export class CompanySearchPageModule {}
