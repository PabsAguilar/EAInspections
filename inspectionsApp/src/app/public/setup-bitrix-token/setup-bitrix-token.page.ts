import { Component, OnInit } from "@angular/core";
import { AlertController, ToastController } from "@ionic/angular";
import { BitrixSetup } from "src/app/models/bitrix-setup";
import { AuthenticationService } from "src/app/services/authentication.service";
import { BitrixItestService } from "src/app/services/bitrix-itest.service";
import { BitrixTokenSetupService } from "src/app/services/bitrix-token-setup.service";

@Component({
  selector: "app-setup-bitrix-token",
  templateUrl: "./setup-bitrix-token.page.html",
  styleUrls: ["./setup-bitrix-token.page.scss"],
})
export class SetupBitrixTokenPage implements OnInit {
  constructor(
    private bitrixTokenService: BitrixTokenSetupService,
    private alertController: AlertController,
    private bitrixService: BitrixItestService,
    private toast: ToastController,
    private auth: AuthenticationService
  ) {}

  bitrixSetup: BitrixSetup = new BitrixSetup();
  testingSucessfullEN: boolean;
  testingSucessfullITest: boolean;
  ngOnInit() {}

  async ionViewDidEnter() {
    this.bitrixSetup = await this.bitrixTokenService.getBitrixSetup();
    this.bitrixSetup.itestToken = "";
    this.bitrixSetup.expertNetworksToken = "";
  }

  async userWantsToUpdateSetup() {
    try {
      await this.bitrixTokenService.setBitrixSetup(this.bitrixSetup);
      const alert = await this.alertController.create({
        header: "Confirmation",
        message:
          "Settings has been updated, please login to complete the setup.",
        buttons: [
          {
            text: "Ok",
            handler: async () => {
              console.log("saved");
              this.auth.logout();
            },
          },
        ],
      });
      await alert.present();
    } catch (error) {
      var message = this.toast.create({
        message: error,
        color: "danger",
        duration: 2000,
      });
      (await message).present();
    }
  }

  // async userCanSaveSetup(): Promise<boolean> {
  //   return
  // }
  async change() {
    this.testingSucessfullEN = null;
    this.testingSucessfullITest = null;
  }
  async userWantsToTestENSetup() {
    console.log("test");
    this.testingSucessfullEN = await this.bitrixService.testSetup(
      this.bitrixSetup.expertNetworksURL,
      this.bitrixSetup.expertNetworksToken
    );
    this.testingSucessfullITest = await this.bitrixService.testSetup(
      this.bitrixSetup.itestURL,
      this.bitrixSetup.itestToken
    );
  }
}
