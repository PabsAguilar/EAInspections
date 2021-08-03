import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { LeadAreas } from "src/app/models/environmental-form/lead-areas";
import { ItestDealService } from "src/app/services/itest-deal.service";

@Component({
  selector: "app-areas-lead",
  templateUrl: "./areas-lead.component.html",
  styleUrls: ["./areas-lead.component.scss"],
})
export class AreasLeadComponent implements OnInit {
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
  get model(): LeadAreas {
    return this._model;
  }
  set model(value: LeadAreas) {
    this._model = value;

    try {
      this._model.inspectionDate = new Date(
        this._model.inspectionDate
      ).toISOString();
      if (value) {
        this.inspectionStorage.getInspectionTasksTypesList().then((data) => {
          this.listInspectionType = data
            .filter((x) => x.name.toLowerCase().indexOf("lead") >= 0)
            .map((item) => {
              return { name: item.name, value: item.id };
            });
          this.AreaUpdated("init");
        });
      }
    } catch (error) {
      console.log("Unspected error changing model.");
      console.log(error);
    }
  }
  _model: LeadAreas = new LeadAreas();

  @Output() modelChanged: any = new EventEmitter();

  constructor(private inspectionStorage: ItestDealService) {}

  ngOnInit() {}

  AreaUpdated($event) {
    try {
      this.filledAreas = !this.model.leadAreas
        ? 0
        : this.model.leadAreas.filter((y) => y.sample).length;
      if ($event != "init") {
        this.model.syncInfo.updated = true;
      }

      if (this.filledAreas >= 1 && this.model.inspectionType) {
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
