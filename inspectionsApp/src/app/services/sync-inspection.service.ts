import { Injectable } from "@angular/core";
import { async } from "@angular/core/testing";
import { ToastController } from "@ionic/angular";
import { resolve } from "dns";
import { symlinkSync } from "fs";
import { element } from "protractor";
import { Observable, of } from "rxjs";
import { observeOn } from "rxjs/operators";
import { BitrixPicture, BitrixPictureList } from "../models/bitrix-picture";
import { Company } from "../models/company";
import { Contact } from "../models/contact";
import { DamageInspection } from "../models/damage-inspection";
import { DamageAreaType, InspectionStatus } from "../models/enums";
import { Asbesto } from "../models/environmental-form/asbesto";
import { Lead } from "../models/environmental-form/lead";
import { MoistureMapping } from "../models/environmental-form/moisture-mapping";
import { BitrixFolder, InspectionTask } from "../models/inspection-task";
import { Scheduling } from "../models/scheduling";
import { SyncInfo } from "../models/sync-info";
import { BitrixItestService } from "./bitrix-itest.service";
import { InspectionsStorageService } from "./inspections-storage.service";
import { SchedulingStorageService } from "./scheduling-storage.service";

@Injectable({
  providedIn: "root",
})
export class SyncInspectionService {
  constructor(
    private bitrix: BitrixItestService,
    private inspectionStorage: InspectionsStorageService,
    private schedulingStorageService: SchedulingStorageService,
    private toast: ToastController
  ) {}

  async syncSubfolder(task: InspectionTask): Promise<number> {
    try {
      var postData = {
        id: 100,
        data: {
          NAME: `${task.id}-${task.title}`,
        },
      };
      var response = await this.bitrix.createSubfolder(postData).toPromise();
      if (response?.result?.ID > 0) {
        return response.result.ID;
      } else return -1;
    } catch (error) {
      console.log(error);
    }
    return -1;
  }

  async syncListImages(
    pictures: BitrixPictureList,
    folder: BitrixFolder,
    name: string
  ): Promise<BitrixPictureList> {
    if (folder.syncInfo.isSync && !pictures.syncInfo.isSync) {
      await Promise.all(
        pictures.images.map(async (item, index) => {
          if (!item.isSync) {
            var postData = {
              id: folder.syncInfo.syncCode,
              data: {
                NAME: `${name}-${index + 1}-${Math.floor(
                  Math.random() * 1000
                )}.png`,
              },
              fileContent: item.base64Image.replace(
                "data:image/png;base64,",
                ""
              ),
            };

            var response = await this.bitrix.addFile(postData);
            if (response?.result?.FILE_ID > 0) {
              pictures.images[index].isSync = true;
              pictures.images[
                index
              ].syncCode = response.result.FILE_ID.toString();
              pictures.imagesCodesSync.push(response.result.FILE_ID);
            } else {
              pictures.images[index].isSync = false;
            }
            return response;
          }
        })
      );
    }

    if (
      pictures.images.length > 0 &&
      pictures.images.find((x) => !x.isSync) != null
    ) {
      pictures.syncInfo.isSync = false;
    } else {
      pictures.syncInfo.isSync = true;
    }
    return pictures;
  }
  async syncTaskImages(task: InspectionTask): Promise<InspectionTask> {
    await Promise.all(
      task.environmentalForm.moldAreas.areasInspection
        .filter(
          (x) =>
            x.areaPictures.images.length > 0 && !x.areaPictures.syncInfo.isSync
        )
        .map(async (item, index) => {
          task.environmentalForm.moldAreas.areasInspection[
            index
          ].areaPictures = await this.syncListImages(
            task.environmentalForm.moldAreas.areasInspection[index]
              .areaPictures,
            task.bitrixFolder,
            "MoldIns-Area" + (index + 1)
          );
          await this.inspectionStorage.update(task);

          return Promise.resolve(true);
        })
    );

    await Promise.all(
      task.environmentalForm.bacteriasAreas.areasInspection
        .filter(
          (x) =>
            x.areaPictures.images.length > 0 && !x.areaPictures.syncInfo.isSync
        )
        .map(async (item, index) => {
          task.environmentalForm.bacteriasAreas.areasInspection[
            index
          ].areaPictures = await this.syncListImages(
            task.environmentalForm.bacteriasAreas.areasInspection[index]
              .areaPictures,
            task.bitrixFolder,
            "BactIns-Area" + (index + 1)
          );
          await this.inspectionStorage.update(task);

          return Promise.resolve(true);
        })
    );

    await Promise.all(
      task.environmentalForm.sootAreas.areasInspection
        .filter(
          (x) =>
            x.areaPictures.images.length > 0 && !x.areaPictures.syncInfo.isSync
        )
        .map(async (item, index) => {
          task.environmentalForm.sootAreas.areasInspection[
            index
          ].areaPictures = await this.syncListImages(
            task.environmentalForm.sootAreas.areasInspection[index]
              .areaPictures,
            task.bitrixFolder,
            "Soot-Area" + (index + 1)
          );
          await this.inspectionStorage.update(task);

          return Promise.resolve(true);
        })
    );

    task.environmentalForm.generalInfoInspection.pictureHouseNumbers = await this.syncListImages(
      task.environmentalForm.generalInfoInspection.pictureHouseNumbers,
      task.bitrixFolder,
      "General-HouseNumber"
    );
    await this.inspectionStorage.update(task);
    task.environmentalForm.generalInfoInspection.picturesFrontHouse = await this.syncListImages(
      task.environmentalForm.generalInfoInspection.picturesFrontHouse,
      task.bitrixFolder,
      "General-FrontHouse"
    );
    await this.inspectionStorage.update(task);

    task.agreements.signature = await this.syncListImages(
      task.agreements.signature,
      task.bitrixFolder,
      "AgreementSignature"
    );
    await this.inspectionStorage.update(task);

    return task;
  }

