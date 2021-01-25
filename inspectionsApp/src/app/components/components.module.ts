import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";

import { CommonModule } from "@angular/common";
import { GenericListPopOverComponent } from "./generic-list-pop-over/generic-list-pop-over.component";
import { SlidesPhotosComponent } from "./slides-photos/slides-photos.component";
import { InspectionGeneralComponent } from "./inspection-general/inspection-general.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { PhotoComponent } from "./photo/photo.component";
import { AreaComponent } from "./area/area.component";
import { AreasComponent } from "./areas/areas.component";

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule],
  declarations: [
    GenericListPopOverComponent,
    SlidesPhotosComponent,
    InspectionGeneralComponent,
    PhotoComponent,
    AreaComponent,
    AreasComponent,
  ],
  exports: [
    GenericListPopOverComponent,
    SlidesPhotosComponent,
    InspectionGeneralComponent,
    PhotoComponent,
    AreaComponent,
    AreasComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ComponentsModule {}
