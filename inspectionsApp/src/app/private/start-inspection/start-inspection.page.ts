import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NavController } from "@ionic/angular";
import { Area } from "src/app/models/area";
import { GeneralInfoInspection } from "src/app/models/general-info-inspection";
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
        if (!this.task.generalInfoInspection) {
          this.task.generalInfoInspection = new GeneralInfoInspection();
        }
        if (!this.task.listAreas) {
          this.task.listAreas = [];
          for (let index = 0; index < 8; index++) {
            this.task.listAreas.push(new Area());
          }
        }
      }
    });
  }

  ngOnInit() {}

  async completeTask() {
    console.log("Task Completed" + this.task.id);
    console.log(this.task);
    this.task.internalStatus = "Pending";
    var random = Math.floor(Math.random() * 10) + 2;
    await this.inspectionStorageService.update(this.task);
    await this.navController.navigateRoot(
      "menu/tabs/tabs/pending-inspections/" + random
    );
  }

  public async UpdateEntity($event): Promise<void> {
    console.log($event);
    this.task.internalStatus = "In Progress";
    await this.inspectionStorageService.update(this.task);
  }
}