  async syncGeneralInformation(task: InspectionTask): Promise<number> {
    try {
      let postData = {
        id: task.id,
        fields: {},
      };

      if (task.environmentalForm.generalInfoInspection.propertyYear)
        postData["UF_CRM_1606466447"] =
          task.environmentalForm.generalInfoInspection.propertyYear;
      if (task.environmentalForm.generalInfoInspection.propertyType)
        postData["UF_CRM_1606466564"] =
          task.environmentalForm.generalInfoInspection.propertyType;
      if (task.environmentalForm.generalInfoInspection.interiorTemperature)
        postData["UF_CRM_1606466601"] =
          task.environmentalForm.generalInfoInspection.interiorTemperature;
      if (task.environmentalForm.generalInfoInspection.exteriorRelativeHumidity)
        postData["UF_CRM_1606466624"] =
          task.environmentalForm.generalInfoInspection.exteriorRelativeHumidity;
      if (task.environmentalForm.generalInfoInspection.HVACSystemCondition)
        postData["UF_CRM_1606466669"] =
          task.environmentalForm.generalInfoInspection.HVACSystemCondition;
      if (task.environmentalForm.generalInfoInspection.ductsCondition)
        postData["UF_CRM_1606466692"] =
          task.environmentalForm.generalInfoInspection.ductsCondition;
      if (task.environmentalForm.generalInfoInspection.atticCondition)
        postData["UF_CRM_1606466732"] =
          task.environmentalForm.generalInfoInspection.atticCondition;

      if (
        task.environmentalForm.generalInfoInspection.picturesFrontHouse.images
          .length > 0
      ) {
        var x = task.environmentalForm.generalInfoInspection.picturesFrontHouse.images.map(
          (x, index) => {
            return {
              fileData: [
                `FrontHouse-${index}-${task.id}-${Math.floor(
                  Math.random() * 1000
                )}.png`,
                x.base64Image.replace("data:image/png;base64,", ""),
              ],
            };
          }
        );
        postData.fields["UF_CRM_1606466511"] = x;
      }

      if (
        task.environmentalForm.generalInfoInspection.pictureHouseNumbers.images
          .length > 0
      ) {
        postData.fields["UF_CRM_1606466494"] = {
          fileData: [
            `HouseNumber-${task.id}-${Math.floor(Math.random() * 1000)}.png`,
            task.environmentalForm.generalInfoInspection.pictureHouseNumbers.images[0].base64Image.replace(
              "data:image/png;base64,",
              ""
            ),
          ],
        };
      }
      if (task.agreements.signature.images.length > 0) {
        postData.fields["UF_CRM_1612683169"] =
          task.environmentalForm.generalInfoInspection.agreementSignedYesNo;

        var x = task.agreements.signature.images.map((x, index) => {
          return {
            fileData: [
              `AgreementSignature-${index}-${task.id}-${Math.floor(
                Math.random() * 1000
              )}.png`,
              x.base64Image.replace("data:image/png;base64,", ""),
            ],
          };
        });
        postData.fields["UF_CRM_1612780368"] = x;
      }

      var response = await this.bitrix.updateDeal(postData).toPromise();

      if (response && response.result > 0) {
        return response.result;
      } else return -1;
    } catch (error) {
      console.log(error);
      return -1;
    }
  }

