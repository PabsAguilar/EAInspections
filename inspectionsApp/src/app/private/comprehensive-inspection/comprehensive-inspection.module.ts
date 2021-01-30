import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { ComprehensiveInspectionPageRoutingModule } from "./comprehensive-inspection-routing.module";

import { ComprehensiveInspectionPage } from "./comprehensive-inspection.page";
import { InspectionGeneralComponent } from "src/app/components/comprehensive-form/inspection-general/inspection-general.component";
import { SlidesPhotosComponent } from "src/app/components/slides-photos/slides-photos.component";
import { PhotoComponent } from "src/app/components/photo/photo.component";
import { AreasComponent } from "src/app/components/comprehensive-form/areas/areas.component";
import { AreaComponent } from "src/app/components/comprehensive-form/area/area.component";
import { BathroomsComponent } from "src/app/components/comprehensive-form/bathrooms/bathrooms.component";
import { AreaGeneralConditionComponent } from "src/app/components/comprehensive-form/area-general-condition/area-general-condition.component";
import { KitchenComponent } from "src/app/components/comprehensive-form/kitchen/kitchen.component";
import { EnviromentalSectionComponent } from "src/app/components/comprehensive-form/enviromental-section/enviromental-section.component";
import { ExteriorComponent } from "src/app/components/comprehensive-form/exterior/exterior.component";
import { RecomendationsComponent } from "src/app/components/comprehensive-form/recomendations/recomendations.component";
import { InsuranceComponent } from "src/app/components/comprehensive-form/insurance/insurance.component";
import { RemindersComponent } from "src/app/components/comprehensive-form/reminders/reminders.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComprehensiveInspectionPageRoutingModule,
  ],
  declarations: [
    ComprehensiveInspectionPage,
    InspectionGeneralComponent,
    SlidesPhotosComponent,
    PhotoComponent,
    AreaComponent,
    AreasComponent,
    BathroomsComponent,
    AreaGeneralConditionComponent,
    KitchenComponent,
    EnviromentalSectionComponent,
    ExteriorComponent,
    RecomendationsComponent,
    InsuranceComponent,
    RemindersComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ComprehensiveInspectionPageModule {}
