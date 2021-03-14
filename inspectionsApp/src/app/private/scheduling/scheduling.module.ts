import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { SchedulingPageRoutingModule } from "./scheduling-routing.module";

import { SchedulingPage } from "./scheduling.page";
import { ExploreContainerComponentModule } from "src/app/explore-container/explore-container.module";
import { ContactSearchPageModule } from "../contact-search/contact-search.module";
import { CompanySearchPageModule } from "../company-search/company-search.module";

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    SchedulingPageRoutingModule,
    ReactiveFormsModule,
    ContactSearchPageModule,
    CompanySearchPageModule,
  ],
  declarations: [SchedulingPage],
})
export class SchedulingPageModule {}
