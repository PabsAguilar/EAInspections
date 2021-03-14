import { Component, Input, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { Company } from "src/app/models/company";
import { ItestDealService } from "src/app/services/itest-deal.service";

@Component({
  selector: "app-company-search",
  templateUrl: "./company-search.page.html",
  styleUrls: ["./company-search.page.scss"],
})
export class CompanySearchPage implements OnInit {
  constructor(
    private itestService: ItestDealService,
    private modalController: ModalController // public formBuilder: FormBuilder
  ) {}

  ngOnInit() {}

  @Input() enterprise: string = "";
  nameSearchText: string = "";
  searching: any = false;
  selectedCompany: Company;
  newCompany: Company = new Company();
  companiesListFound: Company[] = [];
  createCompany: boolean = false;

  async searchName() {
    if (this.nameSearchText.length > 1) {
      this.searching = true;
      this.companiesListFound = await this.itestService.getCompaniesByName(
        this.nameSearchText
      );
      this.searching = false;
    }
  }

  back() {
    this.confirmCompany();
  }

  async selectCompany(id) {
    this.companiesListFound.forEach((element) => {
      if (element.id == id) {
        element.selected = true;
        this.selectedCompany = element;
      }
    });
  }

  async isCompanySelected() {
    return this.selectedCompany.title;
  }
  async confirmCompany() {
    this.modalController.dismiss(this.selectedCompany);
  }

  async clearSelectedCompany() {
    this.selectedCompany = null;
    this.companiesListFound.forEach((item) => (item.selected = false));
  }

  async saveNewCompany() {
    this.selectedCompany = this.newCompany;
  }
}
