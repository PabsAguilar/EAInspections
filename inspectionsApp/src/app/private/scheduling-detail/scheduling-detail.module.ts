import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SchedulingDetailPageRoutingModule } from './scheduling-detail-routing.module';

import { SchedulingDetailPage } from './scheduling-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SchedulingDetailPageRoutingModule
  ],
  declarations: [SchedulingDetailPage]
})
export class SchedulingDetailPageModule {}
