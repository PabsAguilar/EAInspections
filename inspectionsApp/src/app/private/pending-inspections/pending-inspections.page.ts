import { Component, OnInit } from "@angular/core";
import { NavigationExtras, Router } from "@angular/router";
import { CallNumber } from "@ionic-native/call-number/ngx";
import { ActionSheetController } from "@ionic/angular";
import { InspectionTask } from "src/app/models/inspection-task";
import { InspectionsStorageService } from "src/app/services/inspections-storage.service";

@Component({
  selector: "app-pending-inspections",
  templateUrl: "./pending-inspections.page.html",
  styleUrls: ["./pending-inspections.page.scss"],
})
export class PendingInspectionsPage implements OnInit {
  today = Date.now();
  lastSync = Date.now();
  inspectionTasks = Array<InspectionTask>();

  constructor(
    public callNumber: CallNumber,
    public actionSheetController: ActionSheetController,
    public router: Router,
    public inspectionStorageService: InspectionsStorageService
  ) {}

  async ionViewWillEnter() {
    //TODO: Validate connection to internet
    this.inspectionTasks = await this.inspectionStorageService.getAll();

    if (this.inspectionTasks == null) {
      await this.inspectionStorageService.syncExternal();
      this.inspectionTasks = await this.inspectionStorageService.getAll();
    }
    this.lastSync = await this.inspectionStorageService.getSyncStamp();
    console.log(this.inspectionTasks);
    console.log("lastSync: " + this.lastSync);
  }
  async doRefresh(event) {
    console.log("Pull Event Triggered!");
    this.inspectionTasks = await this.inspectionStorageService.getAll();
    event.target.complete();
  }

  ngOnInit() {}

  call(item: InspectionTask) {
    console.log("call " + item.contactPhone);
    this.callNumber
      .callNumber(item.contactPhone, true)
      .then((res) => console.log("Launched dialer!", res))
      .catch((err) => console.log("Error launching dialer", err));
  }

  async startInspection(task: InspectionTask) {
    console.log("Start clicked");
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
