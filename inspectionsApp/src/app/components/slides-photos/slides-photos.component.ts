import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { IonSlides, ModalController } from "@ionic/angular";
import {
  BitrixPicture,
  BitrixPictureList,
} from "src/app/models/bitrix-picture";
import { PhotoService } from "src/app/services/photo.service";
import { ImageModalPage } from "../image-modal/image-modal.page";

@Component({
  selector: "app-slides-photos",
  templateUrl: "./slides-photos.component.html",
  styleUrls: ["./slides-photos.component.scss"],
})
export class SlidesPhotosComponent implements OnInit {
  private first: boolean = true;
  @ViewChild("slides") ionSlides: IonSlides;

  @Input()
  title: string;

  @Input("ngModel")
  get photoArray(): BitrixPictureList {
    return this._photoArray;
  }
  set photoArray(value: BitrixPictureList) {
    this._photoArray = value;
  }
  _photoArray = new BitrixPictureList();

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
    var picture = new BitrixPicture();
    picture.base64Image = photo;
    picture.isSync = false;
    this._photoArray.images.push(picture);
    await this.ionSlides.update();
    this.ionSlides.slideTo(this._photoArray.images.length + 1);
    this.photoChanged.emit({ value: this._photoArray });
    this.first = false;
  }

  sliderConfig = {
    // slidesPerView: 1.1,
    // spaceBetween: 2,
    centeredSlides: true,
  };
  ngOnInit() {}

  async ionSlidedrag() {
    if (this.first) {
      await this.ionSlides.update();
      this.first = false;
    }
  }
  public async deletePictureFrontHouse(index) {
    console.log("delete " + index);
    this._photoArray.images.splice(index, 1);
    await this.ionSlides.update();
    this.photoChanged.emit({ value: this._photoArray });
  }
}
