import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { GroupByPipe } from "./pipes/group-by.pipe";

@NgModule({
  declarations: [GroupByPipe],
  imports: [CommonModule],
  exports: [GroupByPipe],
})
export class SharedModule {}
