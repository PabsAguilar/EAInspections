import { Injectable } from "@angular/core";

import { Storage } from "@ionic/storage";
import { BitrixSetup } from "../models/bitrix-setup";
import { GenericStorageService } from "./generic-storage.service";

@Injectable({
  providedIn: "root",
})
export class BitrixTokenSetupService {
  collectionName: string = "bitrix_token";

  defaultSetup: BitrixSetup;

  constructor(private storage: Storage) {
    this.defaultSetup = new BitrixSetup();

    this.defaultSetup.itestURL = "https://itest.bitrix24.com/rest/6";
    this.defaultSetup.itestToken = "ggu0xx7zmtikm7el";
    this.defaultSetup.expertNetworksURL =
      "https://expertnetwork.bitrix24.com/rest/159/";
    this.defaultSetup.expertNetworksToken = "mgu39h2f26jllv27";
  }

  async getBitrixSetup(): Promise<BitrixSetup> {
    var stored = await this.storage.get(this.collectionName);

    if (!stored) {
      var stored = await this.storage.set(
        this.collectionName,
        this.defaultSetup
      );
      return this.defaultSetup;
    } else {
      return stored;
    }
  }

  async setBitrixSetup(newSetup: BitrixSetup) {
    if (newSetup) {
      this.defaultSetup = newSetup;
      return await this.storage.set(this.collectionName, newSetup);
    }
  }
}