  async syncContact(contact: Contact): Promise<Contact> {
    try {
      var postData = {
        fields: {
          NAME: contact.firstName,
          SECOND_NAME: "",
          LAST_NAME: contact.lastName,
          PHONE: [{ VALUE: contact.contactPhone }],
          EMAIL: [{ VALUE: contact.contactEmail }],
        },
      };
      var response = await this.bitrix.createContact(postData).toPromise();
      if (response?.result > 0) {
        contact.syncInfo.isSync = true;
        contact.syncInfo.syncCode = response.result;
        contact.idContact = response.result;
        return contact;
      } else {
        contact.syncInfo.isSync = false;
        return contact;
      }
    } catch (error) {
      console.log(error);
    }
    contact.syncInfo.isSync = false;
    return contact;
  }

  async syncCompany(company: Company): Promise<Company> {
    try {
      var postData = {
        fields: {
          TITLE: company.title,
          COMPANY_TYPE: "CUSTOMER",
          COMMENTS: "Created by Inspection MobileApp",
          CURRENCY_ID: "USD",
          IS_MY_COMPANY: "N",
        },
      };
      var response = await this.bitrix.createCompany(postData).toPromise();
      if (response?.result > 0) {
        company.syncInfo.isSync = true;
        company.syncInfo.syncCode = response.result;
        company.id = response.result;
        return company;
      } else {
        company.syncInfo.isSync = false;
        return company;
      }
    } catch (error) {
      console.log(error);
    }
    company.syncInfo.isSync = false;
    return company;
  }

  async syncSchedulingInspection(
    scheduling: Scheduling
  ): Promise<Observable<boolean>> {
    try {
      if (!scheduling.contact.syncInfo.isSync) {
        scheduling.contact = await this.syncContact(scheduling.contact);
        if (!scheduling.contact.syncInfo.isSync) {
          return of(false);
        }
      }

      if (!scheduling.insuranceCompanyContact.syncInfo.isSync) {
        scheduling.insuranceCompanyContact = await this.syncContact(
          scheduling.insuranceCompanyContact
        );
        if (!scheduling.insuranceCompanyContact.syncInfo.isSync) {
          return of(false);
        }
      }

      if (!scheduling.insuranceCompany.syncInfo.isSync) {
        scheduling.insuranceCompany = await this.syncCompany(
          scheduling.insuranceCompany
        );
        if (!scheduling.insuranceCompany.syncInfo.isSync) {
          return of(false);
        }
      }

      let postData = {
        fields: {
          TITLE: "Scheduling Form - " + scheduling.contact.lastName + " - IApp",
          TYPE_ID: "",
          STAGE_ID: "New Order",
          COMPANY_ID: "",
          CONTACT_ID: scheduling.contact.idContact,
          OPENED: "N",
          CLOSED: "N",
          ASSIGNED_BY_ID: scheduling.inspectorUserId,
          CREATED_BY_ID: scheduling.inspectorUserId,
          COMMENTS: scheduling.notes,
          PROBABILITY: null,
          CURRENCY_ID: "USD",
          OPPORTUNITY: 0,
          BEGINDATE: "",
          CLOSEDATE: "",
          UF_CRM_1612683055: scheduling.scheduleDateTime.toISOString(), //this.date2str(scheduling.scheduleDateTime),
          UF_CRM_1606466289: scheduling.serviceAddress,
          UF_CRM_1612682994: scheduling.inspectorUserId,
          UF_CRM_1612691342: [
            "C_" + scheduling.insuranceCompanyContact.idContact,
            "CO_" + scheduling.insuranceCompany.id,
          ],
        },
      };

      var response = await this.bitrix.createDeal(postData).toPromise();

      if (response && response.result > 0) {
        scheduling.syncInfo.isSync = true;
        scheduling.syncInfo.syncCode = response.result;
        scheduling.internalStatus = InspectionStatus.Completed;
        this.schedulingStorageService.update(scheduling);
        return of(true);
      } else return of(false);
    } catch (error) {
      console.log(error);
      return of(false);
    }
  }

