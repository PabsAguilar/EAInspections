import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { EmailComposer } from "@ionic-native/email-composer/ngx";
import { File } from "@ionic-native/file/ngx";
import {
  AlertController,
  LoadingController,
  NavController,
  PopoverController,
  ToastController,
} from "@ionic/angular";
import { GenericListPopOverComponent } from "src/app/components/generic-list-pop-over/generic-list-pop-over.component";
import { ComprehensiveForm } from "src/app/models/comprehensive-form/comprehensive-form";
import { InspectionStatus } from "src/app/models/enums";
import { InspectionTask } from "src/app/models/inspection-task";
import { InspectionNavigateService } from "src/app/services/inspection-navigate.service";
import { InspectionsStorageService } from "src/app/services/inspections-storage.service";
import { ItestDealService } from "src/app/services/itest-deal.service";
import { SyncInspectionService } from "src/app/services/sync-inspection.service";

@Component({
  selector: "app-comprehensive-inspection",
  templateUrl: "./comprehensive-inspection.page.html",
  styleUrls: ["./comprehensive-inspection.page.scss"],
})
export class ComprehensiveInspectionPage implements OnInit {
  task: InspectionTask;
  readonly: boolean = false;
  constructor(
    private toast: ToastController,
    private route: ActivatedRoute,
    private router: Router,
    public alertController: AlertController,
    public loadingController: LoadingController,
    public inspectionStorageService: InspectionsStorageService,
    private inspectionNavigate: InspectionNavigateService,
    public navController: NavController,
    public inspectionService: ItestDealService,
    public syncInspectionService: SyncInspectionService,
    private popoverController: PopoverController,
    private emailComposer: EmailComposer,
    private file: File
  ) {
    if (this.router.getCurrentNavigation().extras.state) {
      this.task = this.router.getCurrentNavigation().extras.state.task;
      this.readonly = this.task.internalStatus == InspectionStatus.Completed;
      if (!this.task.comprehesiveForm) {
        inspectionService
          .initializeENTask(this.task)
          .then((x) => {
            this.task = x;
          })
          .catch(async (error) => {
            console.log(error);

            var message = this.toast.create({
              message: "environmental-constructor " + error,
              color: "danger",
              duration: 2000,
            });
            (await message).present();
          });
      }
    }
  }

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
        message: "environmental-ionViewDidEnter" + error,
        color: "danger",
        duration: 2000,
      });
      (await message).present();
    }
  }

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

  async openOption(type) {
    switch (type) {
      case "ITestAgreements":
        try {
          await this.inspectionNavigate.openItestAgreementsPage(this.task);
        } catch (error) {
          console.log(error);
          var message = this.toast.create({
            message: "environmental-popover.onDidDismiss" + error,
            color: "danger",
            duration: 2000,
          });
          (await message).present();
        }

        break;

      case "ENAgreements":
        try {
          await this.inspectionNavigate.openExpertNetworkAgreementsPage(
            this.task
          );
        } catch (error) {
          console.log(error);
          var message = this.toast.create({
            message: "popover.onDidDismiss.ENAgreements" + error,
            color: "danger",
            duration: 2000,
          });
          (await message).present();
        }

        break;
      case "ReportIssue":
        let jFile = JSON.stringify(this.task);

        this.file
          .writeFile(this.file.dataDirectory, "dealIssue.json", jFile, {
            replace: true,
          })
          .then((x) => {
            console.log("Directory exists");
            console.log(x);
            let email = {
              to: "pabs.aguilar2806@gmail.com",
              //cc: "max@mustermann.de",
              attachments: [this.file.dataDirectory + "/dealIssue.json"],
              subject: "Issue Inspection " + this.task.id,
              body:
                "Having issues with " + this.task.enterprise + " inspection. ",
              isHtml: true,
            };

            this.emailComposer.open(email);
          })
          .catch((err) => console.log("Directory doesn't exist"));

        break;

      case "Delete":
        try {
          const alert = await this.alertController.create({
            header: "Confirm Delete",
            cssClass: "alertcss",
            message:
              "Are you sure you want to delete the inspection? All the progress will be clear and deleted from the device.",
            buttons: [
              {
                text: "Cancel",
                role: "cancel",
                handler: () => {
                  console.log("Cancel action");
                },
              },
              {
                text: "Ok",
                cssClass: "buttoncss",
                handler: async () => {
                  var random = Math.floor(Math.random() * 100) + 2;
                  await this.inspectionService.delete(this.task);
                  await this.navController.navigateRoot(
                    "menu/tabs/tabs/pending-inspections/" + random
                  );
                  var message = this.toast.create({
                    message: "Inspection is deleted.",
                    color: "warning",
                    duration: 3000,
                  });

                  (await message).present();
                },
              },
            ],
          });
          await alert.present();
        } catch (error) {
          console.log(error);
          var message = this.toast.create({
            message: "Delete: " + error,
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
  }
  async presentPopover(ev: any) {
    try {
      var settings = [
        {
          name: "ITest Agreements",
          color: "success",
          event: "ITestAgreements",
          iconName: "reader-outline",
        },
        {
          name: "Expert Network Agreements",
          color: "secondary",
          event: "ENAgreements",
          iconName: "reader-outline",
        },
        {
          name: "Delete Inspection from device",
          color: "danger",
          event: "Delete",
          iconName: "trash-outline",
        },

        {
          name: "Report an issue with this Inspection",
          color: "medium",
          event: "ReportIssue",
          iconName: "bug-outline",
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
        this.openOption(result.data.event);
      });
      return await popover.present();
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

  async syncTask() {
    try {
      const loading = await this.loadingController.create({
        message: "Uploading to Bitrix...",
      });
      await loading.present();
      this.task.startedSync = false;
      var x = await this.syncInspectionService.syncENTask(this.task);

      if (x) {
        this.syncInspectionService.publishSomeData({
          syncItem: "deal",
        });
        var top = await this.loadingController.getTop();
        if (top) {
          await this.loadingController.dismiss();
        }

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
      (await message).present();
    } catch (error) {
      var message = this.toast.create({
        message: error,
        color: "danger",
        duration: 5000,
      });
    } finally {
      var top = await this.loadingController.getTop();
      if (top) {
        await this.loadingController.dismiss();
      }
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
              const loading = await this.loadingController.create({
                message: "Please wait...",
              });
              await loading.present();
              try {
                this.task.internalStatus = InspectionStatus.PendingToComplete;
                var random = Math.floor(Math.random() * 10) + 2;
                await this.inspectionStorageService.update(this.task);

                await this.navController.navigateRoot(
                  "menu/tabs/tabs/pending-inspections/" + random
                );

                var message = this.toast.create({
                  message: "Inspection is completed.",
                  color: "success",
                  duration: 3000,
                });

                (await message).present();

                var x = await this.syncTask();
              } catch (error) {
                var message = this.toast.create({
                  message: "Sync failed, " + error,
                  color: "warning",
                  duration: 7000,
                });
                (await message).present();
              } finally {
                await loading.dismiss();
              }
            },
          },
        ],
      });
      await alert.present();
    } catch (error) {
      console.log(error);
    }
  }

  public async UpdateEntity($event): Promise<void> {
    try {
      console.log($event);
      if (this.task.internalStatus == InspectionStatus.New) {
        this.task.internalStatus = "In Progress";
      }
      await this.inspectionStorageService.update(this.task);
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
}
