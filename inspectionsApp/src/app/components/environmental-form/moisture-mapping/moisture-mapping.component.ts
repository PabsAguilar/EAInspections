import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { MoistureMapping } from "src/app/models/environmental-form/moisture-mapping";

@Component({
  selector: "app-moisture-mapping",
  templateUrl: "./moisture-mapping.component.html",
  styleUrls: ["./moisture-mapping.component.scss"],
})
export class MoistureMappingComponent implements OnInit {
  public totalProperties: number = 10;
  public filledProperties: number = 0;
  public isMenuOpen: boolean = false;
  public progressPercentage: number = 0;
  public progressColor: string = "danger";
  conditions: any[] = [];
  decontaminationOptions: any[] = [];
  @Input()
  get model(): MoistureMapping {
    return this._model;
  }
  set model(value: MoistureMapping) {
    this._model = value;

    this.changeModel(null);
  }
  _model: MoistureMapping = new MoistureMapping();
  @Input() title: string = "";

  @Output() modelChanged: any = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  public toggleAccordion(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  changeModel($event) {
    this.filledProperties = 0;
    if (this._model.area) {
      this.filledProperties++;
    }

    if (this._model.dewPoint) {
      this.filledProperties++;
    }
    if (this._model.inspectionType) {
      this.filledProperties++;
    }
    if (this._model.relativeHumidity) {
      this.filledProperties++;
    }
    if (this._model.roomTemp) {
      this.filledProperties++;
    }
    if (this._model.standardTemperatureCeiling) {
      this.filledProperties++;
    }
    if (this._model.standardTemperatureEast) {
      this.filledProperties++;
    }
    if (this._model.standardTemperatureFloor) {
      this.filledProperties++;
    }
    if (this._model.standardTemperatureNorth) {
      this.filledProperties++;
    }
    if (this._model.standardTemperatureSouth) {
      this.filledProperties++;
    }
    if (this._model.standardTemperatureWest) {
      this.filledProperties++;
    }

    this.progressPercentage =
      this.filledProperties == 0
        ? 0
        : this.filledProperties / this.totalProperties;

    this.modelChanged.emit(this._model);

    switch (true) {
      case this.progressPercentage < 0.5:
        this.progressColor = "danger";
        break;
      case this.progressPercentage < 1:
        this.progressColor = "warning";
        break;
      case this.progressPercentage >= 1:
        this.progressColor = "success";
        break;
      default:
        this.progressColor = "danger";
        break;
    }
  }
}
