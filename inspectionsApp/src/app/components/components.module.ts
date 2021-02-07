import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";

import { CommonModule } from "@angular/common";
import { GenericListPopOverComponent } from "./generic-list-pop-over/generic-list-pop-over.component";
import { SlidesPhotosComponent } from "./slides-photos/slides-photos.component";
import { InspectionGeneralComponent } from "./comprehensive-form/inspection-general/inspection-general.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { PhotoComponent } from "./photo/photo.component";
import { AreaComponent } from "./comprehensive-form/area/area.component";
import { AreasComponent } from "./comprehensive-form/areas/areas.component";
import { BathroomsComponent } from "./comprehensive-form/bathrooms/bathrooms.component";
import { AreaGeneralConditionComponent } from "./comprehensive-form/area-general-condition/area-general-condition.component";
import { EnviromentalSectionComponent } from "./comprehensive-form/enviromental-section/enviromental-section.component";
import { ExteriorComponent } from "./comprehensive-form/exterior/exterior.component";
import { RecomendationsComponent } from "./comprehensive-form/recomendations/recomendations.component";
import { InsuranceComponent } from "./comprehensive-form/insurance/insurance.component";
import { RemindersComponent } from "./comprehensive-form/reminders/reminders.component";
import { MultipleRadioComponent } from "./multiple-radio/multiple-radio.component";
import { AreaMoldComponent } from "./environmental-form/area-mold/area-mold.component";
import { AreasMoldComponent } from "./environmental-form/areas-mold/areas-mold.component";

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule],
  declarations: [
    GenericListPopOverComponent,
    SlidesPhotosComponent,
    InspectionGeneralComponent,
    PhotoComponent,
    AreaComponent,
    AreasComponent,
    BathroomsComponent,
    AreaGeneralConditionComponent,
    EnviromentalSectionComponent,
    ExteriorComponent,
    RecomendationsComponent,
    InsuranceComponent,
    RemindersComponent,
    MultipleRadioComponent,
    AreaMoldComponent,
    AreasMoldComponent,
  ],
  exports: [
    GenericListPopOverComponent,
    SlidesPhotosComponent,
    InspectionGeneralComponent,
    PhotoComponent,
    AreaComponent,
    AreasComponent,
    BathroomsComponent,
    AreaGeneralConditionComponent,
    EnviromentalSectionComponent,
    ExteriorComponent,
    RecomendationsComponent,
    InsuranceComponent,
    RemindersComponent,
    MultipleRadioComponent,
    AreaMoldComponent,
    AreasMoldComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ComponentsModule {}
