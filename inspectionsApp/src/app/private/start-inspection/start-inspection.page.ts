import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NavController } from "@ionic/angular";
import { InspectionTask } from "src/app/models/inspection-task";
import { InspectionsStorageService } from "src/app/services/inspections-storage.service";

@Component({
  selector: "app-start-inspection",
  templateUrl: "./start-inspection.page.html",
  styleUrls: ["./start-inspection.page.scss"],
})
export class StartInspectionPage implements OnInit {
  task: InspectionTask;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public inspectionStorageService: InspectionsStorageService,
    public navController: NavController
  ) {
    this.route.queryParams.subscribe((params) => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.task = this.router.getCurrentNavigation().extras.state.task;
      }
    });
  }

  ngOnInit() {}

  async completeTask() {
    console.log("Task Completed" + this.task.id);
    this.task.internalStatus = "Pending";
    var random = Math.floor(Math.random() * 10) + 2;
    await this.inspectionStorageService.update(this.task);
    await this.navController.navigateRoot(
      "menu/tabs/tabs/pending-inspections/" + random
    );
  }
}
