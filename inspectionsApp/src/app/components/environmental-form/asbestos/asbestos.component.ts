import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { BitrixPictureList } from "src/app/models/bitrix-picture";
import { bitrixMappingEnvironmental } from "src/app/models/enums";
import { Asbesto } from "src/app/models/environmental-form/asbesto";
import { ItestDealService } from "src/app/services/itest-deal.service";

@Component({
  selector: "app-asbestos",
  templateUrl: "./asbestos.component.html",
  styleUrls: ["./asbestos.component.scss"],
})
export class AsbestosComponent implements OnInit {
  public totalProperties: number = 7;
  public filledProperties: number = 0;
  public isMenuOpen: boolean = false;
  public progressPercentage: number = 0;
  public progressColor: string = "danger";
  fields: any[] = [];
  materialLocationList: any[] = [];
  F_NFList: any[] = [];
  conditionList: any[] = [];
  labResultsList: any[] = [];
  selectAreaName: string;
  other: string = "";
  @Input() index: number = 0;
  @Input() readonly: boolean = false;
  @Input()
  get model(): Asbesto {
    return this._model;
  }
  set model(value: Asbesto) {
    this._model = value;

    try {
      if (!this._model.areaPictures) {
        this._model.areaPictures = new BitrixPictureList();
      }
      this.inspectionStorage.getEnvironmentalInspectionFields().then((x) => {
        this.fields = x[0];
        if (value) {
          var bitrixFields = bitrixMappingEnvironmental.Asbestos;
          this.materialLocationList = Object.entries(
            this.fields[bitrixFields.materialLocationCode[this.index]]
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
              if ((v as string)?.toLowerCase().includes("other")) {
                this.other = k;
              }
              return { name: v, value: k };
            });

          this.F_NFList = Object.entries(
            this.fields[bitrixFields.F_NFCode[this.index]].DISPLAY_VALUES_FORM
          ).map(([k, v]) => ({ name: v, value: k }));

          this.conditionList = Object.entries(
            this.fields[bitrixFields.areaConditionCode[this.index]]
              .DISPLAY_VALUES_FORM
          ).map(([k, v]) => ({ name: v, value: k }));

          this.labResultsList = Object.entries(
            this.fields[bitrixFields.labResultsCode[this.index]]
              .DISPLAY_VALUES_FORM
          ).map(([k, v]) => ({ name: v, value: k }));
          this.changeModel("init");
        }
      });
    } catch (error) {
      console.log("Unspected error changing model.");
      console.log(error);
    }
  }
  _model: Asbesto = new Asbesto();
  @Input() title: string = "";

  @Output() modelChanged: any = new EventEmitter();

  constructor(private inspectionStorage: ItestDealService) {}

  ngOnInit() {}

  public toggleAccordion(): void {
    this.isMenuOpen = !this.isMenuOpen;
    this.modelChanged.emit("refresh");
  }

  changeModel($event) {
    try {
      this.filledProperties = 0;
      if (this._model.F_NF) {
        this.filledProperties++;
      }

      if (this._model.condition) {
        this.filledProperties++;
      }
      if (this._model.labResults) {
        this.filledProperties++;
      }
      if (this._model.materialDescription) {
        this.filledProperties++;
      }
      if (this._model.materialLocation) {
        this.filledProperties++;
        this.selectAreaName = this.materialLocationList.find(
          (x) => x.value == this._model.materialLocation
        )?.name;
        if (
          this.selectAreaName.toLowerCase().includes("other") &&
          this._model.materialLocationOther
        ) {
          this.selectAreaName = this._model.materialLocationOther;
        }
      }
      if (this._model.observations) {
        this.filledProperties++;
      }
      if (this._model.totalQuantity) {
        this.filledProperties++;
      }

      this.progressPercentage =
        this.filledProperties == 0
          ? 0
          : this.filledProperties / this.totalProperties;

      if ($event != "init") {
        this._model.syncInfo.updated = true;
      }

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
