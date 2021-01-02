import { Component, OnInit } from "@angular/core";
import { Router, RouterEvent } from "@angular/router";
import { AuthenticationService } from "src/app/services/authentication.service";

@Component({
  selector: "app-menu",
  templateUrl: "./menu.page.html",
  styleUrls: ["./menu.page.scss"],
})
export class MenuPage implements OnInit {
  constructor(private auth: AuthenticationService, private router: Router) {
    this.router.events.subscribe((event: RouterEvent) => {
      this.activePath = event.url;
    });
  }
  authservice = this.auth;
  activePath = "";
  ngOnInit() {}

  pages = [{ title: "Workspace", url: "/menu/tabs" }];
  userWantsToLogout() {
    this.authservice.logout();
  }
}
