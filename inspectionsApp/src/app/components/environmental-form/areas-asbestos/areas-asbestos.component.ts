import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { AsbestoAreas } from "src/app/models/environmental-form/asbesto-areas";
import { ItestDealService } from "src/app/services/itest-deal.service";

@Component({
  selector: "app-areas-asbestos",
  templateUrl: "./areas-asbestos.component.html",
  styleUrls: ["./areas-asbestos.component.scss"],
})
export class AreasAsbestosComponent implements OnInit {
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
  get model(): AsbestoAreas {
    return this._model;
  }
  set model(value: AsbestoAreas) {
    this._model = value;

    if (value) {
      this.inspectionStorage.getInspectionTasksTypesList().then((data) => {
        this.listInspectionType = data
          .filter((x) => x.name.toLowerCase().indexOf("asbesto") >= 0)
          .map((item) => {
            return { name: item.name, value: item.id };
          });
      });
      this.AreaUpdated("init");
    }
  }
  _model: AsbestoAreas = new AsbestoAreas();

  @Output() modelChanged: any = new EventEmitter();

  constructor(private inspectionStorage: ItestDealService) {}

  ngOnInit() {}

  AreaUpdated($event) {
    this.filledAreas = !this.model.asbestosAreas
      ? 0
      : this.model.asbestosAreas.filter((y) => y.materialLocation).length;
    if ($event != "init") {
      this.model.syncInfo.updated = true;
    }

    if (this.filledAreas >= 1 && this.model.inspectionType) {
      this.progressColor = "success";
      this.progressPercentage = 1;
      console.log(this.model);
      this.modelChanged.emit(this.model);
    }
  }
}
