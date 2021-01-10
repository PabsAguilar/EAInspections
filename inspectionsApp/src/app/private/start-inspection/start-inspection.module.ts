import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StartInspectionPageRoutingModule } from './start-inspection-routing.module';

import { StartInspectionPage } from './start-inspection.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StartInspectionPageRoutingModule
  ],
  declarations: [StartInspectionPage]
})
export class StartInspectionPageModule {}