  async syncTask(task: InspectionTask): Promise<Observable<boolean>> {
    try {
      if (!task.bitrixFolder.syncInfo.isSync) {
        var result = await this.syncSubfolder(task);
        task.bitrixFolder.syncInfo.isSync = result > 0;
        task.bitrixFolder.syncInfo.syncCode = result.toString();
        await this.inspectionStorage.update(task);
      }

      task = await this.syncTaskImages(task);
      if (!task.environmentalForm.generalInfoInspection.syncInfo.isSync) {
        var result = await this.syncGeneralInformation(task);
        if (result > 0) {
          task.environmentalForm.generalInfoInspection.syncInfo.isSync = true;
          task.environmentalForm.generalInfoInspection.syncInfo.syncCode = result.toString();
        }
      }

      if (!task.environmentalForm.moldAreas.syncInfo.isSync) {
        if (
          task.environmentalForm.moldAreas.moldInspectionType &&
          task.environmentalForm.moldAreas.areasInspection.find(
            (x) => x.areaName
          )
        ) {
          var result = await this.sendDamageInspection(
            task,
            DamageAreaType.Mold,
            48,
            "Mold Inspection - " + task.title
          );
          task.environmentalForm.moldAreas.syncInfo.isSync = result > 0;
          task.environmentalForm.moldAreas.syncInfo.syncCode = result.toString();
        } else {
          task.environmentalForm.moldAreas.syncInfo.isSync = true;
        }
        await this.inspectionStorage.update(task);
      }
      if (!task.environmentalForm.bacteriasAreas.syncInfo.isSync) {
        if (
          task.environmentalForm.bacteriasAreas.moldInspectionType &&
          task.environmentalForm.bacteriasAreas.areasInspection.find(
            (x) => x.areaName
          )
        ) {
          var result = await this.sendDamageInspection(
            task,
            DamageAreaType.Bacteria,
            50,
            "Bacteria Inspection - " + task.title
          );

          task.environmentalForm.bacteriasAreas.syncInfo.isSync = result > 0;
          task.environmentalForm.bacteriasAreas.syncInfo.syncCode = result.toString();
        } else {
          task.environmentalForm.bacteriasAreas.syncInfo.isSync = true;
        }
        await this.inspectionStorage.update(task);
      }
      if (!task.environmentalForm.sootAreas.syncInfo.isSync) {
        if (
          task.environmentalForm.sootAreas.moldInspectionType &&
          task.environmentalForm.sootAreas.areasInspection.find(
            (x) => x.areaName
          )
        ) {
          var result = await this.sendDamageInspection(
            task,
            DamageAreaType.Soot,
            52,
            "Soot Inspection - " + task.title
          );
          task.environmentalForm.sootAreas.syncInfo.isSync = result > 0;
          task.environmentalForm.sootAreas.syncInfo.syncCode = result.toString();
        } else {
          task.environmentalForm.sootAreas.syncInfo.isSync = true;
        }
        await this.inspectionStorage.update(task);
      }

      if (!task.environmentalForm.moistureMappingAreas.syncInfo.isSync) {
        if (
          task.environmentalForm.moistureMappingAreas.inspectionType &&
          task.environmentalForm.moistureMappingAreas.areamoistureMapping.find(
            (x) => x.area
          )
        ) {
          var result = await this.sendMoistureMapping(task);
          task.environmentalForm.moistureMappingAreas.syncInfo.isSync =
            result > 0;
          task.environmentalForm.moistureMappingAreas.syncInfo.syncCode = result.toString();
        } else {
          task.environmentalForm.moistureMappingAreas.syncInfo.isSync = true;
        }
        await this.inspectionStorage.update(task);
      }

      if (!task.environmentalForm.asbestosAreas.syncInfo.isSync) {
        if (
          task.environmentalForm.asbestosAreas.inspectionType &&
          task.environmentalForm.asbestosAreas.asbestosAreas.find(
            (x) => x.materialLocation
          )
        ) {
          var result = await this.sendAsbestos(task);
          task.environmentalForm.asbestosAreas.syncInfo.isSync = result > 0;
          task.environmentalForm.asbestosAreas.syncInfo.syncCode = result.toString();
        } else {
          task.environmentalForm.asbestosAreas.syncInfo.isSync = true;
        }
        await this.inspectionStorage.update(task);
      }

      if (!task.environmentalForm.leadAreas.syncInfo.isSync) {
        if (
          task.environmentalForm.leadAreas.inspectionType &&
          task.environmentalForm.leadAreas.leadAreas.find((x) => x.sample)
        ) {
          var result = await this.sendLead(task);
          task.environmentalForm.leadAreas.syncInfo.isSync = result > 0;
          task.environmentalForm.leadAreas.syncInfo.syncCode = result.toString();
        } else {
          task.environmentalForm.leadAreas.syncInfo.isSync = true;
        }
        await this.inspectionStorage.update(task);
      }

      if (
        task.environmentalForm.moldAreas.syncInfo.isSync &&
        task.environmentalForm.bacteriasAreas.syncInfo.isSync &&
        task.environmentalForm.sootAreas.syncInfo.isSync &&
        task.environmentalForm.generalInfoInspection.syncInfo.isSync &&
        task.environmentalForm.moistureMappingAreas.syncInfo.isSync &&
        task.environmentalForm.leadAreas.syncInfo.isSync &&
        task.environmentalForm.asbestosAreas.syncInfo.isSync
      ) {
        task.internalStatus = InspectionStatus.Completed;
        await this.inspectionStorage.update(task);
        return of(true);
      } else {
        await this.inspectionStorage.update(task);
      }
    } catch (error) {
      var message = this.toast.create({
        message: error,
        color: "danger",
        duration: 2000,
      });
      (await message).present();
      console.log(error);
      return of(false);
    }
  }

