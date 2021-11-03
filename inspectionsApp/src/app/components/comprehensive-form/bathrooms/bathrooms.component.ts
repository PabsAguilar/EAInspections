import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Area } from "src/app/models/comprehensive-form/area";
import { BathroomConditions } from "src/app/models/enums";
import { GeneralCondition } from "src/app/models/comprehensive-form/general-condition";

@Component({
  selector: "app-bathrooms",
  templateUrl: "./bathrooms.component.html",
  styleUrls: ["./bathrooms.component.scss"],
})
export class BathroomsComponent implements OnInit {
  filledAreas: number = 0;
  isMenuOpen: boolean = false;
  progressColor: string = "danger";
  progressPercentage: number = 0;
  toggleAccordion(): void {
    this.isMenuOpen = !this.isMenuOpen;
    this.AreasListChanged.emit(this.bathrooms);
  }

  @Input()
  get InspectionAreas(): GeneralCondition[] {
    return this.bathrooms;
  }
  set InspectionAreas(value: GeneralCondition[]) {
    this.bathrooms = value;
    this.AreaUpdated("init");
  }
  bathrooms: GeneralCondition[] = [];
  @Output() AreasListChanged: any = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  AreaUpdated($event) {
    console.log(this.bathrooms);

    this.filledAreas = !this.bathrooms
      ? 0
      : this.bathrooms.filter((y) => y.condition.length > 0).length;
    if (this.filledAreas >= 1) {
      this.progressColor = "success";
      this.progressPercentage = 1;
      if ($event != "init") {
      }
    }
  }
}
