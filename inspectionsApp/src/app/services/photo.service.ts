import { Injectable } from "@angular/core";
import {
  Plugins,
  CameraResultType,
  Capacitor,
  FilesystemDirectory,
  CameraPhoto,
  CameraSource,
  CameraDirection,
} from "@capacitor/core";
import { Platform } from "@ionic/angular";
import { BitrixPicture } from "../models/bitrix-picture";

const { Camera, Filesystem, Storage } = Plugins;

@Injectable({
  providedIn: "root",
})
export class PhotoService {
  private platform: Platform;
  constructor(platform: Platform) {
    this.platform = platform;
  }

  // public async takePhoto(): Promise<string> {
  //   // Take a photo

  //   const capturedPhoto = await Camera.getPhoto({
  //     resultType: CameraResultType.DataUrl,
  //     source: CameraSource.Camera,
  //     quality: 40,
  //     width: 1920,
  //   });
  //   var result = capturedPhoto.dataUrl;

  //   return result;
  // }

  public async takePhotoB(): Promise<BitrixPicture> {
    // Take a photo

    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
      quality: 40,
      width: 1920,
    });

    var result = new BitrixPicture();
    result.base64Image = capturedPhoto.dataUrl;
    result.format = capturedPhoto.format;

    return result;
  }
  convertBlobToBase64 = (blob: Blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });

  // Read camera photo into base64 format based on the platform the app is running on
  private async readAsBase64(cameraPhoto: CameraPhoto) {
    // "hybrid" will detect Cordova or Capacitor
    if (this.platform.is("hybrid")) {
      // Read the file into base64 format
      const file = await Filesystem.readFile({
        path: cameraPhoto.path,
      });

      return file.data;
    } else {
      // Fetch the photo, read as a blob, then convert to base64 format
      const response = await fetch(cameraPhoto.webPath!);
      const blob = await response.blob();

      return (await this.convertBlobToBase64(blob)) as string;
    }
  }
}
