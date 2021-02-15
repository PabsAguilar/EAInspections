import { Component, OnDestroy, OnInit } from "@angular/core";
import { NavigationEnd, NavigationExtras, Router } from "@angular/router";

import { CallNumber } from "@ionic-native/call-number/ngx";
import {
  LaunchNavigator,
  LaunchNavigatorOptions,
} from "@ionic-native/launch-navigator/ngx";
import {
  ActionSheetController,
  AlertController,
  LoadingController,
  NavController,
  PopoverController,
  ToastController,
} from "@ionic/angular";
import { Subscription } from "rxjs";
import { GenericListPopOverComponent } from "src/app/components/generic-list-pop-over/generic-list-pop-over.component";
import { ComprehensiveForm } from "src/app/models/comprehensive-form/comprehensive-form";
import { InspectionStatus, InspectionType } from "src/app/models/enums";
import { InspectionTask } from "src/app/models/inspection-task";

import { InspectionsStorageService } from "src/app/services/inspections-storage.service";

@Component({
  selector: "app-pending-inspections",
  templateUrl: "./pending-inspections.page.html",
  styleUrls: ["./pending-inspections.page.scss"],
})
export class PendingInspectionsPage implements OnInit {
  private subscription: Subscription;
  today = Date.now();
  lastSync = Date.now();
  inspectionTasks = Array<InspectionTask>();
  selectedTask: InspectionTask;
  constructor(
    public callNumber: CallNumber,
    public actionSheetController: ActionSheetController,
    public router: Router,
    public inspectionStorageService: InspectionsStorageService,
    public alertController: AlertController,
    public loadingController: LoadingController,
    public navController: NavController,
    public popoverController: PopoverController,
    public toast: ToastController,
    private launchNavigator: LaunchNavigator
  ) {}

  public ngOnDestroy(): void {}

  async ionViewWillEnter() {
    try {
      //TODO: Validate connection to internet
      await this.loadData();
    } catch (error) {
      var message = this.toast.create({
        message: error,
        color: "danger",
        duration: 2000,
      });
      (await message).present();
    }
  }

  async ionViewDidEnter() {
    try {
      var top = await this.loadingController.getTop();
      if (top) {
        await top.dismiss();
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

  async loadData() {
    this.inspectionTasks = await this.inspectionStorageService.getPendingInspections();

    if (this.inspectionTasks == null) {
      await this.inspectionStorageService.getExternal();
      this.inspectionTasks = await this.inspectionStorageService.getPendingInspections();
    }
    this.lastSync = await this.inspectionStorageService.getSyncStamp();
  }
  async doRefresh(event) {
    try {
      console.log("Pull Event Triggered!");
      this.inspectionTasks = await this.inspectionStorageService.getPendingInspections();
      event.target.complete();
    } catch (error) {
      var message = this.toast.create({
        message: error,
        color: "danger",
        duration: 2000,
      });
      (await message).present();
    }
  }

  public async ngOnInit() {}

  call(item: InspectionTask) {
    console.log("call " + item.contactPhone);
    this.callNumber
      .callNumber(item.contactPhone, true)
      .then((res) => console.log("Launched dialer!", res))
      .catch((err) => console.log("Error launching dialer", err));
  }

  async seeDetails(task: InspectionTask) {
    try {
      console.log("Details clicked");
      let navigationExtras: NavigationExtras = {
        state: {
          task: task,
        },
      };
      this.router.navigate(["menu/details"], navigationExtras);
    } catch (error) {
      var message = this.toast.create({
        message: error,
        color: "danger",
        duration: 2000,
      });
      (await message).present();
    }
  }

  async startInspection(task: InspectionTask) {
    try {
      console.log("Start clicked");
      this.selectedTask = task;

      if (task.internalStatus == InspectionStatus.InProgress) {
        await this.openInspectionPage();
      } else {
        await this.presentAlertConfirmStartInspection();
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
  async gpsNavigate(task: InspectionTask) {
    let options: LaunchNavigatorOptions = {
      start: "Current Location",
    };

    this.launchNavigator.navigate(task.geoPointText, options).then(
      (success) => console.log("Launched navigator"),
      (error) => console.log("Error launching navigator", error)
    );
  }
  async openInspectionPage() {
    try {
      const loading = await this.loadingController.create({
        message: "Please wait...",
      });
      await loading.present();
      let navigationExtras: NavigationExtras = {
        state: {
          task: this.selectedTask,
        },
      };
      var path = "";
      if (this.selectedTask.inspectionType == InspectionType.Comprehensive) {
        path = "menu/comprehensive-inspection";
      } else if (
        this.selectedTask.inspectionType == InspectionType.Environmental
      ) {
        path = "menu/environmental-inspection";
      }
      this.navController.navigateForward([path], navigationExtras);
    } catch (error) {
      var message = this.toast.create({
        message: error,
        color: "danger",
        duration: 2000,
      });
      (await message).present();
    }
  }
  async presentAlertConfirmStartInspection() {
    try {
      const alert = await this.alertController.create({
        header: "Confirm action",
        message: "Are you sure you want to start the inspection?",
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
              await this.openInspectionPage();
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

  async presentPopover(ev: any) {
    try {
      var settings = [
        {
          name: "Get task from Bitrix24",
          color: "primary",
          event: "getFromServer",
          iconName: "cloud-download-outline",
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
          case "getFromServer":
            console.log("getFromServer");
            var loading = await this.loadingController.create({
              message: "Loading Inspection Deals",
            });
            await loading.present();

            try {
              await this.inspectionStorageService.getExternal();
              this.lastSync = await this.inspectionStorageService.getSyncStamp();
              this.inspectionTasks = await this.inspectionStorageService.getPendingInspections();
            } catch (error) {
              console.log(error);
            }

            if (loading) {
              await this.loadingController.dismiss();
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

  async presentActionSheet(task: InspectionTask) {
    try {
      const actionSheet = await this.actionSheetController.create({
        header: "Inspection Options",
        cssClass: "my-custom-class",
        buttons: [
          {
            text: "Start",
            icon: "arrow-forward-circle-outline",
            handler: () => {
              this.startInspection(task);
            },
          },
          {
            text: "Details",
            icon: "book-outline",
            handler: () => {
              this.seeDetails(task);
            },
          },
          {
            text: "Call",
            icon: "call-outline",
            handler: () => {
              console.log("Call clicked");
              this.call(task);
            },
          },
          {
            text: "Navigate",
            icon: "navigate-outline",
            handler: () => {
              console.log("Navigate clicked");
              this.gpsNavigate(task);
            },
          },
          {
            text: "Cancel",
            icon: "close",
            role: "cancel",
            handler: () => {
              console.log("Cancel clicked");
            },
          },
        ],
      });
      await actionSheet.present();
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
