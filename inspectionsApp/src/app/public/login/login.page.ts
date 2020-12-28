import { AuthenticationService } from "./../../services/authentication.service";
import { Component, OnInit } from "@angular/core";
import {
  Validators,
  FormBuilder,
  FormGroup,
  FormControl,
} from "@angular/forms";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
})
export class LoginPage implements OnInit {
  //validations_form: FormGroup;

  constructor(
    private authService: AuthenticationService,
    public formBuilder: FormBuilder
  ) {}

  ngOnInit() {}

  validations_form = this.formBuilder.group({
    username: new FormControl(
      "",
      Validators.compose([
        Validators.minLength(5),
        Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$"),
        Validators.required,
      ])
    ),
    password: new FormControl("", Validators.compose([Validators.required])),
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

  onSubmit(values) {
    if (true) {
      console.log(values);
      this.authService.login();
    }
  }
}
