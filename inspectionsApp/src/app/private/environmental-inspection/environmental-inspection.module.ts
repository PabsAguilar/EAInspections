import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { EnvironmentalInspectionPageRoutingModule } from "./environmental-inspection-routing.module";

import { EnvironmentalInspectionPage } from "./environmental-inspection.page";
import { InspectionGeneralComponent } from "src/app/components/comprehensive-form/inspection-general/inspection-general.component";
import { SlidesPhotosComponent } from "src/app/components/slides-photos/slides-photos.component";
import { PhotoComponent } from "src/app/components/photo/photo.component";
import { MultipleRadioComponent } from "src/app/components/multiple-radio/multiple-radio.component";
import { AreaMoldComponent } from "src/app/components/environmental-form/area-mold/area-mold.component";
import { AreasMoldComponent } from "src/app/components/environmental-form/areas-mold/areas-mold.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EnvironmentalInspectionPageRoutingModule,
  ],
  declarations: [
    EnvironmentalInspectionPage,
    InspectionGeneralComponent,
    SlidesPhotosComponent,
    PhotoComponent,
    MultipleRadioComponent,
    AreaMoldComponent,
    AreasMoldComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class EnvironmentalInspectionPageModule {}
