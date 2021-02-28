import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from "@angular/core";
import { Router } from "@angular/router";
import {
  LoadingController,
  PopoverController,
  ToastController,
} from "@ionic/angular";
import SignaturePad from "signature_pad";
import { GenericListPopOverComponent } from "src/app/components/generic-list-pop-over/generic-list-pop-over.component";

import { Agreements } from "src/app/models/agreements";
import { BitrixPicture } from "src/app/models/bitrix-picture";
import { InspectionTask } from "src/app/models/inspection-task";
import { InspectionNavigateService } from "src/app/services/inspection-navigate.service";
import { InspectionsStorageService } from "src/app/services/inspections-storage.service";

@Component({
  selector: "app-environmental-agreements",
  templateUrl: "./environmental-agreements.page.html",
  styleUrls: ["./environmental-agreements.page.scss"],
})
export class EnvironmentalAgreementsPage implements OnInit, AfterViewInit {
  @ViewChild("canvas", { static: true }) signaturePadElement;
  signaturePad: any;
  canvasWidth: number;
  canvasHeight: number;
  name: string;

  constructor(
    private router: Router,
    private loadingController: LoadingController,
    private toast: ToastController,
    private inspectionNavigate: InspectionNavigateService,
    private elementRef: ElementRef,
    private inspectionStorageService: InspectionsStorageService
  ) {
    if (this.router.getCurrentNavigation().extras.state) {
      this.task = this.router.getCurrentNavigation().extras.state.task;
      if (!this.task.agreements) {
        this.task.agreements = new Agreements();
      }
    }
  }
  ngAfterViewInit(): void {
    this.signaturePad = new SignaturePad(
      this.signaturePadElement.nativeElement
    );
    this.signaturePad.clear();

    // this.signaturePad.penColor = "#3880ff";
  }

  ngOnInit() {
    const canvas: any = this.elementRef.nativeElement.querySelector("canvas");
    canvas.width = window.innerWidth - 16;
    // canvas.height = window.innerHeight - 140;
    if (this.signaturePad) {
      this.signaturePad.clear(); // Clear the pad on init
    }
  }

  clear() {
    this.signaturePad.clear();
  }

  undo() {
    const data = this.signaturePad.toData();
    if (data) {
      data.pop(); // remove the last dot or line
      this.signaturePad.fromData(data);
    }
  }

  task: InspectionTask;

  isCanvasBlank(): boolean {
    if (this.signaturePad) {
      return this.signaturePad.isEmpty() ? true : false;
    }
  }

  canAdd(): boolean {
    return this.task.agreements.signature.images.length <= 2;
  }

  async save() {
    try {
      var signature = new BitrixPicture();
      signature.base64Image = this.signaturePad.toDataURL();
      signature.isSync = false;
      this.task.agreements.signature.images.push(signature);
      if (this.task.agreements.signature.images.length > 0) {
        this.UpdateEntity();
      }
      this.clear();
      this.name = null;
    } catch (error) {
      var message = this.toast.create({
        message: error,
        color: "danger",
        duration: 2000,
      });
      (await message).present();
    }
  }

  dropSignature(index) {
    this.task.agreements.signature.images.splice(index, 1);
    this.UpdateEntity();
  }

  public async UpdateEntity(): Promise<void> {
    try {
      this.task.internalStatus = "In Progress";
      await this.inspectionStorageService.update(this.task);
    } catch (error) {
      var message = this.toast.create({
        message: error,
        color: "danger",
        duration: 2000,
      });
      (await message).present();
    }
  }

  async back() {
    await this.inspectionNavigate.backFromAgreementsPage(this.task);
  }

  async ionViewDidEnter() {
    try {
      var top = await this.loadingController.getTop();
      if (top) {
        await top.dismiss();
      }
      this.signaturePad = new SignaturePad(
        this.signaturePadElement.nativeElement
      );
      this.task.agreements.hasOpen = true;
    } catch (error) {
      var message = this.toast.create({
        message: error,
        color: "danger",
        duration: 2000,
      });
      (await message).present();
    }
  }
}
