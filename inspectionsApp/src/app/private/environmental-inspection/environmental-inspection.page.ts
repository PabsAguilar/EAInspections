import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  AlertController,
  LoadingController,
  NavController,
  ToastController,
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
    public navController: NavController,
    private toast: ToastController
  ) {
    if (this.router.getCurrentNavigation().extras.state) {
      this.task = this.router.getCurrentNavigation().extras.state.task;
      if (!this.task.environmentalForm) {
        this.task.environmentalForm = new EnvironmentalForm();
      }
    }
  }

  async ionViewDidEnter() {
    try {
      var top = await this.loadingController.getTop();
      if (top) {
        await this.loadingController.dismiss();
      }
    } catch (error) {
      var message = this.toast.create({
        message: error,
        color: "danger",
        duration: 2000,
      });
      (await message).present();
    }
  }
  ngOnInit() {}

  async completeTask() {
    try {
      console.log("Task Completed" + this.task.id);
      console.log(this.task);
      this.task.internalStatus = "Pending";
      var random = Math.floor(Math.random() * 10) + 2;
      var message = this.toast.create({
        message: "Inspection is completed.",
        color: "success",
        duration: 5000,
      });
      (await message).present();
      await this.inspectionStorageService.update(this.task);
      await this.navController.navigateRoot(
        "menu/tabs/tabs/pending-inspections/" + random
      );
    } catch (error) {
      var message = this.toast.create({
        message: error,
        color: "danger",
        duration: 2000,
      });
      (await message).present();
    }
  }

  public async UpdateEntity($event): Promise<void> {
    try {
      this.task.internalStatus = "In Progress";
      await this.inspectionStorageService.update(this.task);
    } catch (error) {
      var message = this.toast.create({
        message: error,
        color: "danger",
        duration: 2000,
      });
      (await message).present();
    }
  }
}
