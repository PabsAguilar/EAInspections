import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Area } from "src/app/models/area";

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
    console.log("AreaUpdated");
    this.filledAreas = this.areas.filter((y) => y.name != "").length;
    if (this.filledAreas >= 1) {
      this.progressColor = "success";
      this.progressPercentage = 1;
      this.AreasListChanged.emit(this.areas);
    }
  }
}