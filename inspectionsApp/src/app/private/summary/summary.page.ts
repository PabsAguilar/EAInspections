import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, NavigationExtras, Router } from "@angular/router";
import { CallNumber } from "@ionic-native/call-number/ngx";
import {
  LoadingController,
  PopoverController,
  ToastController,
} from "@ionic/angular";
import { Subscription } from "rxjs";
import { GenericListPopOverComponent } from "src/app/components/generic-list-pop-over/generic-list-pop-over.component";
import { InspectionTask } from "src/app/models/inspection-task";
import { Scheduling } from "src/app/models/scheduling";
import { InspectionNavigateService } from "src/app/services/inspection-navigate.service";
import { InspectionsStorageService } from "src/app/services/inspections-storage.service";
import { ItestDealService } from "src/app/services/itest-deal.service";

import { SchedulingStorageService } from "src/app/services/scheduling-storage.service";
import { SyncInspectionService } from "src/app/services/sync-inspection.service";

@Component({
  selector: "app-summary",
  templateUrl: "./summary.page.html",
  styleUrls: ["./summary.page.scss"],
})
export class SummaryPage implements OnInit {
  constructor(
    public callNumber: CallNumber,
    public schedulingStorageService: SchedulingStorageService,
    public inspectionStorageService: ItestDealService,

    private inspectionNavigate: InspectionNavigateService,
    private router: Router,
    private route: ActivatedRoute,
    private popoverController: PopoverController,
    private toast: ToastController,
    private syncInspection: SyncInspectionService,
    private loadingController: LoadingController
  ) {}

  subscription: Subscription;
  segmentOption: string = "inspections";
  inspectionTasks = Array<InspectionTask>();
  schedulingList: Scheduling[];
  ngOnInit() {}

  async ionViewWillLeave() {
    this.subscription.unsubscribe();
  }
  async ionViewWillEnter() {
    try {
      this.subscription = this.syncInspection
        .getObservable()
        .subscribe(async (data) => {
          this.schedulingList = await this.schedulingStorageService.getAll();
          this.inspectionTasks = await this.inspectionStorageService.getCompletedInspections();
        });

      //TODO: Validate connection to internet
      this.schedulingList = await this.schedulingStorageService.getAll();
      this.inspectionTasks = await this.inspectionStorageService.getCompletedInspections();

      this.route.queryParams.subscribe((params) => {
        if (params && params.segment) {
          this.segmentOption = params.segment;
        }
      });

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

  async doRefresh(event) {
    try {
      console.log("Pull inspections Event Triggered!");
      if (this.segmentOption === "inspections") {
        this.inspectionTasks = await this.inspectionStorageService.getCompletedInspections();
      } else {
        this.schedulingList = await this.schedulingStorageService.getAll();
      }

      event.target.complete();
    } catch (error) {
      console.log(error);
    }
  }

  async presentPopover(ev: any) {
    try {
      var settings = [
        {
          name: "Sync",
          color: "secondary",
          event: "syncToServer",
          iconName: "cloud-upload-outline",
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
          case "syncToServer":
            await (await this.syncInspection.syncAllPending()).toPromise();
            this.inspectionTasks = await this.inspectionStorageService.getCompletedInspections();
            this.schedulingList = await this.schedulingStorageService.getAll();

            break;

          default:
            console.log("Unknow event for generic list");
            break;
        }
      });
      return await popover.present();
    } catch (error) {
      console.log(error);
    }
  }

  call(item: InspectionTask) {
    console.log("call " + item.phone);
    this.callNumber
      .callNumber(item.phone, true)
      .then((res) => console.log("Launched dialer!", res))
      .catch((err) => console.log("Error launching dialer", err));
  }

  async seeInspection(task) {
    try {
      this.inspectionNavigate.openInspectionPage(task);
    } catch (error) {
      console.log(error);
    }
  }

  async seeInspectionDetails(task) {
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
    }
  }

  async trySync(task) {
    (await this.syncInspection.syncTask(task)).subscribe(async (x) => {
      if (x) {
        this.inspectionTasks = await this.inspectionStorageService.getCompletedInspections();
        var message = this.toast.create({
          message: "Inspection is synched.",
          color: "success",
          duration: 5000,
        });
        (await message).present();
      } else {
        var message = this.toast.create({
          message: "Sync failed, please try again later.",
          color: "warning",
          duration: 300,
        });
        (await message).present();
      }
    });
  }

  async seeSchedulingDetails(scheduling: Scheduling) {
    try {
      console.log("Details clicked");
      console.log(scheduling);
      let navigationExtras: NavigationExtras = {
        state: {
          scheduling: scheduling,
        },
      };
      this.router.navigate(["menu/scheduling"], navigationExtras);
    } catch (error) {
      console.log(error);
    }
  }
}
