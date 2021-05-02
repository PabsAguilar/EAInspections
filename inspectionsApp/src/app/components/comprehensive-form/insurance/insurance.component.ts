import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Insurance } from "src/app/models/comprehensive-form/insurance";
import { ItestDealService } from "src/app/services/itest-deal.service";

@Component({
  selector: "app-insurance",
  templateUrl: "./insurance.component.html",
  styleUrls: ["./insurance.component.scss"],
})
export class InsuranceComponent implements OnInit {
  totalProperties: number = 7;
  filledProperties: number = 0;
  isMenuOpen: boolean = false;
  progressPercentage: number = 0;
  progressColor: string = "danger";

  haveInsuranceList: any[];
  claimForDamageBeforeList: any[];
  claimInLast5YearsList: any[];
  usePublicAdjusterList: any[];
  assignPAorAttorneyList: any[];
  fields: any[];

  @Input()
  set data(value: Insurance) {
    this._data = value;
    this.inspectionService.getDealsFields().then((x) => {
      this.fields = x[0];
      if (value) {
        this.haveInsuranceList = this.fields[
          this._data.insuranceBitrixMapping.haveInsuranceCode
        ].items.map((y) => {
          return { name: y.VALUE, value: y.ID };
        });
        this.claimForDamageBeforeList = this.fields[
          this._data.insuranceBitrixMapping.claimForDamageBeforeCode
        ].items.map((y) => {
          return { name: y.VALUE, value: y.ID };
        });
        this.claimInLast5YearsList = this.fields[
          this._data.insuranceBitrixMapping.claimInLast5YearsCode
        ].items.map((y) => {
          return { name: y.VALUE, value: y.ID };
        });
        this.usePublicAdjusterList = this.fields[
          this._data.insuranceBitrixMapping.usePublicAdjusterCode
        ].items.map((y) => {
          return { name: y.VALUE, value: y.ID };
        });
      }
    });
    this.changeModel("init");
  }
  @Output() dataChanged: any = new EventEmitter();
  _data: Insurance = new Insurance();

  @Input() readonly: boolean = false;
  constructor(private inspectionService: ItestDealService) {}

  ngOnInit() {}

  public toggleAccordion(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  changeModel($event) {
    this.filledProperties = 0;

    if (this._data.picturesPolicy.images.length > 0) {
      this.filledProperties++;
    }
    if (this._data.notes) {
      this.filledProperties++;
    }
    if (this._data.insuranceCarrier) {
      this.filledProperties++;
    }

    if (this._data.haveInsurance) {
      this.filledProperties++;
    }
    if (this._data.claimForDamageBefore) {
      this.filledProperties++;
    }
    if (this._data.claimInLast5Years) {
      this.filledProperties++;
    }
    if (this._data.usePublicAdjuster) {
      this.filledProperties++;
    }
    if (this._data.assignPAorAttorney) {
      this.filledProperties++;
    }
    this.progressPercentage =
      this.filledProperties == 0
        ? 0
        : this.filledProperties / this.totalProperties;

    if ($event != "init") {
      this.dataChanged.emit(this._data);
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
  }
}
