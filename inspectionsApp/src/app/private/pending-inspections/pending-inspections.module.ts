import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { PendingInspectionsPageRoutingModule } from "./pending-inspections-routing.module";

import { PendingInspectionsPage } from "./pending-inspections.page";
import { ExploreContainerComponentModule } from "src/app/explore-container/explore-container.module";
import { GenericListPopOverComponentModule } from "src/app/components/generic-list-pop-over/generic-list-pop-over.componentModule";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExploreContainerComponentModule,
    PendingInspectionsPageRoutingModule,
    GenericListPopOverComponentModule,
  ],
  providers: [Storage],
  declarations: [PendingInspectionsPage],
})
export class PendingInspectionsPageModule {}
