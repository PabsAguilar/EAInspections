import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { GroupByPipe } from "./pipes/group-by.pipe";
import { FilterByFieldPipe } from "./pipes/filter-by-field.pipe";

@NgModule({
  declarations: [GroupByPipe, FilterByFieldPipe],
  imports: [CommonModule],
  exports: [GroupByPipe, FilterByFieldPipe],
})
export class SharedModule {}
