import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PendingInspectionsPageRoutingModule } from './pending-inspections-routing.module';

import { PendingInspectionsPage } from './pending-inspections.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PendingInspectionsPageRoutingModule
  ],
  declarations: [PendingInspectionsPage]
})
export class PendingInspectionsPageModule {}