  async sendLead(task: InspectionTask): Promise<number> {
    try {
      let postData = {
        //ID: "126",
        IBLOCK_ID: 30,
        IBLOCK_TYPE_ID: "lists",
        ELEMENT_CODE:
          30 + "-" + task.id + "-" + (Math.random() * 100).toString(),
        FIELDS: {
          NAME: `Lead - ${task.id} - ${task.title}`,
          PROPERTY_3526: task.id,
        },
      };
      if (task.environmentalForm.leadAreas.contact) {
        postData.FIELDS[
          task.environmentalForm.leadAreas.leadAreasBitrixMapping.contactCode
        ] = task.contactId;
      }
      if (task.environmentalForm.leadAreas.inspectionDate) {
        postData.FIELDS[
          task.environmentalForm.leadAreas.leadAreasBitrixMapping.inspectionDateCode
        ] = task.environmentalForm.leadAreas.inspectionDate.toISOString();
      }
      if (task.environmentalForm.leadAreas.inspectionType) {
        postData.FIELDS[
          task.environmentalForm.leadAreas.leadAreasBitrixMapping.inspectionTypeCode
        ] = task.environmentalForm.leadAreas.inspectionType;
      }

      await Promise.all(
        task.environmentalForm.leadAreas.leadAreas.map(async (area: Lead) => {
          if (area.sample) {
            postData.FIELDS[area.bitrixMappingLead.sampleCode] = area.sample;
          }
          if (area.cardinalDirection) {
            postData.FIELDS[area.bitrixMappingLead.cardinalDirectionCode] =
              area.cardinalDirection;
          }
          if (area.dimensionCm2) {
            postData.FIELDS[area.bitrixMappingLead.dimensionCm2Code] =
              area.dimensionCm2;
          }
          if (area.material) {
            postData.FIELDS[area.bitrixMappingLead.materialCode] =
              area.material;
          }
          if (area.typeOfSample) {
            postData.FIELDS[area.bitrixMappingLead.typeOfSampleCode] =
              area.typeOfSample;
          }
          if (area.labResults) {
            postData.FIELDS[area.bitrixMappingLead.labResultsCode] =
              area.labResults;
          }
          if (area.observations) {
            postData.FIELDS[area.bitrixMappingLead.observationsCode] =
              area.observations;
          }
        })
      );

      var response = await this.bitrix
        .syncDamageAreaInspection(postData, 30)
        .toPromise();

      if (response && response.result > 0) {
        return response.result;
      } else return -1;
    } catch (error) {
      console.log(error);
      return -1;
    }
  }

