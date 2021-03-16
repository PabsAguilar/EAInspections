import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  AlertController,
  LoadingController,
  NavController,
  PopoverController,
  ToastController,
} from "@ionic/angular";
import { GenericListPopOverComponent } from "src/app/components/generic-list-pop-over/generic-list-pop-over.component";
import { InspectionStatus } from "src/app/models/enums";
import { EnvironmentalForm } from "src/app/models/environmental-form";
import { InspectionTask } from "src/app/models/inspection-task";
import { InspectionNavigateService } from "src/app/services/inspection-navigate.service";
import { InspectionsStorageService } from "src/app/services/inspections-storage.service";
import { ItestDealService } from "src/app/services/itest-deal.service";
import { SyncInspectionService } from "src/app/services/sync-inspection.service";

@Component({
  selector: "app-environmental-inspection",
  templateUrl: "./environmental-inspection.page.html",
  styleUrls: ["./environmental-inspection.page.scss"],
})
export class EnvironmentalInspectionPage implements OnInit {
  task: InspectionTask;
  constructor(
    private router: Router,
    public alertController: AlertController,
    public loadingController: LoadingController,
    public inspectionService: ItestDealService,
    public navController: NavController,
    private toast: ToastController,
    private inspectionNavigate: InspectionNavigateService,
    private popoverController: PopoverController,
    private syncInspectionService: SyncInspectionService,
    private inspectionNavigateService: InspectionNavigateService
  ) {
    if (this.router.getCurrentNavigation().extras.state) {
      this.task = this.router.getCurrentNavigation().extras.state.task;
      this.readonly = this.task.internalStatus == InspectionStatus.Completed;
      if (!this.task.environmentalForm) {
        inspectionService
          .initializeEnvironmentalTask(this.task)
          .then((x) => {
            this.task = x;
          })
          .catch(async (error) => {
            console.log(error);

            var message = this.toast.create({
              message: error,
              color: "danger",
              duration: 2000,
            });
            (await message).present();
          });
      }
    }
  }
  readonly: boolean = false;
  async ionViewDidEnter() {
    try {
      var top = await this.loadingController.getTop();
      if (top) {
        await this.loadingController.dismiss();
      }
      await this.validateAgreements();
    } catch (error) {
      console.log(error);
      var message = this.toast.create({
        message: error,
        color: "danger",
        duration: 2000,
      });
      (await message).present();
    }
  }
  ngOnInit() {}

  async validateAgreements() {
    if (
      !this.task.iTestAgreements ||
      (this.task.iTestAgreements.signature.images.length <= 0 &&
        !this.task.iTestAgreements.hasOpen)
    ) {
      await this.inspectionNavigate.openItestAgreementsPage(this.task);
      return;
    }

    if (
      !this.task.expertNetworkAgreements ||
      (this.task.expertNetworkAgreements.signature.images.length <= 0 &&
        !this.task.expertNetworkAgreements.hasOpen)
    ) {
      await this.inspectionNavigate.openExpertNetworkAgreementsPage(this.task);
    }
  }

  back() {
    this.inspectionNavigateService.backToPending();
  }

  async presentPopover(ev: any) {
    try {
      var settings = [
        {
          name: "ITest Agreements",
          color: "success",
          event: "seeAgreement",
          iconName: "reader-outline",
        },
        {
          name: "Expert Network Agreements",
          color: "secondary",
          event: "seeAgreementEN",
          iconName: "reader-outline",
        },
      ];
      const popover = await this.popoverController.create({
        component: GenericListPopOverComponent,
        componentProps: {
          items: settings,
        },
        event: ev,
        translucent: true,
      });

      popover.onDidDismiss().then(async (result) => {
        if (!result.data) {
          return;
        }
        switch (result.data.event) {
          case "seeAgreement":
            try {
              await this.inspectionNavigate.openItestAgreementsPage(this.task);
            } catch (error) {
              var message = this.toast.create({
                message: error,
                color: "danger",
                duration: 2000,
              });
              (await message).present();
            }

            break;

          case "seeAgreementEN":
            try {
              await this.inspectionNavigate.openExpertNetworkAgreementsPage(
                this.task
              );
            } catch (error) {
              var message = this.toast.create({
                message: error,
                color: "danger",
                duration: 2000,
              });
              (await message).present();
            }

            break;

          default:
            console.log("Unknow event for generic list");
            break;
        }
      });
      return await popover.present();
    } catch (error) {
      var message = this.toast.create({
        message: error,
        color: "danger",
        duration: 2000,
      });
      (await message).present();
    }
  }

  async completeTask() {
    try {
      const alert = await this.alertController.create({
        header: "Confirm Inspection",
        message: "Are you sure you want to complete the inspection?",
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
              console.log("Task Completed" + this.task.id);
              console.log(this.task);
              this.task.internalStatus = "Pending";
              var random = Math.floor(Math.random() * 100) + 2;
              await this.inspectionService.update(this.task);
              await this.navController.navigateRoot(
                "menu/tabs/tabs/pending-inspections/" + random
              );
              var message = this.toast.create({
                message: "Inspection is completed.",
                color: "success",
                duration: 3000,
              });

              (await message).present();

              (await this.syncInspectionService.syncTask(this.task)).subscribe(
                async (x) => {
                  if (x) {
                    var message = this.toast.create({
                      message: "Inspection is synched.",
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
                }
              );
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

  public async UpdateEntity($event): Promise<void> {
    try {
      if (this.task.internalStatus != InspectionStatus.Completed) {
        this.task.internalStatus = "In Progress";
        await this.inspectionService.update(this.task);
      }
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
