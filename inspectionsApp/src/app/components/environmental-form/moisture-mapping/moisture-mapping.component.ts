import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { BitrixPictureList } from "src/app/models/bitrix-picture";
import { bitrixMappingEnvironmental } from "src/app/models/enums";
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
  other: string = "";
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
    if (!this._model.areaPictures) {
      this._model.areaPictures = new BitrixPictureList();
    }
    this.inspectionStorage.getEnvironmentalInspectionFields().then((x) => {
      this.fields = x[0];
      if (value) {
        this.listArea = Object.entries(
          this.fields[bitrixMappingEnvironmental.Moisture.areaCode[this.index]]
            .DISPLAY_VALUES_FORM
        )
          .sort(function (a, b) {
            if (
              (a[1] as string).toLowerCase().includes("control") &&
              !(b[1] as string).toLowerCase().includes("control")
            ) {
              return -1;
            } else if (
              !(a[1] as string).toLowerCase().includes("control") &&
              (b[1] as string).toLowerCase().includes("control")
            ) {
              return 1;
            } else return 0;
          })
          .map(([k, v]) => {
            if ((v as string).toLowerCase().includes("other")) {
              this.other = k;
            }
            return { name: v, value: k };
          });
        this.changeModel("init");
      }
    });
    //this.changeModel("init");
  }
  _model: MoistureMapping = new MoistureMapping();
  @Input() title: string = "";
  @Input() index: number;
  @Input() readonly: boolean = false;

  @Output() modelChanged: any = new EventEmitter();

  constructor(private inspectionStorage: ItestDealService) {}

  ngOnInit() {}

  public toggleAccordion(): void {
    this.isMenuOpen = !this.isMenuOpen;
    this.modelChanged.emit("refresh");
    this.changeModel("init");
  }

  changeModel($event) {
    if ($event != "init") {
      this._model.syncInfo.updated = true;
    }

    try {
      var progress = 0;
      this.filledProperties = 0;
      if (this._model.area) {
        progress++;
        this.selectAreaName = this.listArea.find(
          (x) => x.value == this._model.area
        )?.name;
        if (
          this.selectAreaName &&
          this.selectAreaName.toLowerCase().includes("other") &&
          this._model.areaOther
        ) {
          this.selectAreaName = this._model.areaOther;
        }
      }

      if (this._model.dewPoint) {
        progress++;
      }

      if (this._model.relativeHumidity) {
        progress++;
      }
      if (this._model.roomTemp) {
        progress++;
      }
      if (this._model.standardTemperatureCeiling) {
        progress++;
      }
      if (this._model.standardTemperatureEast) {
        progress++;
      }
      if (this._model.standardTemperatureFloor) {
        progress++;
      }
      if (this._model.standardTemperatureNorth) {
        progress++;
      }
      if (this._model.standardTemperatureSouth) {
        progress++;
      }
      if (this._model.standardTemperatureWest) {
        progress++;
      }

      this.progressPercentage =
        progress == 0 ? 0 : progress / this.totalProperties;

      this.filledProperties = progress;

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
    } catch (error) {
      console.log("Unspected error changing model.");
      console.log(error);
    }
  }
}
