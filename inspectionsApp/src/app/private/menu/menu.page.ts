import { Component, OnInit } from "@angular/core";
import { Router, RouterEvent } from "@angular/router";
import { AuthenticationService } from "src/app/services/authentication.service";
import { Storage } from "@ionic/storage";
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
    private router: Router
  ) {
    this.router.events.subscribe((event: RouterEvent) => {
      this.activePath = event.url;
    });
  }
  authservice = this.auth;
  activePath = "";
  ngOnInit() {}

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
}
