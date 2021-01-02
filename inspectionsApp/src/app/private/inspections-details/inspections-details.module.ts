import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InspectionsDetailsPageRoutingModule } from './inspections-details-routing.module';

import { InspectionsDetailsPage } from './inspections-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InspectionsDetailsPageRoutingModule
  ],
  declarations: [InspectionsDetailsPage]
})
export class InspectionsDetailsPageModule {}
