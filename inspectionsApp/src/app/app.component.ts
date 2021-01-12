import { NavigationStart, Router, RouterEvent } from "@angular/router";
import { AuthenticationService } from "./services/authentication.service";
import { Component, NgZone } from "@angular/core";

import { Platform } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private auth: AuthenticationService,
    private router: Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.auth.setTheme();

      this.auth.authenticationState.subscribe((state) => {
        if (state) {
          var random = Math.floor(Math.random() * 100) + 2;
          this.router.navigate([
            "menu/tabs/tabs/pending-inspections/" + random.toString(),
          ]);
        } else {
          this.router.navigate(["/login"]);
        }
      });
    });
  }
}
