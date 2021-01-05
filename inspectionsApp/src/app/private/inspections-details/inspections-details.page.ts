import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { InspectionTask } from "src/app/models/inspection-task";

@Component({
  selector: "app-inspections-details",
  templateUrl: "./inspections-details.page.html",
  styleUrls: ["./inspections-details.page.scss"],
})
export class InspectionsDetailsPage implements OnInit {
  task: InspectionTask;
  constructor(private route: ActivatedRoute, private router: Router) {
    this.route.queryParams.subscribe((params) => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.task = this.router.getCurrentNavigation().extras.state.task;
      }
    });
  }

  ngOnInit() {}
}
