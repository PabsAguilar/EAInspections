import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AlertController, NavController } from "@ionic/angular";
import { ComprehensiveForm } from "src/app/models/comprehensive-form/comprehensive-form";
import { InspectionStatus } from "src/app/models/enums";
import { InspectionTask } from "src/app/models/inspection-task";
import { InspectionsStorageService } from "src/app/services/inspections-storage.service";

@Component({
  selector: "app-comprehensive-inspection",
  templateUrl: "./comprehensive-inspection.page.html",
  styleUrls: ["./comprehensive-inspection.page.scss"],
})
export class ComprehensiveInspectionPage implements OnInit {
  task: InspectionTask;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public alertController: AlertController,
    public inspectionStorageService: InspectionsStorageService,
    public navController: NavController
  ) {
    if (this.router.getCurrentNavigation().extras.state) {
      this.task = this.router.getCurrentNavigation().extras.state.task;
      if (!this.task.comprehesiveForm) {
        this.task.comprehesiveForm = new ComprehensiveForm();
      }
      console.log(this.task);
    }
  }

  ionViewWillEnter() {}

  ngOnInit() {}

  async completeTask() {
    const alert = await this.alertController.create({
      header: "Confirm Inspection",
      message: "Are you sure you want to complete the inspection?",
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
          handler: async () => {
            await alert.present();
            console.log("Task Completed" + this.task.id);
            console.log(this.task);

            this.task.internalStatus = InspectionStatus.Pending;
            var random = Math.floor(Math.random() * 10) + 2;
            await this.inspectionStorageService.update(this.task);
            await this.navController.navigateRoot(
              "menu/tabs/tabs/pending-inspections/" + random
            );
          },
        },
      ],
    });
    await alert.present();
  }

  public async UpdateEntity($event): Promise<void> {
    console.log($event);
    this.task.internalStatus = "In Progress";
    await this.inspectionStorageService.update(this.task);
  }
}
