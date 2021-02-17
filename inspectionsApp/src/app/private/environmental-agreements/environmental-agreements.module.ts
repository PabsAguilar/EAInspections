import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EnvironmentalAgreementsPageRoutingModule } from './environmental-agreements-routing.module';

import { EnvironmentalAgreementsPage } from './environmental-agreements.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EnvironmentalAgreementsPageRoutingModule
  ],
  declarations: [EnvironmentalAgreementsPage]
})
export class EnvironmentalAgreementsPageModule {}
