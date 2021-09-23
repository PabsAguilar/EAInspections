import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import {
  AlertController,
  LoadingController,
  ModalController,
  ToastController,
} from "@ionic/angular";
import { fromEventPattern } from "rxjs";
import { Company } from "src/app/models/company";
import { Contact } from "src/app/models/contact";
import {
  ITestDealMapping,
  InspectionStatus,
  SchedulingStatus,
  EnumEnterprise,
} from "src/app/models/enums";
import { Scheduling } from "src/app/models/scheduling";
import { TaskSubtype } from "src/app/models/task-subtype";
import { User } from "src/app/models/user";
import { AuthenticationService } from "src/app/services/authentication.service";
import { InspectionNavigateService } from "src/app/services/inspection-navigate.service";
import { ItestDealService } from "src/app/services/itest-deal.service";
import { SchedulingStorageService } from "src/app/services/scheduling-storage.service";
import { SyncInspectionService } from "src/app/services/sync-inspection.service";
import { CompanySearchPage } from "../company-search/company-search.page";
import { ContactSearchPage } from "../contact-search/contact-search.page";

@Component({
  selector: "app-scheduling",
  templateUrl: "./scheduling.page.html",
  styleUrls: ["./scheduling.page.scss"],
})
export class SchedulingPage implements OnInit {
  today = new Date();

  minDate: string = this.formatDate(this.today);
  maxDate: string = this.formatDate(
    this.today.setFullYear(this.today.getFullYear() + 1)
  );

  scheduling: Scheduling = new Scheduling();
  selectedDate: Date;
  fields: any[];

