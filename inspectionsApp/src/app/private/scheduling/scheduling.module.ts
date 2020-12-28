import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { SchedulingPageRoutingModule } from "./scheduling-routing.module";

import { SchedulingPage } from "./scheduling.page";
import { ExploreContainerComponentModule } from "src/app/explore-container/explore-container.module";

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    SchedulingPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [SchedulingPage],
})
export class SchedulingPageModule {}
