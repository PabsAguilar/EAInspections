import { Component, OnDestroy, OnInit } from "@angular/core";
import { NavigationEnd, NavigationExtras, Router } from "@angular/router";
import { CallNumber } from "@ionic-native/call-number/ngx";
import {
  ActionSheetController,
  AlertController,
  NavController,
} from "@ionic/angular";
import { Subscription } from "rxjs";
import { OnEnter } from "src/app/interfaces/OnEnter";
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
    public navController: NavController
  ) {}

  public ngOnDestroy(): void {}

  async ionViewWillEnter() {
    //TODO: Validate connection to internet
    console.log("ionViewWillEnter");
    await this.loadData();
  }

  async loadData() {
    console.log("load data");
    this.inspectionTasks = await this.inspectionStorageService.getPendingInspections();

    if (this.inspectionTasks == null) {
      await this.inspectionStorageService.syncExternal();
      this.inspectionTasks = await this.inspectionStorageService.getPendingInspections();
    }
    this.lastSync = await this.inspectionStorageService.getSyncStamp();
    console.log(this.inspectionTasks);
    console.log("lastSync: " + this.lastSync);
  }
  async doRefresh(event) {
    console.log("Pull Event Triggered!");
    this.inspectionTasks = await this.inspectionStorageService.getPendingInspections();
    event.target.complete();
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
    console.log("Details clicked");
    let navigationExtras: NavigationExtras = {
      state: {
        task: task,
      },
    };
    this.router.navigate(["menu/details"], navigationExtras);
  }

  async startInspection(task: InspectionTask) {
    console.log("Start clicked");
    this.selectedTask = task;
    this.presentAlertConfirmStartInspection();
  }
  async presentAlertConfirmStartInspection() {
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
          handler: () => {
            let navigationExtras: NavigationExtras = {
              state: {
                task: this.selectedTask,
              },
            };

            this.navController.navigateForward(
              ["menu/start-inspection"],
              navigationExtras
            );
          },
        },
      ],
    });

    await alert.present();
  }

  async presentActionSheet(task: InspectionTask) {
    const actionSheet = await this.actionSheetController.create({
      header: "Inspection Options",
      cssClass: "my-custom-class",
      buttons: [
        {
          text: "Start",
          role: "destructive",
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
  }
}
