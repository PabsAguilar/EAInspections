import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { IonSlides, ModalController } from "@ionic/angular";
import { PhotoService } from "src/app/services/photo.service";
import { ImageModalPage } from "../image-modal/image-modal.page";

@Component({
  selector: "app-slides-photos",
  templateUrl: "./slides-photos.component.html",
  styleUrls: ["./slides-photos.component.scss"],
})
export class SlidesPhotosComponent implements OnInit {
  // @Input("ngModel")
  // photoArray: string[];
  @ViewChild("slides") ionSlides: IonSlides;
  @Input()
  title: string;

  @Input("ngModel")
  get photoArray(): string[] {
    return this._photoArray;
  }
  set photoArray(value: string[]) {
    this._photoArray = value;
  }
  _photoArray = [];

  @Output() photoChanged: any = new EventEmitter();

  constructor(
    public photoService: PhotoService,
    private modalController: ModalController
  ) {}

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
  public async takePicture() {
    var photo = await this.photoService.takePhoto();

    this._photoArray.push(photo);
    await this.ionSlides.update();
    this.ionSlides.slideTo(this._photoArray.length + 1);
    this.photoChanged.emit({ value: this._photoArray });
  }

  sliderConfig = {
    // slidesPerView: 1.1,
    // spaceBetween: 2,
    centeredSlides: true,
  };
  ngOnInit() {}

  public async deletePictureFrontHouse(index) {
    console.log("delete " + index);
    this._photoArray.splice(index, 1);
    console.log(this._photoArray);
    await this.ionSlides.update();
    this.photoChanged.emit({ value: this._photoArray });
  }
}
