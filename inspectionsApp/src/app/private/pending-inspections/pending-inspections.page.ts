import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";

import { NavigationExtras, Router } from "@angular/router";
import { NetworkStatus } from "@capacitor/core";

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
import { InspectionStatus } from "src/app/models/enums";
import { InspectionTask } from "src/app/models/inspection-task";
import { User } from "src/app/models/user";
import { AuthenticationService } from "src/app/services/authentication.service";
import { InspectionNavigateService } from "src/app/services/inspection-navigate.service";

import { ItestDealService } from "src/app/services/itest-deal.service";
import { SyncInspectionService } from "src/app/services/sync-inspection.service";

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
  user: User = new User();
  public searchControl: FormControl;
  networkStatus: NetworkStatus;
  constructor(
    private callNumber: CallNumber,
    private actionSheetController: ActionSheetController,
    private router: Router,
    private inspectionService: ItestDealService,
    private loadingController: LoadingController,
    private popoverController: PopoverController,
    private toast: ToastController,
    private launchNavigator: LaunchNavigator,
    private inspectionNavigate: InspectionNavigateService,
    private autenticateService: AuthenticationService,
    private syncInspection: SyncInspectionService
  ) {
    this.searchControl = new FormControl();
  }

  public ngOnDestroy(): void {}

  async ionViewWillLeave() {
    this.subscription.unsubscribe();
  }

  async ionViewWillEnter() {
    try {
      this.subscription = this.syncInspection
        .getObservable()
        .subscribe(async (data) => {
          await this.loadData(true);
        });

      //TODO: Validate connection to internet
      await this.autenticateService.getUser().then((x) => {
        this.user = x;
      });
      await this.loadData(false);
      var top = await this.loadingController.getTop();
      if (top) {
        await top.dismiss();
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

  async onSearchTerm() {
    this.searching = true;
  }

  async search(searchTerm: string) {
    this.inspectionTasks = await this.inspectionService.getPendingInspections(
      this.user.userId
    );
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
            .indexOf(searchTerm.trim().toLowerCase()) > -1 ||
          term.id
            .toString()
            .toLowerCase()
            .indexOf(searchTerm.trim().toLowerCase()) > -1
        );
      });
    }
  }

  async segmentChanged($event) {
    this.inspectionTasks = (
      await this.inspectionService.getPendingInspections(this.user.userId)
    ).filter(
      (task) =>
        this.segmentOption == "All" ||
        (this.segmentOption == "Pending" &&
          (task.internalStatus == InspectionStatus.New ||
            task.internalStatus == InspectionStatus.InProgress)) ||
        (this.segmentOption == "Saved" &&
          (task.internalStatus == InspectionStatus.Saved ||
            task.internalStatus == InspectionStatus.LabsSent ||
            task.internalStatus == InspectionStatus.PendingSaved ||
            task.internalStatus == InspectionStatus.PendingSentLab)) ||
        task.internalStatus == this.segmentOption
    );
  }

  async ionViewDidEnter() {
    try {
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

  async loadData(forceFromServer: boolean) {
    this.inspectionTasks = await this.inspectionService.getPendingInspections(
      this.user.userId
    );

    if (forceFromServer || this.inspectionTasks == null) {
      await this.inspectionService.getExternal(this.user.userId);
      this.inspectionTasks = await this.inspectionService.getPendingInspections(
        this.user.userId
      );
    }
    this.lastSync = await this.inspectionService.getSyncStamp();
  }
  async doRefresh(event) {
    try {
      console.log("Pull Event Triggered!");

      this.inspectionTasks = await this.inspectionService.getPendingInspections(
        this.user.userId
      );
      event.target.complete();
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

  public async ngOnInit() {
    this.searchControl.valueChanges
      .pipe(debounceTime(700))
      .subscribe((search) => {
        this.search(search);
        this.searching = false;
      });
  }

  call(item: InspectionTask) {
    console.log("call " + item.phone);
    this.callNumber
      .callNumber(item.phone, true)
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
      console.log(error);
      var message = this.toast.create({
        message: error,
        color: "danger",
        duration: 2000,
      });
      (await message).present();
    }
  }

  async gpsNavigate(task: InspectionTask) {
    let options: LaunchNavigatorOptions = {};

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
          name: "Get Deals from Bitrix24",
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
              var response = await (
                await this.syncInspection.syncAllPending()
              ).toPromise();

              await this.inspectionService.getExternal(
                (await this.autenticateService.getUser()).userId
              );
              this.lastSync = await this.inspectionService.getSyncStamp();
              this.inspectionTasks = await this.inspectionService.getPendingInspections(
                this.user.userId
              );
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
            text: "Process",
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