  constructor(
    private schedulingStorageService: SchedulingStorageService,
    public modalController: ModalController,
    private authenticationService: AuthenticationService,
    private navigateService: InspectionNavigateService,

    private inspectionService: ItestDealService,
    private alertController: AlertController,
    private syncInspectionService: SyncInspectionService,
    private toast: ToastController,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.scheduling = new Scheduling();

    this.route.queryParams.subscribe((params) => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.scheduling =
          this.router.getCurrentNavigation().extras.state.scheduling;
        this.scheduling.scheduleDateTime = new Date(
          this.scheduling.scheduleDateTime
        ).toISOString();
      }
    });
    authenticationService.getUser().then((x) => {
      this.user = x;
    });
  }

  inspectionTypes = [];

  inspectorsList: User[] = [];

  user: User = new User();

  ngOnInit() {
    console.log(this.minDate);
    console.log(this.maxDate);
  }

  async ionViewDidEnter() {
    var types = await this.inspectionService.getInspectionTasksTypesList();
    this.inspectorsList = await this.inspectionService.getInspectors(false);
    this.scheduling.inspectorUserId = this.user.userId;
    this.scheduling.enterprise = this.user.enterprise;
    this.scheduling.serviceType = this.user.enterprise;
    this.inspectionTypes = types.map((x) => {
      return { name: x.name, value: x.id, selected: false };
    });
  }

  contactIsSync() {
    return this.scheduling.contact.syncInfo.isSync;
  }

  formatDate(date) {
    let d = new Date(date),
      day = "" + d.getDate(),
      month = "" + (d.getMonth() + 1),
      year = d.getFullYear();
    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
    return [year, month, day].join("-");
  }

  async searchContact(type: string) {
    const modal = await this.modalController.create({
      component: ContactSearchPage,
      cssClass: "my-custom-class",
      componentProps: {
        enterprise: this.scheduling.serviceType,
        target: type,
      },
    });

    modal.onDidDismiss().then((data) => {
      const contact = data["data"]; // Here's your selected user!
      if (contact != null && contact.firstName) {
        switch (type) {
          case "contact":
            this.scheduling.contact = contact;
            break;
          case "insurance":
            this.scheduling.insuranceCompanyContact = contact;
            break;
          case "referal":
            this.scheduling.referalPartner = contact;
            break;
          default:
            break;
        }
      }
    });
    return await modal.present();
  }

  async clearSelectedContact(type) {
    switch (type) {
      case "contact":
        this.scheduling.contact = null;
        break;
      case "insurance":
        this.scheduling.insuranceCompanyContact = null;
        break;
      case "referal":
        this.scheduling.referalPartner = null;
        break;
      default:
        break;
    }
  }
  async clearSelectedCompany(type) {
    switch (type) {
      case "insurance":
        this.scheduling.insuranceCompany = null;
        break;
      case "referal":
        this.scheduling.referalPartnerCompany = null;
        break;
      default:
        break;
    }
  }

  async searchCompany(type: string) {
    const modal = await this.modalController.create({
      component: CompanySearchPage,
      cssClass: "my-custom-class",
      componentProps: {
        enterprise: this.scheduling.serviceType,
        target: type,
      },
    });

    modal.onDidDismiss().then((data) => {
      const company = data["data"]; // Here's your selected user!
      if (company != null && company.title) {
        switch (type) {
          case "insurance":
            this.scheduling.insuranceCompany = company;
            break;
          case "referal":
            this.scheduling.referalPartnerCompany = company;
            break;
          default:
            break;
        }
      }
    });
    return await modal.present();
  }

  async hourChanged() {
    try {
      if (!this.selectedDate) {
        return;
      }
      console.log(this.scheduling.scheduleDateTime);
      var hours = new Date(this.selectedDate);
      var dateSel = new Date(this.scheduling.scheduleDateTime);
      this.scheduling.scheduleDateTime = new Date(
        dateSel.getFullYear(),
        dateSel.getMonth(),
        dateSel.getDate(),
        hours.getHours(),
        hours.getMinutes(),
        0
      ).toISOString();

      console.log(this.scheduling.scheduleDateTime);
    } catch (error) {
      console.log(error);
    }
  }

  async onSubmit() {
    // this.scheduling = values;

    try {
      const alert = await this.alertController.create({
        header: "Confirm Inspection",
        message: "Are you sure you want to submit the deal?",
        buttons: [
          {
            text: "Cancel",
            role: "cancel",
            cssClass: "secondary",
            handler: () => {
              console.log("Cancel action");
            },
          },
          {
            text: "Ok",
            handler: async () => {
              console.log("Task Completed" + this.scheduling.id);
              console.log(this.scheduling);
              this.scheduling.enterprise = this.scheduling.serviceType;
              this.scheduling.internalStatus = SchedulingStatus.Pending;
              console.log(this.scheduling);
              this.scheduling.scheduleDateTime = new Date(
                this.scheduling.scheduleDateTime
              );
              var list = await this.schedulingStorageService.getAll();
              this.scheduling.id = ((list ? list.length : 0) + 1) * -1;
              this.schedulingStorageService.add(this.scheduling);

              const alert2 = await this.alertController.create({
                header: "Scheduling form",
                message: "Form is succesfully saved on the device.",
                buttons: [
                  {
                    text: "Ok",
                    cssClass: "primary",
                    handler: () => {
                      this.navigateService.moveToPendingInspection("New");
                    },
                  },
                ],
              });
              await alert2.present();

              var deal = this.scheduling;
              this.selectedDate = null;
              this.scheduling = new Scheduling();

              (
                await this.syncInspectionService.syncSchedulingInspection(
                  deal,
                  this.user
                )
              ).subscribe(async (x) => {
                if (x) {
                  var message = this.toast.create({
                    message: "Deal is synched.",
                    color: "success",
                    duration: 5000,
                  });
                  (await message).present();

                  this.syncInspectionService.publishSomeData({
                    syncItem: "deal",
                    refreshFromServer: false,
                  });
                } else {
                  var message = this.toast.create({
                    message: "Sync failed, please start a manual sync.",
                    color: "warning",
                    duration: 5000,
                  });
                  (await message).present();
                }
              });
            },
          },
        ],
      });
      await alert.present();
    } catch (error) {
      var message = this.toast.create({
        message: error,
        color: "danger",
        duration: 2000,
      });
      (await message).present();
    }
  }
}
