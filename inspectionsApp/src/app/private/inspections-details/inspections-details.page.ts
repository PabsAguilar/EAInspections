import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, NavigationExtras, Router } from "@angular/router";
import { CallNumber } from "@ionic-native/call-number/ngx";
import { AlertController, NavController } from "@ionic/angular";
import { InspectionTask } from "src/app/models/inspection-task";
import {
  LaunchNavigator,
  LaunchNavigatorOptions,
} from "@ionic-native/launch-navigator/ngx";

@Component({
  selector: "app-inspections-details",
  templateUrl: "./inspections-details.page.html",
  styleUrls: ["./inspections-details.page.scss"],
})
export class InspectionsDetailsPage implements OnInit {
  task: InspectionTask;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public callNumber: CallNumber,
    public alertController: AlertController,
    public navController: NavController,
    private launchNavigator: LaunchNavigator
  ) {
    this.route.queryParams.subscribe((params) => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.task = this.router.getCurrentNavigation().extras.state.task;
      }
    });
  }

  call() {
    console.log("call " + this.task.contactPhone);
    this.callNumber
      .callNumber(this.task.contactPhone, true)
      .then((res) => console.log("Launched dialer!", res))
      .catch((err) => console.log("Error launching dialer", err));
  }

  gpsNavigate() {
    let options: LaunchNavigatorOptions = {
      start: "Current Location",
    };

    this.launchNavigator.navigate(this.task.geoPointText, options).then(
      (success) => console.log("Launched navigator"),
      (error) => console.log("Error launching navigator", error)
    );
  }
  email() {
    console.log("Mailto" + this.task.contactEmail);
    window.location.href =
      "mailto:" +
      this.task.contactEmail +
      "?subject=Inspection " +
      " " +
      this.task.inspectionType +
      " " +
      this.task.id;
  }

  async startInspection() {
    try {
      this.presentAlertConfirmStartInspection();
    } catch (error) {
      console.log(error);
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
            handler: () => {
              let navigationExtras: NavigationExtras = {
                state: {
                  task: this.task,
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
    } catch (error) {
      console.log(error);
    }
  }
  // addressNavigate() {
  //   console.log("Navigate to" + this.task.serviceAddress);
  //   window.location.href =
  //     "maps://maps.apple.com/?q=" + this.task.serviceAddress;
  // }
  ngOnInit() {}
}
