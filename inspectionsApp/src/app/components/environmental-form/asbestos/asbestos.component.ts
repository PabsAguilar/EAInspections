import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
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
  @Input() readonly: boolean = false;
  @Input()
  get model(): Asbesto {
    return this._model;
  }
  set model(value: Asbesto) {
    this._model = value;

    this.inspectionStorage.getEnvironmentalInspectionFields().then((x) => {
      this.fields = x[0];
      if (value) {
        this.materialLocationList = Object.entries(
          this.fields[this._model.asbestoBitrixMaping.materialLocationCode]
            .DISPLAY_VALUES_FORM
        ).map(([k, v]) => {
          if ((v as string)?.toLowerCase().includes("other")) {
            this.other = k;
          }
          return { name: v, value: k };
        });

        this.F_NFList = Object.entries(
          this.fields[this._model.asbestoBitrixMaping.F_NFCode]
            .DISPLAY_VALUES_FORM
        ).map(([k, v]) => ({ name: v, value: k }));

        this.conditionList = Object.entries(
          this.fields[this._model.asbestoBitrixMaping.conditionCode]
            .DISPLAY_VALUES_FORM
        ).map(([k, v]) => ({ name: v, value: k }));

        this.labResultsList = Object.entries(
          this.fields[this._model.asbestoBitrixMaping.labResultsCode]
            .DISPLAY_VALUES_FORM
        ).map(([k, v]) => ({ name: v, value: k }));
        this.changeModel("init");
      }
    });
  }
  _model: Asbesto = new Asbesto();
  @Input() title: string = "";

  @Output() modelChanged: any = new EventEmitter();

  constructor(private inspectionStorage: ItestDealService) {}

  ngOnInit() {}

  public toggleAccordion(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  changeModel($event) {
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
      this.modelChanged.emit(this._model);
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
  }
}
