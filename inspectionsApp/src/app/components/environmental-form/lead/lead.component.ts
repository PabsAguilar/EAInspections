import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { BitrixPictureList } from "src/app/models/bitrix-picture";
import { bitrixMappingEnvironmental } from "src/app/models/enums";
import { Lead } from "src/app/models/environmental-form/lead";
import { ItestDealService } from "src/app/services/itest-deal.service";

@Component({
  selector: "app-lead",
  templateUrl: "./lead.component.html",
  styleUrls: ["./lead.component.scss"],
})
export class LeadComponent implements OnInit {
  public totalProperties: number = 7;
  public filledProperties: number = 0;
  public isMenuOpen: boolean = false;
  public progressPercentage: number = 0;
  public progressColor: string = "danger";
  sampleCodeList: any[] = [];
  cardinalDirectionList: any[] = [];
  materialCodeList: any[] = [];
  typeOfSampleCode: any[] = [];
  labResultsCode: any[] = [];
  fields: any[] = [];
  other: string = "";
  selectAreaName: string;
  @Input() index: number;
  @Input()
  get model(): Lead {
    return this._model;
  }
  set model(value: Lead) {
    this._model = value;

    try {
      if (!this._model.areaPictures) {
        this._model.areaPictures = new BitrixPictureList();
      }

      this.inspectionStorage.getEnvironmentalInspectionFields().then((x) => {
        this.fields = x[0];
        if (value) {
          this.sampleCodeList = Object.entries(
            this.fields[bitrixMappingEnvironmental.Lead.sampleCode[this.index]]
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

          this.cardinalDirectionList = Object.entries(
            this.fields[
              bitrixMappingEnvironmental.Lead.cardinalDirectionCode[this.index]
            ].DISPLAY_VALUES_FORM
          ).map(([k, v]) => ({ name: v, value: k }));

          this.materialCodeList = Object.entries(
            this.fields[
              bitrixMappingEnvironmental.Lead.materialCode[this.index]
            ].DISPLAY_VALUES_FORM
          ).map(([k, v]) => ({ name: v, value: k }));

          this.typeOfSampleCode = Object.entries(
            this.fields[
              bitrixMappingEnvironmental.Lead.typeOfSampleCode[this.index]
            ].DISPLAY_VALUES_FORM
          ).map(([k, v]) => ({ name: v, value: k }));

          this.labResultsCode = Object.entries(
            this.fields[
              bitrixMappingEnvironmental.Lead.labResultsCode[this.index]
            ].DISPLAY_VALUES_FORM
          ).map(([k, v]) => ({ name: v, value: k }));
        }
        this.changeModel("init");
      });
    } catch (error) {
      console.log("Unspected error setting model.");
      console.log(error);
    }
  }
  _model: Lead = new Lead();
  @Input() title: string = "";
  @Input() readonly: boolean = false;

  @Output() modelChanged: any = new EventEmitter();

  constructor(private inspectionStorage: ItestDealService) {}

  ngOnInit() {}

  public toggleAccordion(): void {
    this.isMenuOpen = !this.isMenuOpen;
    this.modelChanged.emit(this._model);
  }

  changeModel($event) {
    try {
      this.filledProperties = 0;
      if (this._model.cardinalDirection) {
        this.filledProperties++;
      }

      if (this._model.dimensionCm2) {
        this.filledProperties++;
      }
      if (this._model.labResults) {
        this.filledProperties++;
      }
      if (this._model.material) {
        this.filledProperties++;
      }
      if (this._model.observations) {
        this.filledProperties++;
      }
      if (this._model.sample) {
        this.filledProperties++;
        this.selectAreaName = this.sampleCodeList.find(
          (x) => x.value == this._model.sample
        )?.name;

        if (
          this.selectAreaName &&
          this.selectAreaName.toLowerCase().includes("other") &&
          this._model.sampleOther
        ) {
          this.selectAreaName = this._model.sampleOther;
        }
      }
      if (this._model.typeOfSample) {
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
