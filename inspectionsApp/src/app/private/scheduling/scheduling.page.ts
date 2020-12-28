import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { fromEventPattern } from "rxjs";

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

  constructor(public formBuilder: FormBuilder) {}

  ngOnInit() {
    console.log(this.minDate);
    console.log(this.maxDate);
  }

  validations_form = this.formBuilder.group({
    email: new FormControl(
      "",
      Validators.compose([
        Validators.minLength(5),
        Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$"),
        Validators.required,
      ])
    ),
    firstname: new FormControl("", Validators.compose([Validators.required])),
    lastname: new FormControl("", Validators.compose([Validators.required])),
    phone: new FormControl("", Validators.compose([Validators.required])),
    address: new FormControl("", Validators.compose([Validators.required])),
    insurancecompany: new FormControl(
      "",
      Validators.compose([Validators.required])
    ),
    notes: new FormControl("", Validators.compose([Validators.required])),
    employee: new FormControl("", Validators.compose([Validators.required])),
    service: new FormControl("", Validators.compose([Validators.required])),
    date: new FormControl("", Validators.compose([Validators.required])),
  });
  validation_messages = {
    username: [
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
    password: [
      { type: "required", message: "Password is required." },
      {
        type: "minlength",
        message: "Password must be at least 5 characters long.",
      },
    ],
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
    if (true) {
      console.log(values);
    }
  }
}
