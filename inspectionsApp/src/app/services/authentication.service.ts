import { Platform } from "@ionic/angular";
import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import { BehaviorSubject } from "rxjs";
import { User } from "../models/user";
import { ItestDealService } from "./itest-deal.service";

const TOKEN_KEY = "auth-token";
const LAST_USER_KEY = "last-user-token";
const THEME_KEY = "theme-style";
const SYNCSTAMP_KEY = "inspection-stamp-key";
const INSPECTIONS_KEY = "inspections-task";
const SCHEDULINGS_KEY = "scheduling-form";
const ENVIRONMENTAL_FIELDS_KEY = "environmental-inspection-fields";
const DEAL_FIELDS_KEY = "deals-fields";

@Injectable({
  providedIn: "root",
})
export class AuthenticationService {
  authenticationState = new BehaviorSubject(false);

  constructor(
    private storage: Storage,
    private plt: Platform,
    private inspectionService: ItestDealService
  ) {
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

  public getUser(): Promise<User> {
    return this.storage.get(TOKEN_KEY).then((res) => {
      if (res) {
        return res;
      }
    });
  }
  login(user: User) {
    this.storage.set(LAST_USER_KEY, user);
    this.inspectionService.refreshFieldsFromServer(user.userId);
    this.inspectionService.getExternal(user.userId);
    return this.storage.set(TOKEN_KEY, user).then(() => {
      this.authenticationState.next(true);
    });
  }

  public getLastLoggedUser(): Promise<User> {
    return this.storage.get(LAST_USER_KEY).then((res) => {
      if (res) {
        return res;
      }
    });
  }

  logout() {
    return this.storage.remove(TOKEN_KEY).then(async () => {
      // await this.storage.remove(SYNCSTAMP_KEY);
      // await this.storage.remove(INSPECTIONS_KEY);
      // await this.storage.remove(SCHEDULINGS_KEY);
      // await this.storage.remove(ENVIRONMENTAL_FIELDS_KEY);
      // await this.storage.remove(DEAL_FIELDS_KEY);

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
