import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { MoistureMappingAreas } from "src/app/models/environmental-form/moisture-mapping-areas";
import { ItestDealService } from "src/app/services/itest-deal.service";

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
  listInspectionType: any[] = [];
  toggleAccordion(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
  @Input() readonly: boolean = false;
  @Input() title: string = "";
  @Input()
  get model(): MoistureMappingAreas {
    return this._model;
  }
  set model(value: MoistureMappingAreas) {
    this._model = value;

    try {
      if (this._model.dateTesed) {
        this._model.dateTesed = new Date(this._model.dateTesed).toISOString();
      }

      if (value) {
        this.inspectionStorage.getInspectionTasksTypesList().then((data) => {
          this.listInspectionType = data
            .filter((x) => x.name.toLowerCase().indexOf("moisture") >= 0)
            .map((item) => {
              return { name: item.name, value: item.id };
            });
        });
        this.AreaUpdated(null);
      }
    } catch (error) {
      console.log("Unspected error changing model.");
      console.log(error);
    }
  }
  _model: MoistureMappingAreas = new MoistureMappingAreas();

  @Output() modelChanged: any = new EventEmitter();

  constructor(private inspectionStorage: ItestDealService) {}

  ngOnInit() {}

  AreaUpdated($event) {
    try {
      this.filledAreas = !this.model.areamoistureMapping
        ? 0
        : this.model.areamoistureMapping.filter((y) => y.area).length;
      this.model.syncInfo.updated = true;
      if (this.filledAreas >= 1 && this.model.dateTesed) {
        this.progressColor = "success";
        this.progressPercentage = 1;
        console.log(this.model);
        this.modelChanged.emit(this.model);
      }
    } catch (error) {
      console.log("Unspected error changing areas model.");
      console.log(error);
    }
  }
}
