import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CallNumber } from "@ionic-native/call-number/ngx";
import { Scheduling } from "src/app/models/scheduling";

@Component({
  selector: "app-scheduling-detail",
  templateUrl: "./scheduling-detail.page.html",
  styleUrls: ["./scheduling-detail.page.scss"],
})
export class SchedulingDetailPage implements OnInit {
  scheduling: Scheduling;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public callNumber: CallNumber
  ) {
    this.route.queryParams.subscribe((params) => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.scheduling = this.router.getCurrentNavigation().extras.state.scheduling;
      }
    });
  }

  call() {
    console.log("call " + this.scheduling.contact.contactPhone);
    this.callNumber
      .callNumber(this.scheduling.contact.contactPhone, true)
      .then((res) => console.log("Launched dialer!", res))
      .catch((err) => console.log("Error launching dialer", err));
  }

  email() {
    console.log("Mailto" + this.scheduling.contact.contactEmail);
    window.location.href =
      "mailto:" +
      this.scheduling.contact.contactEmail +
      "?subject=Scheduling inspection " +
      " " +
      this.scheduling.serviceType +
      " " +
      this.scheduling.id;
  }

  ngOnInit() {}
}
