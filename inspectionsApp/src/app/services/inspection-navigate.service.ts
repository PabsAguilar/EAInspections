import { Injectable } from "@angular/core";
import { NavigationExtras } from "@angular/router";
import {
  AlertController,
  LoadingController,
  NavController,
  ToastController,
} from "@ionic/angular";
import { InspectionStatus, InspectionType } from "../models/enums";
import { InspectionTask } from "../models/inspection-task";

@Injectable({
  providedIn: "root",
})
export class InspectionNavigateService {
  constructor(
    private alertController: AlertController,
    private toast: ToastController,
    private loadingController: LoadingController,
    private navController: NavController
  ) {}

  async startInspection(task: InspectionTask) {
    try {
      if (task.internalStatus == InspectionStatus.InProgress) {
        await this.openInspectionPage(task);
      } else {
        await this.presentAlertConfirmStartInspection(task);
      }
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

  async presentAlertConfirmStartInspection(task: InspectionTask) {
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
              await this.openInspectionPage(task);
            },
          },
        ],
      });

      await alert.present();
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
  async backToPending() {
    var path =
      "menu/tabs/tabs/pending-inspections/" +
      Math.floor(Math.random() * 100 + 1);
    await this.navController.navigateBack([path]);
  }

  async moveToSummary(segment) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        segment: segment,
      },
    };

    var path = "menu/tabs/tabs/summary/" + Math.floor(Math.random() * 100 + 1);
    await this.navController.navigateForward([path], navigationExtras);
  }

  async moveToPendingInspection(segment) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        segment: segment,
      },
    };

    var path =
      "menu/tabs/tabs/pending-inspections/" +
      Math.floor(Math.random() * 100 + 1);
    await this.navController.navigateBack([path], navigationExtras);
  }

  async backFromAgreementsPage(selectedTask: InspectionTask) {
    try {
      const loading = await this.loadingController.create({
        message: "Loading Inspection...",
      });
      await loading.present();
      let navigationExtras: NavigationExtras = {
        state: {
          task: selectedTask,
        },
      };
      var path = "";
      if (selectedTask.inspectionType == InspectionType.Comprehensive) {
        path = "menu/comprehensive-inspection";
      } else if (selectedTask.inspectionType == InspectionType.Environmental) {
        path = "menu/environmental-inspection";
      }
      await this.navController.navigateBack([path], navigationExtras);
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

  async openExpertNetworkAgreementsPage(selectedTask: InspectionTask) {
    const loading = await this.loadingController.create({
      message: "Loading Agreements...",
    });
    await loading.present();

    try {
      var path = "menu/expert-network-agreement";

      let navigationExtras: NavigationExtras = {
        state: {
          task: selectedTask,
        },
      };

      await this.navController.navigateForward([path], navigationExtras);
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

  async openItestAgreementsPage(selectedTask: InspectionTask) {
    const loading = await this.loadingController.create({
      message: "Loading Agreements...",
    });
    await loading.present();

    try {
      var path = "menu/environmental-agreements";

      let navigationExtras: NavigationExtras = {
        state: {
          task: selectedTask,
        },
      };

      await this.navController.navigateForward([path], navigationExtras);
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
  async openInspectionPage(selectedTask: InspectionTask) {
    try {
      const loading = await this.loadingController.create({
        message: "Loading Inspection...",
      });
      await loading.present();
      let navigationExtras: NavigationExtras = {
        state: {
          task: selectedTask,
        },
      };
      var path = "";
      if (selectedTask.inspectionType == InspectionType.Comprehensive) {
        path = "menu/comprehensive-inspection";
      } else if (selectedTask.inspectionType == InspectionType.Environmental) {
        path = "menu/environmental-inspection";
      }
      await this.navController.navigateForward([path], navigationExtras);
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
