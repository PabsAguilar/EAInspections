import { AuthenticationService } from "./../../services/authentication.service";
import { Component, OnInit } from "@angular/core";
import {
  Validators,
  FormBuilder,
  FormGroup,
  FormControl,
} from "@angular/forms";
import { BitrixInspectionService } from "src/app/services/bitrix-inspection.service";
import { AlertController, LoadingController } from "@ionic/angular";
import { User } from "src/app/models/user";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
})
export class LoginPage implements OnInit {
  //validations_form: FormGroup;

  constructor(
    private authService: AuthenticationService,
    private bitrix: BitrixInspectionService,
    public formBuilder: FormBuilder,
    public alertController: AlertController,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {}

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

  email: string = "";
  password: string = "";
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

  async onSubmit(values) {
    try {
      this.bitrix.getUserByEmail(values.username).subscribe(async (data) => {
        if (data.result.length > 0) {
          var user = new User(data.result[0]);
          console.log(user);

          this.validations_form.reset();
          this.authService.login(user);
        } else {
          await this.presentAlert();
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  async presentAlert() {
    try {
      const alert = await this.alertController.create({
        cssClass: "my-custom-class",
        header: "Error",
        //subHeader: "Invalid credentials",
        message: "Incorrect user or password.",
        buttons: ["OK"],
      });

      await alert.present();
    } catch (error) {
      console.log(error);
    }
  }
}
