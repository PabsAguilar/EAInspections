import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";

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
import { debounceTime } from "rxjs/operators";
import { GenericListPopOverComponent } from "src/app/components/generic-list-pop-over/generic-list-pop-over.component";
import { InspectionTask } from "src/app/models/inspection-task";
import { AuthenticationService } from "src/app/services/authentication.service";
import { InspectionNavigateService } from "src/app/services/inspection-navigate.service";

import { ItestDealService } from "src/app/services/itest-deal.service";

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
  segmentOption: string = "All";
  searching: any = false;
  public searchControl: FormControl;

  constructor(
    private callNumber: CallNumber,
    private actionSheetController: ActionSheetController,
    private router: Router,
    private inspectionService: ItestDealService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private navController: NavController,
    private popoverController: PopoverController,
    private toast: ToastController,
    private launchNavigator: LaunchNavigator,
    private inspectionNavigate: InspectionNavigateService,
    private autenticateService: AuthenticationService
  ) {
    this.searchControl = new FormControl();
  }

  public ngOnDestroy(): void {}

  async ionViewWillEnter() {
    try {
      //TODO: Validate connection to internet
      await this.loadData();
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

  async onSearchTerm() {
    this.searching = true;
  }

  async search(searchTerm: string) {
    this.inspectionTasks = await this.inspectionService.getPendingInspections();
    if (searchTerm && searchTerm.trim() !== "") {
      this.inspectionTasks = this.inspectionTasks.filter((term) => {
        return (
          term.title.toLowerCase().indexOf(searchTerm.trim().toLowerCase()) >
            -1 ||
          term.serviceAddress
            .toLowerCase()
            .indexOf(searchTerm.trim().toLowerCase()) > -1 ||
          term.contactName
            .toLowerCase()
            .indexOf(searchTerm.trim().toLowerCase()) > -1
        );
      });
    }
  }

  async segmentChanged($event) {
    this.inspectionTasks = (
      await this.inspectionService.getPendingInspections()
    ).filter(
      (task) =>
        this.segmentOption == "All" || task.internalStatus == this.segmentOption
    );
  }

  async ionViewDidEnter() {
    try {
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
    this.inspectionTasks = await this.inspectionService.getPendingInspections();

    if (this.inspectionTasks == null) {
      await this.inspectionService.getExternal(
        (await this.autenticateService.getUser()).userId
      );
      this.inspectionTasks = await this.inspectionService.getPendingInspections();
    }
    this.lastSync = await this.inspectionService.getSyncStamp();
  }
  async doRefresh(event) {
    try {
      console.log("Pull Event Triggered!");

      this.inspectionTasks = await this.inspectionService.getPendingInspections();
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

  public async ngOnInit() {
    this.searchControl.valueChanges
      .pipe(debounceTime(700))
      .subscribe((search) => {
        this.search(search);
        this.searching = false;
      });
  }

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

  async gpsNavigate(task: InspectionTask) {
    let options: LaunchNavigatorOptions = {
      start: "Current Location",
    };

    this.launchNavigator.navigate(task.serviceAddress, options).then(
      (success) => console.log("Launched navigator"),
      (error) => console.log("Error launching navigator", error)
    );
  }

  async startInspection(task: InspectionTask) {
    try {
      console.log("Start clicked");
      this.selectedTask = task;
      this.inspectionNavigate.startInspection(task);
    } catch (error) {}
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
              await this.inspectionService.getExternal(
                (await this.autenticateService.getUser()).userId
              );
              this.lastSync = await this.inspectionService.getSyncStamp();
              this.inspectionTasks = await this.inspectionService.getPendingInspections();
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
