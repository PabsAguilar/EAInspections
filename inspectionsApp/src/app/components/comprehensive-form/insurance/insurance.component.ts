import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Insurance } from "src/app/models/comprehensive-form/insurance";

@Component({
  selector: "app-insurance",
  templateUrl: "./insurance.component.html",
  styleUrls: ["./insurance.component.scss"],
})
export class InsuranceComponent implements OnInit {
  totalProperties: number = 2;
  filledProperties: number = 0;
  isMenuOpen: boolean = false;
  progressPercentage: number = 0;
  progressColor: string = "danger";

  @Input()
  set data(value: Insurance) {
    this._data = value;
    this.changeModel(null);
  }
  @Output() dataChanged: any = new EventEmitter();
  _data: Insurance = new Insurance();

  constructor() {}

  ngOnInit() {}

  public toggleAccordion(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  changeModel($event) {
    this.filledProperties = 0;

    if (this._data.picturesPolicy.length > 0) {
      this.filledProperties++;
    }
    if (this._data.notes) {
      this.filledProperties++;
    }
    if (this._data.insuranceCarrier) {
      this.filledProperties++;
    }
    this.progressPercentage =
      this.filledProperties == 0
        ? 0
        : this.filledProperties / this.totalProperties;

    this.dataChanged.emit(this._data);

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
