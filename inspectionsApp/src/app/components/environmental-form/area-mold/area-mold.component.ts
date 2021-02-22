import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

import { DamageInspection } from "src/app/models/damage-inspection";
import { DamageAreaType } from "src/app/models/enums";
import { Sample } from "src/app/models/environmental-form/sample";
import { InspectionsStorageService } from "src/app/services/inspections-storage.service";

@Component({
  selector: "app-area-mold",
  templateUrl: "./area-mold.component.html",
  styleUrls: ["./area-mold.component.scss"],
})
export class AreaMoldComponent implements OnInit {
  public totalProperties: number = 21;
  public filledProperties: number = 0;
  public isMenuOpen: boolean = false;
  public progressPercentage: number = 0;
  public progressColor: string = "danger";
  listCondition: any[] = [];
  listArea: any[] = [];
  listRemoveCeiling: any[] = [];
  listRemoveDrywall: any[] = [];
  listRemoveBaseboards: any[] = [];
  listRemoveFlooring: any[] = [];
  listDecontamination: any[] = [];
  listFurniture: any[] = [];
  listbeddingsOption: any[] = [];
  listSampleType: any[] = [];
  listlabResults: any[] = [];
  listToxicMold: any[] = [];
  selectAreaName: string;
  fields: any[];
  @Input()
  get model(): DamageInspection {
    return this._model;
  }
  set model(value: DamageInspection) {
    this._model = value;
    this.changeModel(null);
    this.inspectionStorage.getEnvironmentalInspectionFields().then((x) => {
      this.fields = x[0];
      if (value) {
        this.listArea = Object.entries(
          this.fields[this._model.damageInspectionBitrixMapping.areaNameCode]
            .DISPLAY_VALUES_FORM
        ).map(([k, v]) => ({ name: v, value: k }));
        this.listCondition = Object.entries(
          this.fields[this._model.damageInspectionBitrixMapping.conditionCode]
            .DISPLAY_VALUES_FORM
        ).map(([k, v]) => ({ name: v, value: k, checked: false }));
        this.listRemoveCeiling = Object.entries(
          this.fields[
            this._model.damageInspectionBitrixMapping.removeCeilingCode
          ].DISPLAY_VALUES_FORM
        ).map(([k, v]) => ({ name: v, value: k }));
        this.listRemoveDrywall = Object.entries(
          this.fields[
            this._model.damageInspectionBitrixMapping.removeDrywallCode
          ].DISPLAY_VALUES_FORM
        ).map(([k, v]) => ({ name: v, value: k }));
        this.listRemoveBaseboards = Object.entries(
          this.fields[
            this._model.damageInspectionBitrixMapping.removeBaseboardsCode
          ].DISPLAY_VALUES_FORM
        ).map(([k, v]) => ({ name: v, value: k }));
        this.listRemoveFlooring = Object.entries(
          this.fields[
            this._model.damageInspectionBitrixMapping.removeFlooringCode
          ].DISPLAY_VALUES_FORM
        ).map(([k, v]) => ({ name: v, value: k }));

        this.listDecontamination = Object.entries(
          this.fields[
            this._model.damageInspectionBitrixMapping.decontaminationCode
          ].DISPLAY_VALUES_FORM
        ).map(([k, v]) => ({ name: v, value: k }));

        this.listFurniture = Object.entries(
          this.fields[
            this._model.damageInspectionBitrixMapping.furnitureOptionCode
          ].DISPLAY_VALUES_FORM
        ).map(([k, v]) => ({ name: v, value: k }));
        this.listbeddingsOption = Object.entries(
          this.fields[
            this._model.damageInspectionBitrixMapping.beddingsOptionCode
          ].DISPLAY_VALUES_FORM
        ).map(([k, v]) => ({ name: v, value: k }));
        this.listSampleType = [];
        this._model.samples.forEach((item: Sample, index) => {
          if (this._model.type == DamageAreaType.Mold) {
            var t = Object.entries(
              this.fields[item.sampleBitrixMapping.toxicMoldCode]
                .DISPLAY_VALUES_FORM
            ).map(([k, v]) => ({ name: v, value: k, sample: index }));
            this.listToxicMold = this.listToxicMold.concat(t);
          }
          //lab results
          var l = Object.entries(
            this.fields[item.sampleBitrixMapping.labResultCode]
              .DISPLAY_VALUES_FORM
          ).map(([k, v]) => ({ name: v, value: k, sample: index }));
          this.listlabResults = this.listlabResults.concat(l);

          //sample type
          var s = Object.entries(
            this.fields[item.sampleBitrixMapping.sampleTypeCode]
              .DISPLAY_VALUES_FORM
          ).map(([k, v]) => ({ name: v, value: k, sample: index }));
          this.listSampleType = this.listSampleType.concat(s);
        });
      }
    });
  }
  _model: DamageInspection = new DamageInspection("");
  @Input() title: string = "";

  @Output() modelChanged: any = new EventEmitter();

  constructor(private inspectionStorage: InspectionsStorageService) {}

  ngOnInit() {}

  public toggleAccordion(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  changeModel($event) {
    this.filledProperties = 0;
    if (this._model.areaPictures.length > 0) {
      this.filledProperties++;
    }
    if (this._model.areaCondition.length > 0) {
      this.filledProperties++;
    }
    if (this._model.areaName) {
      this.selectAreaName = this.listArea.find(
        (x) => x.value == this._model.areaName
      )?.name;
      this.filledProperties++;
    }
    if (this._model.areaRH) {
      this.filledProperties++;
    }
    if (this._model.beddingsOption) {
      this.filledProperties++;
    }
    if (this._model.ceilingNotes) {
      this.filledProperties++;
    }
    if (this._model.decontamination.length > 0) {
      this.filledProperties++;
    }
    if (this._model.drywallNotes) {
      this.filledProperties++;
    }
    if (this._model.areaNotes) {
      this.filledProperties++;
    }

    if (this._model.flooringNotes) {
      this.filledProperties++;
    }
    if (this._model.furnitureOption) {
      this.filledProperties++;
    }
    if (this._model.observations) {
      this.filledProperties++;
    }
    if (this._model.baseboardsNotes) {
      this.filledProperties++;
    }
    if (this._model.removeBaseboards) {
      this.filledProperties++;
    }
    if (this._model.removeCeiling) {
      this.filledProperties++;
    }
    if (this._model.recomendations) {
      this.filledProperties++;
    }

    this.filledProperties =
      this.filledProperties +
      this._model.samples.filter((x) => x.type && x.labResult).length;

    if (this._model.type == DamageAreaType.Mold) {
      this._model.samples.forEach((item) => {
        if (item.toxicMold) {
          this.listToxicMold.forEach((toxicItem) => {
            if (item.toxicMold == toxicItem.value) {
              item.toxicMoldboolean = toxicItem.name == "Yes" ? true : false;
            }
          });
        }
      });
    }

    if (this._model.removeDrywall) {
      this.filledProperties++;
    }
    if (this._model.removeFlooring) {
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
