import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { ComprehensiveInspectionPageRoutingModule } from "./comprehensive-inspection-routing.module";

import { ComprehensiveInspectionPage } from "./comprehensive-inspection.page";
import { InspectionGeneralComponent } from "src/app/components/inspection-general/inspection-general.component";
import { SlidesPhotosComponent } from "src/app/components/slides-photos/slides-photos.component";
import { PhotoComponent } from "src/app/components/photo/photo.component";
import { AreasComponent } from "src/app/components/areas/areas.component";
import { AreaComponent } from "src/app/components/area/area.component";
import { BathroomsComponent } from "src/app/components/bathrooms/bathrooms.component";
import { AreaGeneralConditionComponent } from "src/app/components/area-general-condition/area-general-condition.component";

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
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ComprehensiveInspectionPageModule {}
