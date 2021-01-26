import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild,
} from "@angular/core";
import { IonSlides, ModalController } from "@ionic/angular";
import { ImageModalPage } from "../image-modal/image-modal.page";

@Component({
  selector: "app-photo",
  templateUrl: "./photo.component.html",
  styleUrls: ["./photo.component.scss"],
})
export class PhotoComponent implements OnInit {
  constructor(private modalController: ModalController) {}

  @Input("ngModel")
  get photo(): string {
    return this.image;
  }
  set photo(value: string) {
    this.image = value;
  }
  image: string = "";
  private first: boolean = true;
  @ViewChild("slides") ionSlides: IonSlides;
  ngOnInit() {}

  async ngAfterViewInit() {}

  async ionSlidedrag() {
    if (this.first) {
      await this.ionSlides.update();
      this.first = false;
    }
  }
  async openPreview(image: string) {
    const modal = await this.modalController.create({
      component: ImageModalPage,
      cssClass: "transparent-modal",
      componentProps: {
        image,
      },
    });
    modal.present();
  }

  sliderConfig = {
    // slidesPerView: 1.1,
    // spaceBetween: 2,
    zoom: false,
    centeredSlides: true,
  };
}
