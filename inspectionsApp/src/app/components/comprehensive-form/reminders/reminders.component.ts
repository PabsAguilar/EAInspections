import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Reminders } from "src/app/models/comprehensive-form/reminders";

@Component({
  selector: "app-reminders",
  templateUrl: "./reminders.component.html",
  styleUrls: ["./reminders.component.scss"],
})
export class RemindersComponent implements OnInit {
  totalProperties: number = 4;
  filledProperties: number = 0;
  isMenuOpen: boolean = false;
  progressPercentage: number = 0;
  progressColor: string = "danger";

  @Input()
  set data(value: Reminders) {
    this._data = value;
    this.changeModel(null);
  }
  @Output() dataChanged: any = new EventEmitter();
  _data: Reminders = new Reminders();

  constructor() {}

  ngOnInit() {}

  public toggleAccordion(): void {
    this.isMenuOpen = !this.isMenuOpen;
    this.dataChanged.emit(this._data);
  }

  changeModel($event) {
    this.filledProperties = 0;

    if (this._data.offerFinancing) {
      this.filledProperties++;
    }
    if (this._data.sticker) {
      this.filledProperties++;
    }
    if (this._data.brochure) {
      this.filledProperties++;
    }
    if (this._data.freeInspection) {
      this.filledProperties++;
    }
    this.progressPercentage =
      this.filledProperties == 0
        ? 0
        : this.filledProperties / this.totalProperties;

    //this.dataChanged.emit(this._data);

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
