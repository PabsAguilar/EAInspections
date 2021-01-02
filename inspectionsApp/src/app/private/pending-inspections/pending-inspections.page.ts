import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CallNumber } from "@ionic-native/call-number/ngx";
import { ActionSheetController } from "@ionic/angular";
@Component({
  selector: "app-pending-inspections",
  templateUrl: "./pending-inspections.page.html",
  styleUrls: ["./pending-inspections.page.scss"],
})
export class PendingInspectionsPage implements OnInit {
  today = Date.now();
  constructor(
    private callNumber: CallNumber,
    public actionSheetController: ActionSheetController,
    private router: Router
  ) {}

  call(item) {
    console.log(item);
    this.callNumber
      .callNumber("00000000000", true)
      .then((res) => console.log("Launched dialer!", res))
      .catch((err) => console.log("Error launching dialer", err));
  }
  ngOnInit() {}

  async startInspection(item) {
    console.log("Start clicked");
  }
  async seeDetails(item) {
    console.log("Details clicked");
    this.router.navigate(["menu/tabs/tabs/pending-inspections/details"]);
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: "Inspection Options",
      cssClass: "my-custom-class",
      buttons: [
        {
          text: "Start",
          role: "destructive",
          icon: "arrow-forward-circle-outline",
          handler: () => {
            this.startInspection("");
          },
        },
        {
          text: "Details",
          icon: "book-outline",
          handler: () => {
            this.seeDetails("");
          },
        },
        {
          text: "Call",
          icon: "call-outline",
          handler: () => {
            console.log("Call clicked");
            this.call("00000000000");
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
