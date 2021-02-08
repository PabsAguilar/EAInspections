import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { AsbestoAreas } from "src/app/models/environmental-form/asbesto-areas";

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
  toggleAccordion(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  @Input() title: string = "";
  @Input()
  get model(): AsbestoAreas {
    return this._model;
  }
  set model(value: AsbestoAreas) {
    this._model = value;
  }
  _model: AsbestoAreas = new AsbestoAreas();

  @Output() modelChanged: any = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  AreaUpdated($event) {
    this.filledAreas = !this.model.asbestosAreas
      ? 0
      : this.model.asbestosAreas.filter((y) => y.materialLocation).length;

    if (this.filledAreas >= 1 && this.model.inspectionType) {
      this.progressColor = "success";
      this.progressPercentage = 1;
      console.log(this.model);
      this.modelChanged.emit(this.model);
    }
  }
}
