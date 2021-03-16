import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExpertNetworkAgreementPageRoutingModule } from './expert-network-agreement-routing.module';

import { ExpertNetworkAgreementPage } from './expert-network-agreement.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExpertNetworkAgreementPageRoutingModule
  ],
  declarations: [ExpertNetworkAgreementPage]
})
export class ExpertNetworkAgreementPageModule {}
