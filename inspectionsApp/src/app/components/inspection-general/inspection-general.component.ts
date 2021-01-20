import { Component, Input, OnInit } from "@angular/core";
import { GeneralInfoInspection } from "src/app/models/general-info-inspection";

@Component({
  selector: "app-inspection-general",
  templateUrl: "./inspection-general.component.html",
  styleUrls: ["./inspection-general.component.scss"],
})
export class InspectionGeneralComponent implements OnInit {
  public totalProperties: number = 4;
  public filledProperties: number = 0;
  public isMenuOpen: boolean = false;
  public progressPercentage: number = 0.05;
  public progressColor: string = "danger";
  public today: Date = new Date();
  maxDate: string = this.formatDate(this.today);
  minDate: string = this.formatDate(
    this.today.setFullYear(this.today.getFullYear() - 100)
  );
  formatDate(date) {
    let d = new Date(date),
      day = "" + d.getDate(),
      month = "" + (d.getMonth() + 1),
      year = d.getFullYear();
    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
    return [year, month, day].join("-");
  }

  @Input("ngModel")
  public generalInfoInspection: GeneralInfoInspection;

  constructor() {
    this.generalInfoInspection = new GeneralInfoInspection();
  }

  ngOnInit() {}
  changeModel($event) {
    console.log($event);
    console.log("selection change");
    this.filledProperties = 0;
    if (this.generalInfoInspection.propertyYearDate) {
      this.generalInfoInspection.propertyYear = new Date(
        this.generalInfoInspection.propertyYearDate
      ).getFullYear();
      this.filledProperties++;
    }
    if (this.generalInfoInspection.propertyType) {
      this.filledProperties++;
    }
    if (this.generalInfoInspection.pictureHouse) {
      this.filledProperties++;
    }
    if (
      this.generalInfoInspection.picturesFrontHouse &&
      this.generalInfoInspection.picturesFrontHouse.length > 0
    ) {
      this.filledProperties++;
    }
    this.progressPercentage = this.filledProperties / this.totalProperties;
    console.log(this.progressPercentage);
    switch (true) {
      case this.progressPercentage < 0.5:
        this.progressColor = "danger";
        break;
      case this.progressPercentage < 0.75:
        this.progressColor = "warning";
        break;
      case this.progressPercentage >= 1:
        this.progressColor = "sucess";
        break;

      default:
        this.progressColor = "danger";
        break;
    }
  }
  public toggleAccordion(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
