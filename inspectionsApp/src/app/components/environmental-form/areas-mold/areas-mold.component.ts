import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { DamageAreas } from "src/app/models/environmental-form/damage-areas";
import { DamageInspection } from "src/app/models/damage-inspection";
import { DamageAreaType } from "src/app/models/enums";
import { InspectionsStorageService } from "src/app/services/inspections-storage.service";
import { ItestDealService } from "src/app/services/itest-deal.service";
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";

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
  @Input() readonly: boolean = false;
  @Input() title: string = "";
  @Input() taskId: string = "";
  @Input() contactName: string = "";
  @Input()
  get model(): DamageAreas {
    return this._model;
  }
  set model(value: DamageAreas) {
    this._model = value;
    try {
      if (value) {
        this.inspectionStorage.getInspectionTasksTypesList().then((data) => {
          switch (value.type) {
            case DamageAreaType.Bacteria:
              this.damageInspectionType = data
                .filter((x) => x.name.toLowerCase().indexOf("bacteria") >= 0)
                .map((item) => {
                  return { name: item.name, value: item.id };
                });

              break;
            case DamageAreaType.Mold:
              this.damageInspectionType = data
                .filter((x) => x.name.toLowerCase().indexOf("mold") >= 0)
                .map((item) => {
                  return { name: item.name, value: item.id };
                });
              break;

            case DamageAreaType.Soot:
              this.damageInspectionType = data
                .filter((x) => x.name.toLowerCase().indexOf("soot") >= 0)
                .map((item) => {
                  return { name: item.name, value: item.id };
                });
              break;
          }
        });
        this._model = value;

        this.AreaUpdated(null);
      }
    } catch (error) {
      console.log("Unspected error changing model.");
      console.log(error);
    }
  }
  _model: DamageAreas = new DamageAreas("");
  damageInspectionType: any[] = [];
  @Output() modelChanged: any = new EventEmitter();

  constructor(private inspectionStorage: ItestDealService) {}

  ngOnInit() {}

  AreaUpdated($event) {
    try {
      this.filledAreas = !this.model.areasInspection
        ? 0
        : this.model.areasInspection.filter((y) => y.areaName).length;
      this._model.syncInfo.updated = true;
      if (this.filledAreas >= 1 && this.model.moldInspectionType) {
        this.progressColor = "success";
        this.progressPercentage = 1;
        console.log(this.model);
        this.modelChanged.emit(this.model);
      }
    } catch (error) {
      console.log("Unspected error changing model.");
      console.log(error);
    }
  }
}
