import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { StartInspectionPageRoutingModule } from "./start-inspection-routing.module";

import { StartInspectionPage } from "./start-inspection.page";
import { InspectionGeneralComponent } from "src/app/components/inspection-general/inspection-general.component";
import { SlidesPhotosComponent } from "src/app/components/slides-photos/slides-photos.component";
import { PhotoComponent } from "src/app/components/photo/photo.component";
import { AreaComponent } from "src/app/components/area/area.component";
import { AreasComponent } from "src/app/components/areas/areas.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StartInspectionPageRoutingModule,
  ],
  declarations: [
    StartInspectionPage,
    InspectionGeneralComponent,
    SlidesPhotosComponent,
    PhotoComponent,
    AreaComponent,
    AreasComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class StartInspectionPageModule {}
