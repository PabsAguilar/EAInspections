import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  AlertController,
  LoadingController,
  NavController,
} from "@ionic/angular";
import { EnvironmentalForm } from "src/app/models/environmental-form";
import { InspectionTask } from "src/app/models/inspection-task";
import { InspectionsStorageService } from "src/app/services/inspections-storage.service";

@Component({
  selector: "app-environmental-inspection",
  templateUrl: "./environmental-inspection.page.html",
  styleUrls: ["./environmental-inspection.page.scss"],
})
export class EnvironmentalInspectionPage implements OnInit {
  task: InspectionTask;
  constructor(
    private router: Router,
    public alertController: AlertController,
    public loadingController: LoadingController,
    public inspectionStorageService: InspectionsStorageService,
    public navController: NavController
  ) {
    if (this.router.getCurrentNavigation().extras.state) {
      this.task = this.router.getCurrentNavigation().extras.state.task;
      if (!this.task.environmentalForm) {
        this.task.environmentalForm = new EnvironmentalForm();
      }
      console.log(this.task);
    }
  }

  async ionViewDidEnter() {
    try {
      var top = await this.loadingController.getTop();
      if (top) {
        await this.loadingController.dismiss();
      }
    } catch (error) {
      console.log(error);
    }
  }
  ngOnInit() {}

  async completeTask() {
    try {
      console.log("Task Completed" + this.task.id);
      console.log(this.task);
      this.task.internalStatus = "Pending";
      var random = Math.floor(Math.random() * 10) + 2;
      await this.inspectionStorageService.update(this.task);
      await this.navController.navigateRoot(
        "menu/tabs/tabs/pending-inspections/" + random
      );
    } catch (error) {
      console.log(error);
    }
  }

  public async UpdateEntity($event): Promise<void> {
    try {
      console.log(this.task);
      this.task.internalStatus = "In Progress";
      await this.inspectionStorageService.update(this.task);
    } catch (error) {
      console.log(error);
    }
  }
}
