import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EnvironmentalAgreementsPageRoutingModule } from './environmental-agreements-routing.module';

import { EnvironmentalAgreementsPage } from './environmental-agreements.page';
import { ExploreContainerComponentModule } from 'src/app/explore-container/explore-container.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExploreContainerComponentModule,
    ReactiveFormsModule,
    EnvironmentalAgreementsPageRoutingModule
  ],
  declarations: [EnvironmentalAgreementsPage]
})
export class EnvironmentalAgreementsPageModule {}
