import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { fromEventPattern } from "rxjs";
import { Scheduling } from "src/app/models/scheduling";
import { SchedulingStorageService } from "src/app/services/scheduling-storage.service";

@Component({
  selector: "app-scheduling",
  templateUrl: "./scheduling.page.html",
  styleUrls: ["./scheduling.page.scss"],
})
export class SchedulingPage implements OnInit {
  today = new Date();
  minDate: string = this.formatDate(this.today);
  maxDate: string = this.formatDate(
    this.today.setFullYear(this.today.getFullYear() + 1)
  );

  selectedDate = new Date();
  scheduling: Scheduling;

  constructor(
    public formBuilder: FormBuilder,
    public schedulingStorageService: SchedulingStorageService
  ) {}

  ngOnInit() {
    console.log(this.minDate);
    console.log(this.maxDate);
  }

  validations_form = this.formBuilder.group({
    contactEmail: new FormControl(
      "",
      Validators.compose([
        Validators.minLength(5),
        Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$"),
        Validators.required,
      ])
    ),
    firstName: new FormControl("", Validators.compose([Validators.required])),
    lastName: new FormControl("", Validators.compose([Validators.required])),
    contactPhone: new FormControl(
      "",
      Validators.compose([Validators.required])
    ),
    serviceAddress: new FormControl(
      "",
      Validators.compose([Validators.required])
    ),
    insuranceCompany: new FormControl(
      "",
      Validators.compose([Validators.required])
    ),
    notes: new FormControl(),
    openClaims: new FormControl(),
    inspectorName: new FormControl(
      "",
      Validators.compose([Validators.required])
    ),
    serviceType: new FormControl("", Validators.compose([Validators.required])),
    scheduleDateTime: new FormControl(
      "",
      Validators.compose([Validators.required])
    ),
  });
  validation_messages = {
    firstName: [
      { type: "required", message: "First Name is required." },
      {
        type: "minlength",
        message: "First Name  must be at least 2 characters long.",
      },
      {
        type: "pattern",
        message: "Enter a valid email.",
      },
    ],
    contactEmail: [
      { type: "required", message: "Email is required." },
      {
        type: "minlength",
        message: "Email must be at least 5 characters long.",
      },
      {
        type: "pattern",
        message: "Enter a valid email.",
      },
    ],
    lastName: [{ type: "required", message: "Last Name is required." }],
    inspectorName: [{ type: "required", message: "Inspector is required." }],
    contactPhone: [{ type: "required", message: "Phone is required." }],
    serviceAddress: [{ type: "required", message: "Address is required." }],
    insuranceCompany: [
      { type: "required", message: "Insurance Company is required." },
    ],
    serviceType: [{ type: "required", message: "Service is required." }],
  };

  formatDate(date) {
    let d = new Date(date),
      day = "" + d.getDate(),
      month = "" + (d.getMonth() + 1),
      year = d.getFullYear();
    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
    return [year, month, day].join("-");
  }
  onSubmit(values) {
    this.scheduling = values;
    this.scheduling.internalStatus = "Pending";
    console.log(this.scheduling);
    this.schedulingStorageService.add(this.scheduling);
    this.validations_form.reset();
  }
}