  async sendAsbestos(task: InspectionTask): Promise<number> {
    try {
      let postData = {
        //ID: "126",
        IBLOCK_ID: 32,
        IBLOCK_TYPE_ID: "lists",
        ELEMENT_CODE:
          32 + "-" + task.id + "-" + (Math.random() * 100).toString(),
        FIELDS: {
          NAME: `Asbestos - ${task.id} - ${task.title}`,
          PROPERTY_3522: task.id,
        },
      };
      if (task.environmentalForm.asbestosAreas.contact) {
        postData.FIELDS[
          task.environmentalForm.asbestosAreas.asbestoAreasBitrixMapping.contactCode
        ] = task.contactId;
      }
      if (task.environmentalForm.asbestosAreas.inspectionDate) {
        postData.FIELDS[
          task.environmentalForm.asbestosAreas.asbestoAreasBitrixMapping.inspectionDateCode
        ] = task.environmentalForm.asbestosAreas.inspectionDate.toISOString();
      }
      if (task.environmentalForm.asbestosAreas.inspectionType) {
        postData.FIELDS[
          task.environmentalForm.asbestosAreas.asbestoAreasBitrixMapping.inspectionTypeCode
        ] = task.environmentalForm.asbestosAreas.inspectionType;
      }

      await Promise.all(
        task.environmentalForm.asbestosAreas.asbestosAreas.map(
          async (area: Asbesto) => {
            if (area.materialLocation) {
              postData.FIELDS[area.asbestoBitrixMaping.materialLocationCode] =
                area.materialLocation;
            }
            if (area.materialDescription) {
              postData.FIELDS[
                area.asbestoBitrixMaping.materialDescriptionCode
              ] = area.materialDescription;
            }
            if (area.totalQuantity) {
              postData.FIELDS[area.asbestoBitrixMaping.totalQuantityCode] =
                area.totalQuantity;
            }
            if (area.F_NF) {
              postData.FIELDS[area.asbestoBitrixMaping.F_NFCode] = area.F_NF;
            }
            if (area.condition) {
              postData.FIELDS[area.asbestoBitrixMaping.conditionCode] =
                area.condition;
            }
            if (area.labResults) {
              postData.FIELDS[area.asbestoBitrixMaping.labResultsCode] =
                area.labResults;
            }
            if (area.observations) {
              postData.FIELDS[area.asbestoBitrixMaping.observationsCode] =
                area.observations;
            }
          }
        )
      );

      var response = await this.bitrix
        .syncDamageAreaInspection(postData, 32)
        .toPromise();

      if (response && response.result > 0) {
        return response.result;
      } else return -1;
    } catch (error) {
      console.log(error);
      return -1;
    }
  }

