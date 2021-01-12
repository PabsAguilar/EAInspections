import { Component, OnInit } from "@angular/core";
import { PopoverController } from "@ionic/angular";

@Component({
  selector: "app-generic-list-pop-over",
  templateUrl: "./generic-list-pop-over.component.html",
  styleUrls: ["./generic-list-pop-over.component.scss"],
})
export class GenericListPopOverComponent implements OnInit {
  constructor(private popoverController: PopoverController) {}
  items = [];
  ngOnInit() {}

  action(item) {
    this.popoverController.dismiss(item);
  }
}
