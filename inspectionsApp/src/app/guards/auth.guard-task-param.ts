import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthenticationService } from "../services/authentication.service";

@Injectable({
  providedIn: "root",
})
export class AuthGuardTaskParam implements CanActivate {
  constructor(public router: Router) {}

  canActivate(): boolean {
    return (
      this.router.getCurrentNavigation().extras.state != null &&
      this.router.getCurrentNavigation().extras.state.task != null
    );
  }
  canLoad(): boolean {
    return (
      this.router.getCurrentNavigation().extras.state != null &&
      this.router.getCurrentNavigation().extras.state.task != null
    );
  }
}
