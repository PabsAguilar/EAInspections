import { Component, OnInit } from "@angular/core";
import { CallNumber } from "@ionic-native/call-number/ngx";
@Component({
  selector: "app-pending-inspections",
  templateUrl: "./pending-inspections.page.html",
  styleUrls: ["./pending-inspections.page.scss"],
})
export class PendingInspectionsPage implements OnInit {
  today = Date.now();
  constructor(private callNumber: CallNumber) {}

  call(item) {
    console.log(item);
    this.callNumber
      .callNumber("00000000000", true)
      .then((res) => console.log("Launched dialer!", res))
      .catch((err) => console.log("Error launching dialer", err));
  }
  ngOnInit() {}
}
