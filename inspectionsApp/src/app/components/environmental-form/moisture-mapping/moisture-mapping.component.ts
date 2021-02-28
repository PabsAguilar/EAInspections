import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { MoistureMapping } from "src/app/models/environmental-form/moisture-mapping";
import { InspectionsStorageService } from "src/app/services/inspections-storage.service";
import { ItestDealService } from "src/app/services/itest-deal.service";

@Component({
  selector: "app-moisture-mapping",
  templateUrl: "./moisture-mapping.component.html",
  styleUrls: ["./moisture-mapping.component.scss"],
})
export class MoistureMappingComponent implements OnInit {
  public totalProperties: number = 9;
  public filledProperties: number = 0;
  public isMenuOpen: boolean = false;
  public progressPercentage: number = 0;
  public progressColor: string = "danger";
  listArea: any[] = [];
  conditions: any[] = [];
  decontaminationOptions: any[] = [];
  fields: any[] = [];
  selectAreaName: string;
  @Input()
  get model(): MoistureMapping {
    return this._model;
  }
  set model(value: MoistureMapping) {
    this._model = value;

    this.inspectionStorage.getEnvironmentalInspectionFields().then((x) => {
      this.fields = x[0];
      if (value) {
        this.listArea = Object.entries(
          this.fields[this._model.moistureMappingBitrixMap.areaCode]
            .DISPLAY_VALUES_FORM
        ).map(([k, v]) => ({ name: v, value: k }));
      }
    });
    this.changeModel(null);
  }
  _model: MoistureMapping = new MoistureMapping();
  @Input() title: string = "";

  @Output() modelChanged: any = new EventEmitter();

  constructor(private inspectionStorage: ItestDealService) {}

  ngOnInit() {}

  public toggleAccordion(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  changeModel($event) {
    this.filledProperties = 0;
    if (this._model.area) {
      this.filledProperties++;
      this.selectAreaName = this.listArea.find(
        (x) => x.value == this._model.area
      )?.name;
    }

    if (this._model.dewPoint) {
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
