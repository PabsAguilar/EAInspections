import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Area } from "src/app/models/comprehensive-form/area";

@Component({
  selector: "app-areas",
  templateUrl: "./areas.component.html",
  styleUrls: ["./areas.component.scss"],
})
export class AreasComponent implements OnInit {
  public filledAreas: number = 0;
  public isMenuOpen: boolean = false;

  public progressColor: string = "danger";
  public progressPercentage: number = 0;
  public toggleAccordion(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  @Input()
  get InspectionAreas(): Area[] {
    return this.areas;
  }
  set InspectionAreas(value: Area[]) {
    this.areas = value;
    this.AreaUpdated();
  }
  areas: Area[] = [];
  @Output() AreasListChanged: any = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  AreaUpdated() {
    this.filledAreas = !this.areas
      ? 0
      : this.areas.filter((y) => y.name != "").length;
    if (this.filledAreas >= 1) {
      this.progressColor = "success";
      this.progressPercentage = 1;
      this.AreasListChanged.emit(this.areas);
    }
  }
}
