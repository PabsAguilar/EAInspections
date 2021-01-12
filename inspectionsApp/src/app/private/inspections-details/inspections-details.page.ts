import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, NavigationExtras, Router } from "@angular/router";
import { CallNumber } from "@ionic-native/call-number/ngx";
import { AlertController, NavController } from "@ionic/angular";
import { InspectionTask } from "src/app/models/inspection-task";

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
    public navController: NavController
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
    console.log("Start clicked");
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
  }
  // addressNavigate() {
  //   console.log("Navigate to" + this.task.serviceAddress);
  //   window.location.href =
  //     "maps://maps.apple.com/?q=" + this.task.serviceAddress;
  // }
  ngOnInit() {}
}
