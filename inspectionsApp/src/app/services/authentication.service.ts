import { Platform } from "@ionic/angular";
import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import { BehaviorSubject } from "rxjs";

const TOKEN_KEY = "auth-token";
const THEME_KEY = "theme-style";
const SYNCSTAMP_KEY = "inspection-stamp-key";
const INSPECTIONS_KEY = "inspections-task";
const SCHEDULINGS_KEY = "scheduling-form";

@Injectable({
  providedIn: "root",
})
export class AuthenticationService {
  authenticationState = new BehaviorSubject(false);

  constructor(private storage: Storage, private plt: Platform) {
    this.plt.ready().then(() => {
      this.checkToken();
    });
  }

  checkToken() {
    this.storage.get(TOKEN_KEY).then((res) => {
      if (res) {
        this.authenticationState.next(true);
      }
    });
  }

  login() {
    return this.storage.set(TOKEN_KEY, "loaded").then(() => {
      this.authenticationState.next(true);
    });
  }

  logout() {
    return this.storage.remove(TOKEN_KEY).then(async () => {
      await this.storage.remove(SYNCSTAMP_KEY);
      await this.storage.remove(INSPECTIONS_KEY);
      await this.storage.remove(SCHEDULINGS_KEY);
      this.authenticationState.next(false);
    });
  }

  setTheme() {
    this.storage.get(THEME_KEY).then((res) => {
      if (res) {
        console.log("set theme" + res);
        document.body.setAttribute("data-theme", res);
      } else {
        this.storage.set(THEME_KEY, "light");
      }
    });
  }

  getTheme(): Promise<string> {
    return this.storage.get(THEME_KEY).then((res) => {
      if (res) {
        return res.toString();
      } else {
        this.storage.set(THEME_KEY, "light");
        return "light";
      }
    });
  }
  isAuthenticated() {
    return this.authenticationState.value;
  }
}
