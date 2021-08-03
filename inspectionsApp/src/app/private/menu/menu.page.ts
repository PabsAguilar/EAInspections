import { Component, OnInit } from "@angular/core";
import { Router, RouterEvent } from "@angular/router";
import { AuthenticationService } from "src/app/services/authentication.service";
import { Storage } from "@ionic/storage";
import { User } from "src/app/models/user";
import { ItestDealService } from "src/app/services/itest-deal.service";
import { SyncInspectionService } from "src/app/services/sync-inspection.service";
import { LoadingController, ToastController } from "@ionic/angular";
const THEME_KEY = "theme-style";
@Component({
  selector: "app-menu",
  templateUrl: "./menu.page.html",
  styleUrls: ["./menu.page.scss"],
})
export class MenuPage implements OnInit {
  constructor(
    private storage: Storage,
    private auth: AuthenticationService,
    private router: Router,
    private inspectionService: ItestDealService,
    private syncInspectionService: SyncInspectionService,
    private loadingController: LoadingController,
    private toast: ToastController
  ) {
    auth.getTheme().then((result) => {
      if (result == "dark") {
        this.darkMode = true;
      } else {
        this.darkMode = false;
      }
    });

    this.router.events.subscribe((event: RouterEvent) => {
      this.activePath = event.url;
    });
  }
  authservice = this.auth;
  user: User = new User();
  activePath = "";
  pendingToSync: number = 0;
  ngOnInit() {}
  darkMode: boolean;

  async ionViewWillEnter() {
    //TODO: Validate connection to internet
    try {
      this.user = await this.authservice.getUser();
    } catch (error) {
      var message = this.toast.create({
        message: error,
        color: "danger",
        duration: 2000,
      });
      (await message).present();
    }
  }

  pages = [{ title: "Workspace", url: "/menu/tabs" }];
  userWantsToChangeTheme(event) {
    let systemDark = window.matchMedia("(prefers-color-scheme: dark)");
    systemDark.addListener(this.colorTest);
    if (event.detail.checked) {
      document.body.setAttribute("data-theme", "dark");
      this.setThemeInStorage("dark");
    } else {
      document.body.setAttribute("data-theme", "light");
      this.setThemeInStorage("light");
    }
  }

  setThemeInStorage(theme: String) {
    this.storage.set(THEME_KEY, theme);
  }

  colorTest(systemInitiatedDark) {
    if (systemInitiatedDark.matches) {
      document.body.setAttribute("data-theme", "dark");
    } else {
      document.body.setAttribute("data-theme", "light");
    }
  }
  userWantsToLogout() {
    this.authservice.logout();
  }

  async userWantsToGetFromServer() {
    var loading = await this.loadingController.create({
      message: "Getting Inspection Deals",
    });
    await loading.present();
    try {
      await this.inspectionService.getExternal(this.user);
      await this.inspectionService.refreshFieldsFromServer(this.user);
      this.syncInspectionService.publishSomeData({
        syncItem: "deal",
        refreshFromServer: false,
      });
    } catch (error) {
      var message = this.toast.create({
        message:
          error && error.error.error_description
            ? error.error.error_description
            : error,
        color: "danger",
        duration: 2000,
      });
      (await message).present();
    }

    if (loading) {
      await this.loadingController.dismiss();
    }
  }
  async userWantsToSync() {
    var loading = await this.loadingController.create({
      message: "Sync Pending Inspection",
    });
    await loading.present();

    try {
      var response = await this.syncInspectionService.syncAllPending();
      await this.inspectionService.getExternal(this.user);
      await this.inspectionService.refreshFieldsFromServer(this.user);
      this.syncInspectionService.publishSomeData({
        syncItem: "deal",
        refreshFromServer: false,
      });
    } catch (error) {
      var message = this.toast.create({
        message: error,
        color: "danger",
        duration: 2000,
      });
      (await message).present();
    }

    if (loading) {
      await this.loadingController.dismiss();
    }
  }
}
