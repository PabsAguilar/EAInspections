import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { SummaryPageRoutingModule } from "./summary-routing.module";

import { SummaryPage } from "./summary.page";
import { SharedModule } from "src/app/shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SummaryPageRoutingModule,
    SharedModule,
  ],
  declarations: [SummaryPage],
})
export class SummaryPageModule {}
