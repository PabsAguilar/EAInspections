import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SetupBitrixTokenPageRoutingModule } from './setup-bitrix-token-routing.module';

import { SetupBitrixTokenPage } from './setup-bitrix-token.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SetupBitrixTokenPageRoutingModule
  ],
  declarations: [SetupBitrixTokenPage]
})
export class SetupBitrixTokenPageModule {}
