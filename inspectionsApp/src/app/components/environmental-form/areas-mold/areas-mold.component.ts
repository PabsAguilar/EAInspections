import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { MoldAreas } from "src/app/models/environmental-form/mold-areas";
import { MoldInspection } from "src/app/models/mold-inspection";

@Component({
  selector: "app-areas-mold",
  templateUrl: "./areas-mold.component.html",
  styleUrls: ["./areas-mold.component.scss"],
})
export class AreasMoldComponent implements OnInit {
  filledAreas: number = 0;
  isMenuOpen: boolean = false;
  progressColor: string = "danger";
  progressPercentage: number = 0;
  toggleAccordion(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  @Input()
  get model(): MoldAreas {
    return this._model;
  }
  set model(value: MoldAreas) {
    this._model = value;
    this.AreaUpdated(null);
  }
  _model: MoldAreas = new MoldAreas();
  @Output() modelChanged: any = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  AreaUpdated($event) {
    this.filledAreas = !this.model.areasMold
      ? 0
      : this.model.areasMold.filter((y) => y.areaName).length;

    if (this.filledAreas >= 1 && this.model.moldInspectionType) {
      this.progressColor = "success";
      this.progressPercentage = 1;
      console.log(this.model);
      this.modelChanged.emit(this.model);
    }
  }
}
