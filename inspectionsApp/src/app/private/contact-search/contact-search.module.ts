import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { ContactSearchPageRoutingModule } from "./contact-search-routing.module";

import { ContactSearchPage } from "./contact-search.page";
import { BrowserModule } from "@angular/platform-browser";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ContactSearchPageRoutingModule
  ],
  declarations: [ContactSearchPage],
})
export class ContactSearchPageModule {}
