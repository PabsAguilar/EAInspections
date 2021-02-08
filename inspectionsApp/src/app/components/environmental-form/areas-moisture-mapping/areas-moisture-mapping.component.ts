import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { MoistureMappingAreas } from "src/app/models/environmental-form/moisture-mapping-areas";

@Component({
  selector: "app-areas-moisture-mapping",
  templateUrl: "./areas-moisture-mapping.component.html",
  styleUrls: ["./areas-moisture-mapping.component.scss"],
})
export class AreasMoistureMappingComponent implements OnInit {
  filledAreas: number = 0;
  isMenuOpen: boolean = false;
  progressColor: string = "danger";
  progressPercentage: number = 0;
  toggleAccordion(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  @Input() title: string = "";
  @Input()
  get model(): MoistureMappingAreas {
    return this._model;
  }
  set model(value: MoistureMappingAreas) {
    this._model = value;
  }
  _model: MoistureMappingAreas = new MoistureMappingAreas();

  @Output() modelChanged: any = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  AreaUpdated($event) {
    this.filledAreas = !this.model.areamoistureMapping
      ? 0
      : this.model.areamoistureMapping.filter((y) => y.area).length;

    if (this.filledAreas >= 1 && this.model.dateTesed) {
      this.progressColor = "success";
      this.progressPercentage = 1;
      console.log(this.model);
      this.modelChanged.emit(this.model);
    }
  }
}
