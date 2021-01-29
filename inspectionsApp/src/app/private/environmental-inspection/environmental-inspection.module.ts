import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EnvironmentalInspectionPageRoutingModule } from './environmental-inspection-routing.module';

import { EnvironmentalInspectionPage } from './environmental-inspection.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EnvironmentalInspectionPageRoutingModule
  ],
  declarations: [EnvironmentalInspectionPage]
})
export class EnvironmentalInspectionPageModule {}
