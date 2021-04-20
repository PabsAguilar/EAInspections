import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { SchedulingPageRoutingModule } from "./scheduling-routing.module";

import { SchedulingPage } from "./scheduling.page";
import { ExploreContainerComponentModule } from "src/app/explore-container/explore-container.module";
import { ContactSearchPageModule } from "../contact-search/contact-search.module";
import { CompanySearchPageModule } from "../company-search/company-search.module";
import { MultipleRadioComponent } from "src/app/components/multiple-radio/multiple-radio.component";
import { SharedModule } from "src/app/shared/shared.module";

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

    SharedModule,
  ],
  declarations: [SchedulingPage, MultipleRadioComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SchedulingPageModule {}
