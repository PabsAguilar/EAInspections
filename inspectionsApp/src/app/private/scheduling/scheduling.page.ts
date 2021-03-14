import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import {
  AlertController,
  LoadingController,
  ModalController,
  ToastController,
} from "@ionic/angular";
import { fromEventPattern } from "rxjs";
import { Contact } from "src/app/models/contact";
import { InspectionStatus } from "src/app/models/enums";
import { Scheduling } from "src/app/models/scheduling";
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

  scheduling: Scheduling;
  selectedDate = new Date();

  constructor(
    private schedulingStorageService: SchedulingStorageService,
    public modalController: ModalController,
    private authenticationService: AuthenticationService,
    private navigateService: InspectionNavigateService,
    private loading: LoadingController,
    private alertController: AlertController,
    private syncInspectionService: SyncInspectionService,
    private toast: ToastController
  ) {
    this.scheduling = new Scheduling();
    authenticationService.getUser().then((x) => {
      this.user = x;
      this.scheduling.inspectorUserId = x.userId;
    });
  }

  user: User = new User();

  ngOnInit() {
    console.log(this.minDate);
    console.log(this.maxDate);
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

  async searchContact() {
    const modal = await this.modalController.create({
      component: ContactSearchPage,
      cssClass: "my-custom-class",
      componentProps: {
        enterprise: this.scheduling.serviceType,
      },
    });

    modal.onDidDismiss().then((data) => {
      const contact = data["data"]; // Here's your selected user!
      if (contact != null && contact.firstName) {
        this.scheduling.contact = contact;
      }
    });
    return await modal.present();
  }

  async searchInsuranceContact() {
    const modal = await this.modalController.create({
      component: ContactSearchPage,
      cssClass: "my-custom-class",
      componentProps: {
        enterprise: this.scheduling.serviceType,
      },
    });

    modal.onDidDismiss().then((data) => {
      const contact = data["data"]; // Here's your selected user!
      if (contact != null && contact.firstName) {
        this.scheduling.insuranceCompanyContact = contact;
      }
    });
    return await modal.present();
  }

  async searchInsuranceCompany() {
    const modal = await this.modalController.create({
      component: CompanySearchPage,
      cssClass: "my-custom-class",
      componentProps: {
        enterprise: this.scheduling.serviceType,
      },
    });

    modal.onDidDismiss().then((data) => {
      const company = data["data"]; // Here's your selected user!
      if (company != null && company.title) {
        this.scheduling.insuranceCompany = company;
      }
    });
    return await modal.present();
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

              this.scheduling.internalStatus = InspectionStatus.Pending;
              console.log(this.scheduling);
              this.scheduling.scheduleDateTime = new Date(
                this.scheduling.scheduleDateTime
              );
              var list = await this.schedulingStorageService.getAll();
              this.scheduling.id = ((list ? list.length : 0) + 1) * -1;
              this.schedulingStorageService.add(this.scheduling);
              var message = this.toast.create({
                message: "Deal is saved.",
                color: "success",
                duration: 3000,
              });

              var deal = this.scheduling;
              this.scheduling = new Scheduling();
              (await message).present();

              this.navigateService.moveToSummary("scheduling");

              (
                await this.syncInspectionService.syncSchedulingInspection(deal)
              ).subscribe(async (x) => {
                if (x) {
                  var message = this.toast.create({
                    message: "Deal is synched.",
                    color: "success",
                    duration: 5000,
                  });
                  (await message).present();
                } else {
                  var message = this.toast.create({
                    message: "Sync failed, please start a manual sync.",
                    color: "warning",
                    duration: 5000,
                  });
                  (await message).present();
                }
              });
              this.scheduling = new Scheduling();
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