  async sendMoistureMapping(task: InspectionTask): Promise<number> {
    try {
      let postData = {
        //ID: "126",
        IBLOCK_ID: 34,
        IBLOCK_TYPE_ID: "lists",
        ELEMENT_CODE:
          34 + "-" + task.id + "-" + (Math.random() * 100).toString(),
        FIELDS: {
          NAME: `Moisture Mapping - ${task.id} - ${task.title}`,
          PROPERTY_3528: task.id,
        },
      };
      if (task.environmentalForm.moistureMappingAreas.contact) {
        postData.FIELDS[
          task.environmentalForm.moistureMappingAreas.moistureMappingAreasBitrixMapping.contactCode
        ] = task.contactId;
      }
      if (task.environmentalForm.moistureMappingAreas.dateTesed) {
        postData.FIELDS[
          task.environmentalForm.moistureMappingAreas.moistureMappingAreasBitrixMapping.dateTesedCode
        ] = task.environmentalForm.moistureMappingAreas.dateTesed.toISOString();
      }
      if (task.environmentalForm.moistureMappingAreas.inspectionType) {
        postData.FIELDS[
          task.environmentalForm.moistureMappingAreas.moistureMappingAreasBitrixMapping.inspectionTypeCode
        ] = task.environmentalForm.moistureMappingAreas.inspectionType;
      }

      await Promise.all(
        task.environmentalForm.moistureMappingAreas.areamoistureMapping.map(
          async (area: MoistureMapping) => {
            if (area.area) {
              postData.FIELDS[area.moistureMappingBitrixMap.areaCode] =
                area.area;
            }

            if (area.roomTemp) {
              postData.FIELDS[area.moistureMappingBitrixMap.roomTempCode] =
                area.roomTemp;
            }
            if (area.relativeHumidity) {
              postData.FIELDS[
                area.moistureMappingBitrixMap.relativeHumidityCode
              ] = area.relativeHumidity;
            }
            if (area.dewPoint) {
              postData.FIELDS[area.moistureMappingBitrixMap.dewPointCode] =
                area.dewPoint;
            }
            if (area.standardTemperatureNorth) {
              postData.FIELDS[
                area.moistureMappingBitrixMap.standardTemperatureNorthCode
              ] = area.standardTemperatureNorth;
            }
            if (area.standardTemperatureWest) {
              postData.FIELDS[
                area.moistureMappingBitrixMap.standardTemperatureWestCode
              ] = area.standardTemperatureWest;
            }
            if (area.standardTemperatureSouth) {
              postData.FIELDS[
                area.moistureMappingBitrixMap.standardTemperatureSouthCode
              ] = area.standardTemperatureSouth;
            }
            if (area.standardTemperatureEast) {
              postData.FIELDS[
                area.moistureMappingBitrixMap.standardTemperatureEastCode
              ] = area.standardTemperatureEast;
            }
            if (area.standardTemperatureCeiling) {
              postData.FIELDS[
                area.moistureMappingBitrixMap.standardTemperatureCeilingCode
              ] = area.standardTemperatureCeiling;
            }
            if (area.standardTemperatureFloor) {
              postData.FIELDS[
                area.moistureMappingBitrixMap.standardTemperatureFloorCode
              ] = area.standardTemperatureFloor;
            }
          }
        )
      );

      var response = await this.bitrix
        .syncDamageAreaInspection(postData, 34)
        .toPromise();

      if (response && response.result > 0) {
        return response.result;
      } else return -1;
    } catch (error) {
      console.log(error);
      return -1;
    }
  }
  async sendDamageInspection(
    task: InspectionTask,
    type: string,
    list: number,
    name: string
  ): Promise<number> {
    try {
      let postData = {
        //ID: "126",
        IBLOCK_ID: list,
        IBLOCK_TYPE_ID: "lists",
        ELEMENT_CODE:
          list + "-" + task.id + "-" + (Math.random() * 100).toString(),
        FIELDS: {
          NAME: name,
        },
      };
      var damageInspectionList = [];

      switch (type) {
        case DamageAreaType.Mold:
          if (
            task.environmentalForm.moldAreas.areasInspection.find(
              (x: DamageInspection) =>
                x.areaPictures.images.length > 0 &&
                !x.areaPictures.syncInfo.isSync
            )
          ) {
            return -1;
          }
          damageInspectionList =
            task.environmentalForm.moldAreas.areasInspection;
          postData.FIELDS[
            task.environmentalForm.moldAreas.damageAreasBitrixMapping.contactIdCode
          ] = task.contactId;
          postData.FIELDS[
            task.environmentalForm.moldAreas.damageAreasBitrixMapping.startDateCode
          ] = task.environmentalForm.startDate.toISOString();
          postData.FIELDS[
            task.environmentalForm.moldAreas.damageAreasBitrixMapping.dealIdCode
          ] = task.id;
          postData.FIELDS[
            task.environmentalForm.moldAreas.damageAreasBitrixMapping.inspectionType
          ] = task.environmentalForm.moldAreas.moldInspectionType;
          break;
        case DamageAreaType.Bacteria:
          if (
            task.environmentalForm.bacteriasAreas.areasInspection.find(
              (x: DamageInspection) =>
                x.areaPictures.images.length > 0 &&
                !x.areaPictures.syncInfo.isSync
            )
          ) {
            return -1;
          }
          damageInspectionList =
            task.environmentalForm.bacteriasAreas.areasInspection;
          postData.FIELDS[
            task.environmentalForm.bacteriasAreas.damageAreasBitrixMapping.contactIdCode
          ] = task.contactId;
          postData.FIELDS[
            task.environmentalForm.bacteriasAreas.damageAreasBitrixMapping.startDateCode
          ] = task.environmentalForm.startDate.toISOString();
          postData.FIELDS[
            task.environmentalForm.bacteriasAreas.damageAreasBitrixMapping.dealIdCode
          ] = task.id;
          postData.FIELDS[
            task.environmentalForm.bacteriasAreas.damageAreasBitrixMapping.inspectionType
          ] = task.environmentalForm.bacteriasAreas.moldInspectionType;
          break;
        case DamageAreaType.Soot:
          if (
            task.environmentalForm.sootAreas.areasInspection.find(
              (x: DamageInspection) =>
                x.areaPictures.images.length > 0 &&
                !x.areaPictures.syncInfo.isSync
            )
          ) {
            return -1;
          }
          damageInspectionList =
            task.environmentalForm.sootAreas.areasInspection;
          postData.FIELDS[
            task.environmentalForm.sootAreas.damageAreasBitrixMapping.contactIdCode
          ] = task.contactId;
          postData.FIELDS[
            task.environmentalForm.sootAreas.damageAreasBitrixMapping.startDateCode
          ] = task.environmentalForm.startDate.toISOString();
          postData.FIELDS[
            task.environmentalForm.sootAreas.damageAreasBitrixMapping.dealIdCode
          ] = task.id;
          postData.FIELDS[
            task.environmentalForm.sootAreas.damageAreasBitrixMapping.inspectionType
          ] = task.environmentalForm.sootAreas.moldInspectionType;
          break;
        default:
          break;
      }
      await Promise.all(
        damageInspectionList.map(async (area: DamageInspection) => {
          if (area.areaPictures.imagesCodesSync.length > 0) {
            postData.FIELDS[
              area.damageInspectionBitrixMapping.areaPicturesCode
            ] = area.areaPictures.imagesCodesSync;
          }

          if (area.areaName) {
            postData.FIELDS[area.damageInspectionBitrixMapping.areaNameCode] =
              area.areaName;
          }
          if (area.areaRH) {
            postData.FIELDS[area.damageInspectionBitrixMapping.areaRHCode] =
              area.areaRH;
          }

          if (area.areaCondition.length > 0) {
            postData.FIELDS[area.damageInspectionBitrixMapping.conditionCode] =
              area.areaCondition;
          }

          if (area.areaNotes) {
            postData.FIELDS[area.damageInspectionBitrixMapping.areaNotesCode] =
              area.areaNotes;
          }
          if (area.removeCeiling) {
            postData.FIELDS[
              area.damageInspectionBitrixMapping.removeCeilingCode
            ] = area.removeCeiling;
          }
          if (area.ceilingNotes) {
            postData.FIELDS[
              area.damageInspectionBitrixMapping.ceilingNotesCode
            ] = area.ceilingNotes;
          }
          if (area.removeDrywall) {
            postData.FIELDS[
              area.damageInspectionBitrixMapping.removeDrywallCode
            ] = area.removeDrywall;
          }
          if (area.drywallNotes) {
            postData.FIELDS[
              area.damageInspectionBitrixMapping.drywallNotesCode
            ] = area.drywallNotes;
          }
          if (area.removeBaseboards) {
            postData.FIELDS[
              area.damageInspectionBitrixMapping.removeBaseboardsCode
            ] = area.removeBaseboards;
          }
          if (area.baseboardsNotes) {
            postData.FIELDS[
              area.damageInspectionBitrixMapping.baseboardsNotesCode
            ] = area.baseboardsNotes;
          }
          if (area.removeFlooring) {
            postData.FIELDS[
              area.damageInspectionBitrixMapping.removeFlooringCode
            ] = area.removeFlooring;
          }
          if (area.flooringNotes) {
            postData.FIELDS[
              area.damageInspectionBitrixMapping.flooringNotesCode
            ] = area.flooringNotes;
          }
          if (area.decontamination) {
            postData.FIELDS[
              area.damageInspectionBitrixMapping.decontaminationCode
            ] = area.decontamination;
          }
          if (area.furnitureOption) {
            postData.FIELDS[
              area.damageInspectionBitrixMapping.furnitureOptionCode
            ] = area.furnitureOption;
          }
          if (area.beddingsOption) {
            postData.FIELDS[
              area.damageInspectionBitrixMapping.beddingsOptionCode
            ] = area.beddingsOption;
          }
          if (area.observations) {
            postData.FIELDS[
              area.damageInspectionBitrixMapping.observationsCode
            ] = area.observations;
          }
          if (area.samples) {
            area.samples.forEach((element) => {
              postData.FIELDS[element.sampleBitrixMapping.sampleTypeCode] =
                element.type;
              postData.FIELDS[element.sampleBitrixMapping.labResultCode] =
                element.labResult;
              if (type == DamageAreaType.Mold) {
                postData.FIELDS[element.sampleBitrixMapping.volumeCode] =
                  element.volume;
                postData.FIELDS[
                  element.sampleBitrixMapping.cassetteNumberCode
                ] = element.cassetteNumber;
                postData.FIELDS[element.sampleBitrixMapping.toxicMoldCode] =
                  element.toxicMold;
              }
            });
          }
          if (area.recomendations) {
            postData.FIELDS[
              area.damageInspectionBitrixMapping.recomendationsCode
            ] = area.recomendations;
          }
        })
      );

      var response = await this.bitrix
        .syncDamageAreaInspection(postData, list)
        .toPromise();

      if (response && response.result > 0) {
        return response.result;
      } else return -1;
    } catch (error) {
      console.log(error);
      return -1;
    }
  }
}
