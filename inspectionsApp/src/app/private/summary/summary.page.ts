import { Component, OnInit } from "@angular/core";
import { InspectionTask } from "src/app/models/inspection-task";
import { Scheduling } from "src/app/models/scheduling";
import { InspectionsStorageService } from "src/app/services/inspections-storage.service";
import { SchedulingStorageService } from "src/app/services/scheduling-storage.service";

@Component({
  selector: "app-summary",
  templateUrl: "./summary.page.html",
  styleUrls: ["./summary.page.scss"],
})
export class SummaryPage implements OnInit {
  constructor(
    public schedulingStorageService: SchedulingStorageService,
    public inspectionStorageService: InspectionsStorageService
  ) {}
  segmentOption: string = "inspections";
  inspectionTasks: InspectionTask[];
  schedulingList: Scheduling[];
  ngOnInit() {}

  async ionViewWillEnter() {
    this.schedulingList = await this.schedulingStorageService.getAll();
    this.inspectionTasks = await this.inspectionStorageService.getCompletedInspections();
  }
}
