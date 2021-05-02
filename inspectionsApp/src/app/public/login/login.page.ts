import { AuthenticationService } from "./../../services/authentication.service";
import { Component, OnInit } from "@angular/core";
import {
  Validators,
  FormBuilder,
  FormGroup,
  FormControl,
} from "@angular/forms";

import {
  AlertController,
  LoadingController,
  ToastController,
} from "@ionic/angular";
import { User } from "src/app/models/user";
import { BitrixItestService } from "src/app/services/bitrix-itest.service";
import { ItestDealService } from "src/app/services/itest-deal.service";
import { BitrixENService } from "src/app/services/bitrix-inspection.service";
import { EnumEnterprise } from "src/app/models/enums";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
})
export class LoginPage implements OnInit {
  //validations_form: FormGroup;

  constructor(
    private authService: AuthenticationService,
    // private itestBitrix: BitrixItestService,
    // private eNBitrixService: BitrixENService,

    private inspectionService: ItestDealService,
    public formBuilder: FormBuilder,
    public alertController: AlertController,
    private loadingController: LoadingController,
    private toast: ToastController
  ) {}

  ngOnInit() {}

  async ionViewDidEnter() {
    try {
      var lastUser = await this.authService.getLastLoggedUser();
      if (lastUser) {
        this.email = lastUser.email;
        this.image = lastUser.image;
        this.segmentOption = lastUser.enterprise;
      }

      var top = await this.loadingController.getTop();
      if (top) {
        await this.loadingController.dismiss();
      }
    } catch (error) {
      console.log(error);
      var message = this.toast.create({
        message: error,
        color: "danger",
        duration: 3000,
      });
      (await message).present();
    }
  }

  segmentOption: string = "ITest";
  email: string = "";
  image: string;
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
    const loading = await this.loadingController.create({
      message: "Loading...",
    });
    try {
      await loading.present();
      var data;
      if (this.segmentOption == EnumEnterprise.itest) {
        data = await this.authService.getUserByEmailITest(values.username);
      } else {
        data = await this.authService.getUserByEmailEN(values.username);
      }
      if (data && data.result.length > 0) {
        data.result[0].ENTERPRISE = this.segmentOption;
        var user = new User(data.result[0]);
        console.log(user);

        this.validations_form.reset();
        await this.inspectionService.setEnterprise(this.segmentOption);
        await this.inspectionService.refreshFieldsFromServer(user);
        await this.inspectionService.getExternal(user);
        this.authService.login(user);
      } else {
        loading.dismiss();
        await this.presentAlert();
      }
    } catch (error) {
      console.log(error);
      if (error.status == 0) {
        var message = this.toast.create({
          message: "Unable to connect, review your connection.",
          color: "danger",
          duration: 3000,
        });
        (await message).present();
        loading.dismiss();
      } else {
        var message = this.toast.create({
          message: error.message,
          color: "danger",
          duration: 3000,
        });
        (await message).present();
        loading.dismiss();
      }
    }
  }

  async presentAlert() {
    try {
      const alert = await this.alertController.create({
        cssClass: "my-custom-class",
        header: "Error",
        message: "Incorrect user or password.",
        buttons: ["OK"],
      });

      await alert.present();
    } catch (error) {
      console.log(error);
      var message = this.toast.create({
        message: error,
        color: "danger",
        duration: 3000,
      });
      (await message).present();
    }
  }
}
