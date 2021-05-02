import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";

import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { HttpClientModule } from "@angular/common/http";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { IonicStorageModule } from "@ionic/storage";
import { CallNumber } from "@ionic-native/call-number/ngx";
import { LaunchNavigator } from "@ionic-native/launch-navigator/ngx";
import { EmailComposer } from "@ionic-native/email-composer/ngx";
import { File } from "@ionic-native/file/ngx";

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    IonicStorageModule.forRoot({
      name: "inspectionDB",
      driverOrder: ["indexeddb", "sqlite", "websql"],
    }),
  ],
  providers: [
    StatusBar,
    SplashScreen,
    CallNumber,
    LaunchNavigator,
    EmailComposer,
    File,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
