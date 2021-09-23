import { Injectable } from "@angular/core";
import { async } from "@angular/core/testing";
import { ToastController } from "@ionic/angular";
import { promise } from "protractor";
import { ObjectUnsubscribedError, Observable, of, Subject } from "rxjs";
import { observeOn } from "rxjs/operators";
import { BitrixPicture, BitrixPictureList } from "../models/bitrix-picture";
import { Company } from "../models/company";
import { Contact } from "../models/contact";
import { DamageInspection } from "../models/damage-inspection";
import {
  BitrixListsITest,
  bitrixMappingComprehensive,
  bitrixMappingEnvironmental,
  DamageAreaType,
  ENContactSegments,
  ENDealMapping,
  EnumEnterprise,
  InspectionStatus,
  InspectionType,
  ITestDealMapping,
  ReportStatusDeal,
} from "../models/enums";
import { Asbesto } from "../models/environmental-form/asbesto";
import { AsbestoAreas } from "../models/environmental-form/asbesto-areas";
import { DamageAreas } from "../models/environmental-form/damage-areas";
import { Lead } from "../models/environmental-form/lead";
import { LeadAreas } from "../models/environmental-form/lead-areas";
import { MoistureMapping } from "../models/environmental-form/moisture-mapping";
import { MoistureMappingAreas } from "../models/environmental-form/moisture-mapping-areas";
import { BitrixFolder, InspectionTask } from "../models/inspection-task";
import { Scheduling } from "../models/scheduling";
import { SyncInfo } from "../models/sync-info";
import { User } from "../models/user";
import { AuthenticationService } from "./authentication.service";
import { BitrixItestService } from "./bitrix-itest.service";
import { InspectionsStorageService } from "./inspections-storage.service";
import { ItestDealService } from "./itest-deal.service";
import { SchedulingStorageService } from "./scheduling-storage.service";
const ItestImageMainFolder = 100;
const ENImageMainFolder = 75763;
@Injectable({
  providedIn: "root",
})
export class SyncInspectionService {
  constructor(
    private bitrix: BitrixItestService,
    private inspectionStorage: InspectionsStorageService,
    private schedulingStorageService: SchedulingStorageService,
    private toast: ToastController,
    private itestDealService: ItestDealService,
    private autenticateService: AuthenticationService
  ) {}

  private syncEvent = new Subject<any>();

  publishSomeData(data: any) {
    this.syncEvent.next(data);
  }

  getObservable(): Subject<any> {
    return this.syncEvent;
  }

  async syncSubfolder(task: InspectionTask): Promise<number> {
    try {
      var idFolder = ItestImageMainFolder;
      if (task.inspectionType == InspectionType.Comprehensive) {
        idFolder = ENImageMainFolder;
      }
      var d = new Date();
      var dateString =
        d.getFullYear().toString() +
        d.getMonth().toString() +
        d.getDay().toString() +
        d.getHours().toString() +
        d.getHours().toString() +
        d.getMinutes().toString() +
        d.getMilliseconds().toString();
      var postData = {
        id: idFolder,
        data: {
          NAME: `${task.id}-${task.title}-${dateString}`,
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
    if (
      folder.syncInfo.isSync &&
      pictures.images.find((x) => !x.isSync) != null
    ) {
      await Promise.all(
        pictures.images.map(async (item, index) => {
          if (!item.isSync) {
            if (!item.format || item.format == "") {
              item.format = "jpeg";
            }
            var postData = {
              id: folder.syncInfo.syncCode,

              data: {
                NAME: `${name}-${index + 1}-${Math.floor(
                  Math.random() * 1000
                )}.${item.format}`,
              },
              fileContent: item.base64Image
                .replace("data:image/png;base64,", "")
                .replace("data:image/jpeg;base64,", ""),
            };

            var response = await this.bitrix.addFile(postData);
            if (response?.result?.FILE_ID > 0) {
              pictures.images[index].isSync = true;
              pictures.images[index].syncList = false;
              pictures.images[index].syncCode =
                response.result.FILE_ID.toString();
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

  async syncENTaskImages(task: InspectionTask): Promise<InspectionTask> {
    await Promise.all(
      task.comprehesiveForm.areas
        .filter(
          (x) =>
            x.pictures.images.length > 0 &&
            x.pictures.images.find((y) => !y.isSync) != null
        )
        .map(async (item, index) => {
          task.comprehesiveForm.areas[index].pictures =
            await this.syncListImages(
              task.comprehesiveForm.areas[index].pictures,
              task.bitrixFolder,
              "AreaInsp-" + (index + 1)
            );
          //await this.inspectionStorage.update(task);

          return Promise.resolve(true);
        })
    );

    await Promise.all(
      task.comprehesiveForm.bathrooms
        .filter(
          (x) => x.pictures.images.length > 0 && !x.pictures.syncInfo.isSync
        )
        .map(async (item, index) => {
          task.comprehesiveForm.bathrooms[index].pictures =
            await this.syncListImages(
              task.comprehesiveForm.bathrooms[index].pictures,
              task.bitrixFolder,
              "Bathroom-Area" + (index + 1)
            );
          //await this.inspectionStorage.update(task);

          return Promise.resolve(true);
        })
    );

    task.comprehesiveForm.generalInfoInspection.pictureHouseNumbers =
      await this.syncListImages(
        task.comprehesiveForm.generalInfoInspection.pictureHouseNumbers,
        task.bitrixFolder,
        "General-HouseNumber"
      );
    //await this.inspectionStorage.update(task);
    task.comprehesiveForm.generalInfoInspection.picturesFrontHouse =
      await this.syncListImages(
        task.comprehesiveForm.generalInfoInspection.picturesFrontHouse,
        task.bitrixFolder,
        "General-FrontHouse"
      );
    //  await this.inspectionStorage.update(task);

    task.comprehesiveForm.kitchen.pictures = await this.syncListImages(
      task.comprehesiveForm.kitchen.pictures,
      task.bitrixFolder,
      "Kitchen"
    );
    // await this.inspectionStorage.update(task);

    task.comprehesiveForm.HVAC_AC.pictures = await this.syncListImages(
      task.comprehesiveForm.HVAC_AC.pictures,
      task.bitrixFolder,
      "HVAC_AC"
    );
    //await this.inspectionStorage.update(task);

    task.comprehesiveForm.utilityRoom.pictures = await this.syncListImages(
      task.comprehesiveForm.utilityRoom.pictures,
      task.bitrixFolder,
      "UtilityRoom"
    );
    //await this.inspectionStorage.update(task);

    task.comprehesiveForm.atic.pictures = await this.syncListImages(
      task.comprehesiveForm.atic.pictures,
      task.bitrixFolder,
      "Attic"
    );
    // await this.inspectionStorage.update(task);

    task.comprehesiveForm.enviromentalSection.MoldLocationPicture =
      await this.syncListImages(
        task.comprehesiveForm.enviromentalSection.MoldLocationPicture,
        task.bitrixFolder,
        "MoldLocation"
      );
    //await this.inspectionStorage.update(task);

    task.comprehesiveForm.exterior.pictures = await this.syncListImages(
      task.comprehesiveForm.exterior.pictures,
      task.bitrixFolder,
      "Exterior"
    );
    //await this.inspectionStorage.update(task);

    task.comprehesiveForm.insurance.picturesPolicy = await this.syncListImages(
      task.comprehesiveForm.insurance.picturesPolicy,
      task.bitrixFolder,
      "Policy"
    );
    await this.inspectionStorage.update(task);

    return task;
  }

  async syncTaskImages(task: InspectionTask): Promise<InspectionTask> {
    for (
      let index = 0;
      index < task.environmentalForm.moldAreas.areasInspection.length;
      index++
    ) {
      try {
        const item = task.environmentalForm.moldAreas.areasInspection[index];

        if (
          item.areaPictures.images.length > 0 &&
          item.areaPictures.images.find((y) => !y.isSync) != null
        ) {
          task.environmentalForm.moldAreas.areasInspection[index].areaPictures =
            await this.syncListImages(
              task.environmentalForm.moldAreas.areasInspection[index]
                .areaPictures,
              task.bitrixFolder,
              "MoldIns-Area" + (index + 1)
            );
        }
      } catch (error) {
        console.log(error);
      }
    }

    for (
      let index = 0;
      index < task.environmentalForm.bacteriasAreas.areasInspection.length;
      index++
    ) {
      try {
        const item =
          task.environmentalForm.bacteriasAreas.areasInspection[index];
        if (
          item.areaPictures.images.length > 0 &&
          item.areaPictures.images.find((y) => !y.isSync) != null
        ) {
          task.environmentalForm.bacteriasAreas.areasInspection[
            index
          ].areaPictures = await this.syncListImages(
            task.environmentalForm.bacteriasAreas.areasInspection[index]
              .areaPictures,
            task.bitrixFolder,
            "BactIns-Area" + (index + 1)
          );
        }
      } catch (error) {
        console.log(error);
      }
    }

    for (
      let index = 0;
      index <
      task.environmentalForm.moistureMappingAreas.areamoistureMapping.length;
      index++
    ) {
      try {
        const item =
          task.environmentalForm.moistureMappingAreas.areamoistureMapping[
            index
          ];

        if (
          item.areaPictures.images.length > 0 &&
          item.areaPictures.images.find((y) => !y.isSync) != null
        ) {
          task.environmentalForm.moistureMappingAreas.areamoistureMapping[
            index
          ].areaPictures = await this.syncListImages(
            task.environmentalForm.moistureMappingAreas.areamoistureMapping[
              index
            ].areaPictures,
            task.bitrixFolder,
            "Moist-Area" + (index + 1)
          );
        }
      } catch (error) {
        console.log(error);
      }
    }

    for (
      let index = 0;
      index < task.environmentalForm.asbestosAreas.asbestosAreas.length;
      index++
    ) {
      try {
        const item = task.environmentalForm.asbestosAreas.asbestosAreas[index];

        if (
          item.areaPictures.images.length > 0 &&
          item.areaPictures.images.find((y) => !y.isSync) != null
        ) {
          task.environmentalForm.asbestosAreas.asbestosAreas[
            index
          ].areaPictures = await this.syncListImages(
            task.environmentalForm.asbestosAreas.asbestosAreas[index]
              .areaPictures,
            task.bitrixFolder,
            "Asbe-Area" + (index + 1)
          );
        }
      } catch (error) {
        console.log(error);
      }
    }
    await this.inspectionStorage.update(task);

    for (
      let index = 0;
      index < task.environmentalForm.leadAreas.leadAreas.length;
      index++
    ) {
      try {
        const item = task.environmentalForm.leadAreas.leadAreas[index];

        if (
          item.areaPictures.images.length > 0 &&
          item.areaPictures.images.find((y) => !y.isSync) != null
        ) {
          task.environmentalForm.leadAreas.leadAreas[index].areaPictures =
            await this.syncListImages(
              task.environmentalForm.leadAreas.leadAreas[index].areaPictures,
              task.bitrixFolder,
              "Lead-Area" + (index + 1)
            );
        }
      } catch (error) {
        console.log(error);
      }
    }

    for (
      let index = 0;
      index < task.environmentalForm.sootAreas.areasInspection.length;
      index++
    ) {
      try {
        const item = task.environmentalForm.sootAreas.areasInspection[index];

        if (
          item.areaPictures.images.length > 0 &&
          item.areaPictures.images.find((y) => !y.isSync) != null
        ) {
          task.environmentalForm.sootAreas.areasInspection[index].areaPictures =
            await this.syncListImages(
              task.environmentalForm.sootAreas.areasInspection[index]
                .areaPictures,
              task.bitrixFolder,
              "Soot-Area" + (index + 1)
            );
        }
      } catch (error) {
        console.log(error);
      }
    }
    try {
      await this.inspectionStorage.update(task);
      task.environmentalForm.generalInfoInspection.pictureHouseNumbers =
        await this.syncListImages(
          task.environmentalForm.generalInfoInspection.pictureHouseNumbers,
          task.bitrixFolder,
          "General-HouseNumber"
        );
      //await this.inspectionStorage.update(task);
      task.environmentalForm.generalInfoInspection.picturesFrontHouse =
        await this.syncListImages(
          task.environmentalForm.generalInfoInspection.picturesFrontHouse,
          task.bitrixFolder,
          "General-FrontHouse"
        );
      //await this.inspectionStorage.update(task);

      task.iTestAgreements.signature = await this.syncListImages(
        task.iTestAgreements.signature,
        task.bitrixFolder,
        "ItestAgreementSignature"
      );

      //await this.inspectionStorage.update(task);
      task.expertNetworkAgreements.signature = await this.syncListImages(
        task.expertNetworkAgreements.signature,
        task.bitrixFolder,
        "ENAgreementSignature"
      );
    } catch (error) {
      console.log(error);
    }
    await this.inspectionStorage.update(task);

    return task;
  }

  async syncGeneralInformation(task: InspectionTask): Promise<number> {
    try {
      let postData = {
        id: task.id,
        fields: { STAGE_ID: "EXECUTING" },
      };
      switch (task.internalStatus) {
        case InspectionStatus.PendingSaved:
          postData.fields[ITestDealMapping.reportStatus] =
            ReportStatusDeal.Saved;
          break;

        case InspectionStatus.PendingSentLab:
          postData.fields[ITestDealMapping.reportStatus] =
            ReportStatusDeal.Labs;
          break;

        case InspectionStatus.PendingToComplete:
          postData.fields[ITestDealMapping.reportStatus] =
            ReportStatusDeal.Submitted;
          break;

        default:
          postData.fields[ITestDealMapping.reportStatus] =
            ReportStatusDeal.Saved;
          break;
      }

      if (task.environmentalForm.generalInfoInspection.propertyYear)
        postData.fields[ITestDealMapping.propertyYearCode] =
          task.environmentalForm.generalInfoInspection.propertyYear;
      if (task.environmentalForm.generalInfoInspection.propertyType)
        postData.fields[ITestDealMapping.propertyTypeCode] =
          task.environmentalForm.generalInfoInspection.propertyType;
      if (task.environmentalForm.generalInfoInspection.interiorTemperature)
        postData.fields[ITestDealMapping.interiorTemperatureCode] =
          task.environmentalForm.generalInfoInspection.interiorTemperature;
      if (task.environmentalForm.generalInfoInspection.exteriorRelativeHumidity)
        postData.fields[ITestDealMapping.exteriorRelativeHumidityCode] =
          task.environmentalForm.generalInfoInspection.exteriorRelativeHumidity;
      if (task.environmentalForm.generalInfoInspection.HVACSystemCondition)
        postData.fields[ITestDealMapping.HVACSystemConditionCode] =
          task.environmentalForm.generalInfoInspection.HVACSystemCondition;
      if (task.environmentalForm.generalInfoInspection.ductsCondition)
        postData.fields[ITestDealMapping.ductsConditionCode] =
          task.environmentalForm.generalInfoInspection.ductsCondition;
      if (task.environmentalForm.generalInfoInspection.atticCondition)
        postData.fields[ITestDealMapping.atticConditionCode] =
          task.environmentalForm.generalInfoInspection.atticCondition;

      if (task.environmentalForm.generalInfoInspection.typeOfLossDesc) {
        postData.fields[ITestDealMapping.typesOfLoss] =
          task.environmentalForm.generalInfoInspection.typeOfLossDesc;
      }
      if (task.environmentalForm.generalInfoInspection.affectedArea) {
        postData.fields[ITestDealMapping.affectedArea] =
          task.environmentalForm.generalInfoInspection.affectedArea;
      }

      if (
        task.environmentalForm.generalInfoInspection.picturesFrontHouse.images
          .length > 0
      ) {
        var x =
          task.environmentalForm.generalInfoInspection.picturesFrontHouse.images.map(
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
        postData.fields[ITestDealMapping.picturesFrontHouseCode] = x;
      }

      if (
        task.environmentalForm.generalInfoInspection.pictureHouseNumbers.images
          .length > 0
      ) {
        postData.fields[ITestDealMapping.pictureHouseNumbersCode] = {
          fileData: [
            `HouseNumber-${task.id}-${Math.floor(Math.random() * 1000)}.png`,
            task.environmentalForm.generalInfoInspection.pictureHouseNumbers.images[0].base64Image.replace(
              "data:image/png;base64,",
              ""
            ),
          ],
        };
      }
      if (task.iTestAgreements.signature.images.length > 0) {
        postData.fields[ITestDealMapping.agreementSignedYesNoCode] =
          task.environmentalForm.generalInfoInspection.agreementSignedYesNo;

        var itestSignature = task.iTestAgreements.signature.images.map(
          (x, index) => {
            return {
              fileData: [
                `ITestSig-${x.name}-${task.id}-${Math.floor(
                  Math.random() * 1000
                )}.png`,
                x.base64Image.replace("data:image/png;base64,", ""),
              ],
            };
          }
        );

        var expertNSignature =
          task.expertNetworkAgreements.signature.images.map((x, index) => {
            return {
              fileData: [
                `ENSignature-${x.name}-${task.id}-${Math.floor(
                  Math.random() * 1000
                )}.png`,
                x.base64Image.replace("data:image/png;base64,", ""),
              ],
            };
          });

        var signatures = itestSignature.concat(expertNSignature);
        postData.fields[ITestDealMapping.signature] = signatures;
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

  async syncContact(
    contact: Contact,
    enterprise: string,
    type: number = null
  ): Promise<Contact> {
    try {
      var postData = {
        FIELDS: {
          NAME: contact.firstName,
          SECOND_NAME: "",
          LAST_NAME: contact.lastName,
          PHONE: [{ VALUE: contact.phone }],
          EMAIL: [{ VALUE: contact.email }],
        },
      };

      if (enterprise === EnumEnterprise.expertNetworks) {
        postData.FIELDS[ENDealMapping.contactSegments] = [type];
      }
      var response = await this.bitrix.createContact(postData, enterprise);
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

  async syncCompany(company: Company, enterprise: string): Promise<Company> {
    try {
      var postData = {
        fields: {
          TITLE: company.title,
          COMPANY_TYPE: "CUSTOMER",
          COMMENTS: "Created by Inspection MobileApp",
          CURRENCY_ID: "USD",
          IS_MY_COMPANY: "N",
          PHONE: [{ VALUE: company.phone }],
          EMAIL: [{ VALUE: company.email }],
        },
      };
      var response = await this.bitrix.createCompany(postData, enterprise);
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

  async syncAllPending(): Promise<boolean> {
    var user = await this.autenticateService.getUser();
    var schedulingList = await this.schedulingStorageService.getPendingToSync(
      user
    );
    await Promise.all(
      (
        await schedulingList
      ).map(async (x) => {
        (await this.syncSchedulingInspection(x, user)).subscribe(async (y) => {
          if (y) {
          } else {
            var message = this.toast.create({
              message: "Sync failed, please try again later.",
              color: "warning",
              duration: 2000,
            });
            (await message).present();
          }
        });
      })
    );

    var inspectionList = await this.inspectionStorage.getPendingToSync(user);
    for (let index = 0; index < inspectionList.length; index++) {
      const x = inspectionList[index];
      var y = await this.syncTask(x);
      if (y) {
      } else {
        var message = this.toast.create({
          message: "Sync failed for deal " + x.id + ", please try again later.",
          color: "warning",
          duration: 2000,
        });
        (await message).present();
      }
    }

    // await Promise.all(
    //   (
    //     await inspectionList
    //   ).map(async (x) => {

    //     }
    //   })
    // );
    if (schedulingList.length == 0 && inspectionList.length == 0) {
      var message = this.toast.create({
        message: "There is no pending items to sync.",
        color: "primary",
        duration: 2000,
      });
      (await message).present();
    }
    return true;
  }

  pad(number, length) {
    var str = "" + number;
    while (str.length < length) {
      str = "0" + str;
    }
    return str;
  }

  async getBitrixDateTime(date) {
    date = new Date(date);
    var offset: any = date.getTimezoneOffset();
    offset =
      (offset < 0 ? "+" : "-") + // Note the reversed sign!
      this.pad(parseInt(Math.abs(offset / 60).toString()), 2) +
      ":" +
      this.pad(Math.abs(offset % 60), 2);

    var paddatepart = function (part) {
      return part >= 10 ? part.toString() : "0" + part.toString();
    };

    var dateStr =
      date.getFullYear() +
      "-" +
      paddatepart(1 + date.getMonth()) +
      "-" +
      paddatepart(date.getDate()) +
      "T" +
      paddatepart(date.getHours()) +
      ":" +
      paddatepart(date.getMinutes()) +
      ":" +
      paddatepart(date.getSeconds()) +
      "-06:00";
    return dateStr;
  }

  async getBitrixDateTime1(date) {
    date = new Date(date);
    var offset: any = date.getTimezoneOffset();
    offset =
      (offset < 0 ? "+" : "-") + // Note the reversed sign!
      this.pad(parseInt(Math.abs(offset / 60).toString()), 2) +
      ":" +
      this.pad(Math.abs(offset % 60), 2);

    var paddatepart = function (part) {
      return part >= 10 ? part.toString() : "0" + part.toString();
    };

    var dateStr =
      date.getFullYear() +
      "-" +
      paddatepart(1 + date.getMonth()) +
      "-" +
      paddatepart(date.getDate()) +
      "T" +
      paddatepart(date.getHours()) +
      ":" +
      paddatepart(date.getMinutes()) +
      ":" +
      paddatepart(date.getSeconds()) +
      offset;
    return dateStr;
  }

  async syncSchedulingInspection(
    scheduling: Scheduling,
    user: User
  ): Promise<Observable<boolean>> {
    try {
      if (
        !scheduling.contact.syncInfo.isSync ||
        !scheduling.contact.syncInfo.syncCode
      ) {
        scheduling.contact = await this.syncContact(
          scheduling.contact,
          scheduling.serviceType,
          ENContactSegments.Client
        );

        if (!scheduling.contact.syncInfo.isSync) {
          return of(false);
        }
        await this.schedulingStorageService.update(scheduling);
      }
      scheduling.scheduleDateString = await this.getBitrixDateTime(
        scheduling.scheduleDateTime
      );
      if (
        scheduling.insuranceCompanyContact &&
        (!scheduling.insuranceCompanyContact.syncInfo.isSync ||
          !scheduling.insuranceCompanyContact.syncInfo.syncCode)
      ) {
        scheduling.insuranceCompanyContact = await this.syncContact(
          scheduling.insuranceCompanyContact,
          scheduling.serviceType,
          ENContactSegments.Public_Adjuster
        );

        if (!scheduling.insuranceCompanyContact.syncInfo.isSync) {
          return of(false);
        }
        await this.schedulingStorageService.update(scheduling);
      }

      if (
        scheduling.referalPartner &&
        (!scheduling.referalPartner.syncInfo.isSync ||
          !scheduling.referalPartner.syncInfo.syncCode)
      ) {
        scheduling.referalPartner = await this.syncContact(
          scheduling.referalPartner,
          scheduling.serviceType,
          ENContactSegments.Referral_Partner
        );
        if (!scheduling.referalPartner.syncInfo.isSync) {
          return of(false);
        }
        await this.schedulingStorageService.update(scheduling);
      }
      if (
        scheduling.referalPartnerCompany &&
        !scheduling.referalPartnerCompany.syncInfo.isSync
      ) {
        scheduling.referalPartnerCompany = await this.syncCompany(
          scheduling.referalPartnerCompany,
          scheduling.serviceType
        );
        if (!scheduling.referalPartnerCompany.syncInfo.isSync) {
          return of(false);
        }
        await this.schedulingStorageService.update(scheduling);
      }

      if (
        scheduling.insuranceCompany &&
        !scheduling.insuranceCompany.syncInfo.isSync
      ) {
        scheduling.insuranceCompany = await this.syncCompany(
          scheduling.insuranceCompany,
          scheduling.serviceType
        );
        if (!scheduling.insuranceCompany.syncInfo.isSync) {
          return of(false);
        }
        await this.schedulingStorageService.update(scheduling);
      }

      var insuranceCompany: string[] = [];
      if (scheduling.insuranceCompanyContact) {
        insuranceCompany.push(
          "C_" + scheduling.insuranceCompanyContact.idContact
        );
      }
      if (scheduling.insuranceCompany) {
        insuranceCompany.push("CO_" + scheduling.insuranceCompany.id);
      }

      var referalContact: string[] = [];
      if (scheduling.referalPartner) {
        referalContact.push("C_" + scheduling.referalPartner.idContact);
      }
      if (scheduling.referalPartnerCompany) {
        referalContact.push("CO_" + scheduling.referalPartnerCompany.id);
      }

      let postData = {
        fields: {
          TITLE:
            "Form " +
            scheduling.contact.firstName +
            " " +
            scheduling.contact.lastName +
            " - EnApp",
          TYPE_ID: "",
          STAGE_ID:
            scheduling.serviceType == EnumEnterprise.itest
              ? "PREPAYMENT_INVOICE"
              : "NEW",
          COMPANY_ID: "",
          CONTACT_ID: scheduling.contact.idContact,
          OPENED: "N",
          CLOSED: "N",
          ASSIGNED_BY_ID: scheduling.inspectorUserId,
          CREATED_BY_ID: scheduling.inspectorUserId,
          COMMENTS: "Created with Scheduling form within EN Mobile APP.",

          PROBABILITY: null,
          CURRENCY_ID: "USD",
          OPPORTUNITY: 0,
          BEGINDATE: "",
          CLOSEDATE: "",
        },
      };

      if (scheduling.serviceType == EnumEnterprise.itest) {
        postData.fields[ITestDealMapping.instructions] = scheduling.notes; //UF_CRM_1612683023
        postData.fields[ITestDealMapping.dealDateTime] =
          scheduling.scheduleDateString; //this.date2str(scheduling.scheduleDateTime),  //UF_CRM_1612683055
        postData.fields[ITestDealMapping.serviceAddress] =
          scheduling.serviceAddress; //UF_CRM_1606466289
        postData.fields[ITestDealMapping.inspector] =
          scheduling.inspectorUserId; //UF_CRM_1612682994
        postData.fields[ITestDealMapping.user] = user.userId; //UF_CRM_1612686317
        postData.fields[ITestDealMapping.insuranceCompany] = insuranceCompany; //UF_CRM_1612691342
        postData.fields[ITestDealMapping.inspectionTypes] =
          scheduling.inspectionTypes; //UF_CRM_1612433280
        postData.fields[ITestDealMapping.referenceContact] = referalContact; //UF_CRM_1612691326
      } else {
        //postData.fields[ENDealMapping.segments] = [4315];
        postData.fields[ENDealMapping.paymentType] =
          ENDealMapping.paymentType_pendingVal;
        postData.fields[ENDealMapping.instructions] = scheduling.notes;
        postData.fields[ENDealMapping.dealDateTime] =
          scheduling.scheduleDateString;
        postData.fields[ENDealMapping.serviceAddress] =
          scheduling.serviceAddress;
        postData.fields[ENDealMapping.inspector] = scheduling.inspectorUserId;
        postData.fields[ENDealMapping.user] = user.userId; //scheduler
        postData.fields[ENDealMapping.insuranceCompany] = insuranceCompany;
        postData.fields[ENDealMapping.referenceContact] =
          scheduling.serviceType == EnumEnterprise.itest
            ? referalContact
            : scheduling.referalPartner?.idContact;
      }

      var response = await this.bitrix.createDeal(
        postData,
        scheduling.serviceType
      );

      if (response && response.result > 0) {
        scheduling.syncInfo.isSync = true;
        scheduling.syncInfo.syncCode = response.result;
        scheduling.internalStatus = InspectionStatus.Completed;
        await this.schedulingStorageService.update(scheduling);
        await this.itestDealService.getExternal(user);
        await this.itestDealService.refreshFieldsFromServer(user);
        return of(true);
      } else return of(false);
    } catch (error) {
      console.log(error);
      return of(false);
    }
  }
  preprareImages(
    imagesList: BitrixPictureList,
    taskId: number,
    fieldName: string
  ) {
    var image = imagesList.images.map((s, imageIndex) => {
      return {
        fileData: [
          `${fieldName}-${imageIndex}-${taskId}-${Math.floor(
            Math.random() * 1000
          )}.png`,
          s.base64Image.replace("data:image/png;base64,", ""),
        ],
      };
    });
    return image;
  }

  async syncENTask(task: InspectionTask): Promise<boolean> {
    try {
      if (!task.bitrixFolder.syncInfo.isSync) {
        var result = await this.syncSubfolder(task);
        task.bitrixFolder.syncInfo.isSync = result > 0;
        task.bitrixFolder.syncInfo.syncCode = result.toString();
        await this.inspectionStorage.update(task);
      }

      task = await this.syncENTaskImages(task);

      let postData = {
        id: task.id,
        fields: { STAGE_ID: "1" },
      };

      if (task.comprehesiveForm.generalInfoInspection.propertyYear)
        postData.fields[ENDealMapping.propertyYearCode] =
          task.comprehesiveForm.generalInfoInspection.propertyYear;
      if (task.comprehesiveForm.generalInfoInspection.propertyType)
        postData.fields[ENDealMapping.propertyTypeCode] =
          task.comprehesiveForm.generalInfoInspection.propertyType;

      if (
        task.comprehesiveForm.generalInfoInspection.picturesFrontHouse.images
          .length > 0
      ) {
        var x = await this.preprareImages(
          task.comprehesiveForm.generalInfoInspection.picturesFrontHouse,
          task.id,
          "FrontHouse"
        );
        postData.fields[ENDealMapping.picturesFrontHouseCode] = x;
      }

      if (
        task.comprehesiveForm.generalInfoInspection.pictureHouseNumbers.images
          .length > 0
      ) {
        var x = await this.preprareImages(
          task.comprehesiveForm.generalInfoInspection.pictureHouseNumbers,
          task.id,
          "HouseNumber"
        );
        postData.fields[ENDealMapping.pictureHouseNumbersCode] = x;
      }

      var list = entries(bitrixMappingComprehensive.Area);
      task.comprehesiveForm.areas.map((x, index: number) => {
        //Object.entries(x.areaBitrixMapping)
        list.map((y) => {
          var item = x[y[0].replace("Code", "")];
          if (item) {
            if (item.images) {
              var image = item.images.map((s, imageIndex) => {
                return {
                  fileData: [
                    `Area${index + 1}-${imageIndex}-${task.id}-${Math.floor(
                      Math.random() * 1000
                    )}.png`,
                    s.base64Image.replace("data:image/png;base64,", ""),
                  ],
                };
              });
              if (image.length > 0) {
                postData.fields[y[1][index]] = image;
              }
            } else {
              postData.fields[y[1][index]] = item;
            }
          }
        });
      });

      list = entries(bitrixMappingComprehensive.Bathrooms);
      task.comprehesiveForm.bathrooms.map((x, index: number) => {
        list.map((y) => {
          var item = x[y[0].replace("Code", "")];
          if (item) {
            if (item.images) {
              var image = item.images.map((s, imageIndex) => {
                return {
                  fileData: [
                    `Bathroom-${index + 1}-${imageIndex}-${
                      task.id
                    }-${Math.floor(Math.random() * 1000)}.png`,
                    s.base64Image.replace("data:image/png;base64,", ""),
                  ],
                };
              });
              if (image.length > 0) {
                postData.fields[y[1][index]] = image;
              }
            } else {
              postData.fields[y[1][index]] = item;
            }
          }
        });
      });

      list = entries(bitrixMappingComprehensive.Kitchen);
      list.map((y) => {
        var item = task.comprehesiveForm.kitchen[y[0].replace("Code", "")];
        if (item) {
          if (item.images) {
            var image = item.images.map((s, imageIndex) => {
              return {
                fileData: [
                  `Kitchen-${imageIndex}-${task.id}-${Math.floor(
                    Math.random() * 1000
                  )}.png`,
                  s.base64Image.replace("data:image/png;base64,", ""),
                ],
              };
            });
            if (image.length > 0) {
              postData.fields[y[1]] = image;
            }
          } else {
            postData.fields[y[1]] = item;
          }
        }
      });

      list = entries(bitrixMappingComprehensive.HVAC_AC);
      list.map((y) => {
        var item = task.comprehesiveForm.HVAC_AC[y[0].replace("Code", "")];
        if (item) {
          if (item.images) {
            var image = item.images.map((s, imageIndex) => {
              return {
                fileData: [
                  `HVAC_AC-${imageIndex}-${task.id}-${Math.floor(
                    Math.random() * 1000
                  )}.png`,
                  s.base64Image.replace("data:image/png;base64,", ""),
                ],
              };
            });
            if (image.length > 0) {
              postData.fields[y[1]] = image;
            }
          } else {
            postData.fields[y[1]] = item;
          }
        }
      });
      list = entries(bitrixMappingComprehensive.UtilityRoom);
      list.map((y) => {
        var item = task.comprehesiveForm.utilityRoom[y[0].replace("Code", "")];
        if (item) {
          if (item.images) {
            var image = item.images.map((s, imageIndex) => {
              return {
                fileData: [
                  `UtilityRoom-${imageIndex}-${task.id}-${Math.floor(
                    Math.random() * 1000
                  )}.png`,
                  s.base64Image.replace("data:image/png;base64,", ""),
                ],
              };
            });
            if (image.length > 0) {
              postData.fields[y[1]] = image;
            }
          } else {
            postData.fields[y[1]] = item;
          }
        }
      });

      list = entries(bitrixMappingComprehensive.Attic);
      list.map((y) => {
        var item = task.comprehesiveForm.atic[y[0].replace("Code", "")];
        if (item) {
          if (item.images) {
            var image = item.images.map((s, imageIndex) => {
              return {
                fileData: [
                  `Atic-${imageIndex}-${task.id}-${Math.floor(
                    Math.random() * 1000
                  )}.png`,
                  s.base64Image.replace("data:image/png;base64,", ""),
                ],
              };
            });
            if (image.length > 0) {
              postData.fields[y[1]] = image;
            }
          } else {
            postData.fields[y[1]] = item;
          }
        }
      });

      list = entries(bitrixMappingComprehensive.EnvironmentalSection);
      list.map((y) => {
        var item =
          task.comprehesiveForm.enviromentalSection[y[0].replace("Code", "")];
        if (item) {
          if (item.images) {
            var image = item.images.map((s, imageIndex) => {
              return {
                fileData: [
                  `environmental-${imageIndex}-${task.id}-${Math.floor(
                    Math.random() * 1000
                  )}.png`,
                  s.base64Image.replace("data:image/png;base64,", ""),
                ],
              };
            });
            if (image.length > 0) {
              postData.fields[y[1]] = image;
            }
          } else {
            postData.fields[y[1]] = item;
          }
        }
      });

      list = entries(bitrixMappingComprehensive.Exterior);
      list.map((y) => {
        var item = task.comprehesiveForm.exterior[y[0].replace("Code", "")];
        if (item) {
          if (item.images) {
            var image = item.images.map((s, imageIndex) => {
              return {
                fileData: [
                  `exterior-${imageIndex}-${task.id}-${Math.floor(
                    Math.random() * 1000
                  )}.png`,
                  s.base64Image.replace("data:image/png;base64,", ""),
                ],
              };
            });
            if (image.length > 0) {
              postData.fields[y[1]] = image;
            }
          } else {
            postData.fields[y[1]] = item;
          }
        }
      });

      list = entries(bitrixMappingComprehensive.Recomendations);
      list.map((y) => {
        var item =
          task.comprehesiveForm.recomendations[y[0].replace("Code", "")];
        if (item) {
          postData.fields[y[1]] = item;
        }
      });

      list = entries(bitrixMappingComprehensive.Insurance);
      list.map((y) => {
        var item = task.comprehesiveForm.insurance[y[0].replace("Code", "")];
        if (item) {
          if (item.images) {
            var image = item.images.map((s, imageIndex) => {
              return {
                fileData: [
                  `insurance-${imageIndex}-${task.id}-${Math.floor(
                    Math.random() * 1000
                  )}.png`,
                  s.base64Image.replace("data:image/png;base64,", ""),
                ],
              };
            });
            if (image.length > 0) {
              postData.fields[y[1]] = image;
            }
          } else {
            postData.fields[y[1]] = item;
          }
        }
      });

      list = entries(bitrixMappingComprehensive.Reminders);
      list.map((y) => {
        var item = task.comprehesiveForm.reminders[y[0].replace("Code", "")];
        if (item) {
          postData.fields[y[1]] = item;
        }
      });

      // entries(bitrixMappingComprehensive.Atic).map((y) => {
      //   var item = task.comprehesiveForm.atic[y[0].replace("Code", "")];
      //   if (item) {
      //     if (item.images) {
      //       var image = item.images.map((s, imageIndex) => {
      //         return {
      //           fileData: [
      //             `Attic-${imageIndex}-${task.id}-${Math.floor(
      //               Math.random() * 1000
      //             )}.png`,
      //             s.base64Image.replace("data:image/png;base64,", ""),
      //           ],
      //         };
      //       });
      //       if (image.length > 0) {
      //         postData.fields[y] = image;
      //       }
      //     } else {
      //       postData.fields[y[1]] = item;
      //     }
      //   }
      // });

      // entries(bitrixMappingComprehensive.UtilityRoom).map((y) => {
      //   var item = task.comprehesiveForm.utilityRoom[y[0].replace("Code", "")];
      //   if (item) {
      //     if (item.images) {
      //       var image = item.images.map((s, imageIndex) => {
      //         return {
      //           fileData: [
      //             `UtilityRoom-${imageIndex}-${task.id}-${Math.floor(
      //               Math.random() * 1000
      //             )}.png`,
      //             s.base64Image.replace("data:image/png;base64,", ""),
      //           ],
      //         };
      //       });
      //       if (image.length > 0) {
      //         postData.fields[y[1]] = image;
      //       }
      //     } else {
      //       postData.fields[y[1]] = item;
      //     }
      //   }
      // });

      // Object.entries(
      //   task.comprehesiveForm.HVAC_AC.generalConditionBitrixMapping
      // ).map((y) => {
      //   var item = task.comprehesiveForm.HVAC_AC[y[0].replace("Code", "")];
      //   if (item) {
      //     if (item.images) {
      //       var image = item.images.map((s, imageIndex) => {
      //         return {
      //           fileData: [
      //             `UtilityRoom-${imageIndex}-${task.id}-${Math.floor(
      //               Math.random() * 1000
      //             )}.png`,
      //             s.base64Image.replace("data:image/png;base64,", ""),
      //           ],
      //         };
      //       });
      //       if (image.length > 0) {
      //         postData.fields[y[1]] = image;
      //       }
      //     } else {
      //       postData.fields[y[1]] = item;
      //     }
      //   }
      // });

      // Object.entries(
      //   task.comprehesiveForm.enviromentalSection
      //     .environmentalSectionBitrixMapping
      // ).map((y) => {
      //   var item =
      //     task.comprehesiveForm.enviromentalSection[y[0].replace("Code", "")];
      //   if (item) {
      //     if (item.images) {
      //       var image = item.images.map((s, imageIndex) => {
      //         return {
      //           fileData: [
      //             `EnvironmentalSection-${imageIndex}-${task.id}-${Math.floor(
      //               Math.random() * 1000
      //             )}.png`,
      //             s.base64Image.replace("data:image/png;base64,", ""),
      //           ],
      //         };
      //       });
      //       if (image.length > 0) {
      //         postData.fields[y[1]] = image;
      //       }
      //     } else {
      //       postData.fields[y[1]] = item;
      //     }
      //   }
      // });

      // Object.entries(
      //   task.comprehesiveForm.exterior.generalConditionBitrixMapping
      // ).map((y) => {
      //   var item = task.comprehesiveForm.exterior[y[0].replace("Code", "")];
      //   if (item) {
      //     if (item.images) {
      //       var image = item.images.map((s, imageIndex) => {
      //         return {
      //           fileData: [
      //             `Exterior-${imageIndex}-${task.id}-${Math.floor(
      //               Math.random() * 1000
      //             )}.png`,
      //             s.base64Image.replace("data:image/png;base64,", ""),
      //           ],
      //         };
      //       });
      //       if (image.length > 0) {
      //         postData.fields[y[1]] = image;
      //       }
      //     } else {
      //       postData.fields[y[1]] = item;
      //     }
      //   }
      // });

      // Object.entries(
      //   task.comprehesiveForm.insurance.insuranceBitrixMapping
      // ).map((y) => {
      //   var item = task.comprehesiveForm.insurance[y[0].replace("Code", "")];
      //   if (item) {
      //     if (item.images) {
      //       var image = item.images.map((s, imageIndex) => {
      //         return {
      //           fileData: [
      //             `Insurance-${imageIndex}-${task.id}-${Math.floor(
      //               Math.random() * 1000
      //             )}.png`,
      //             s.base64Image.replace("data:image/png;base64,", ""),
      //           ],
      //         };
      //       });
      //       if (image.length > 0) {
      //         postData.fields[y[1]] = image;
      //       }
      //     } else {
      //       postData.fields[y[1]] = item;
      //     }
      //   }
      // });

      // Object.entries(
      //   task.comprehesiveForm.recomendations.recomendationsBitrixMapping
      // ).map((y) => {
      //   var item =
      //     task.comprehesiveForm.recomendations[y[0].replace("Code", "")];
      //   if (item) {
      //     if (item.images) {
      //       var image = item.images.map((s, imageIndex) => {
      //         return {
      //           fileData: [
      //             `Recomendations-${imageIndex}-${task.id}-${Math.floor(
      //               Math.random() * 1000
      //             )}.png`,
      //             s.base64Image.replace("data:image/png;base64,", ""),
      //           ],
      //         };
      //       });
      //       if (image.length > 0) {
      //         postData.fields[y[1]] = image;
      //       }
      //     } else {
      //       postData.fields[
      //         task.comprehesiveForm.recomendations.recomendationsBitrixMapping[
      //           y[0]
      //         ]
      //       ] = item;
      //     }
      //   }
      // });

      // Object.entries(
      //   task.comprehesiveForm.reminders.remindersBitrixMapping
      // ).map((y) => {
      //   var item = task.comprehesiveForm.reminders[y[0].replace("Code", "")];
      //   if (item) {
      //     if (item.images) {
      //       var image = item.images.map((s, imageIndex) => {
      //         return {
      //           fileData: [
      //             `Reminders-${imageIndex}-${task.id}-${Math.floor(
      //               Math.random() * 1000
      //             )}.png`,
      //             s.base64Image.replace("data:image/png;base64,", ""),
      //           ],
      //         };
      //       });
      //       if (image.length > 0) {
      //         postData.fields[y[1]] = image;
      //       }
      //     } else {
      //       postData.fields[
      //         task.comprehesiveForm.reminders.remindersBitrixMapping[y[0]]
      //       ] = item;
      //     }
      //   }
      // });

      var response = await this.bitrix.updateDeal(postData).toPromise();
      if (response && response.result > 0) {
        task.internalStatus = InspectionStatus.Completed;
      }
      await this.inspectionStorage.update(task);
      return true;
    } catch (error) {
      console.log(error);
      var message = this.toast.create({
        message: error,
        color: "danger",
        duration: 2000,
      });
      (await message).present();
      console.log(error);
      return false;
    }
  }

  async syncTask(task: InspectionTask): Promise<boolean> {
    try {
      task.startedSync = true;
      task.syncStartDate = new Date();
      if (task.inspectionType == InspectionType.Comprehensive) {
        return this.syncENTask(task);
      }
      if (!task.bitrixFolder.syncInfo.isSync) {
        var result = await this.syncSubfolder(task);
        task.bitrixFolder.syncInfo.isSync = result > 0;
        task.bitrixFolder.syncInfo.syncCode = result.toString();
        await this.inspectionStorage.update(task);
      }

      task = await this.syncTaskImages(task);
      if (
        !task.environmentalForm.generalInfoInspection.syncInfo.isSync ||
        task.environmentalForm.generalInfoInspection.syncInfo.updated
      ) {
        var result = await this.syncGeneralInformation(task);
        if (result > 0) {
          task.environmentalForm.generalInfoInspection.syncInfo.updated = false;
          task.environmentalForm.generalInfoInspection.syncInfo.isSync = true;
          task.environmentalForm.generalInfoInspection.syncInfo.syncCode =
            result.toString();
        }
      }

      if (
        !task.environmentalForm.moldAreas.syncInfo.isSync ||
        task.environmentalForm.moldAreas.syncInfo.updated
      ) {
        if (
          task.environmentalForm.moldAreas.areasInspection.find(
            (x) => x.areaName
          )
        ) {
          task.environmentalForm.moldAreas = await this.sendDamageInspection(
            task.environmentalForm.moldAreas,
            task,
            DamageAreaType.Mold,
            48,
            "Mold Inspection - " + task.title
          );
        } else {
          task.environmentalForm.moldAreas.syncInfo.isSync = true;
          task.environmentalForm.moldAreas.syncInfo.updated = false;
        }
        await this.inspectionStorage.update(task);
      }
      if (
        !task.environmentalForm.bacteriasAreas.syncInfo.isSync ||
        task.environmentalForm.bacteriasAreas.syncInfo.updated
      ) {
        if (
          task.environmentalForm.bacteriasAreas.areasInspection.find(
            (x) => x.areaName
          )
        ) {
          task.environmentalForm.bacteriasAreas =
            await this.sendDamageInspection(
              task.environmentalForm.bacteriasAreas,
              task,
              DamageAreaType.Bacteria,
              50,
              "Bacteria Inspection - " + task.title
            );
        } else {
          task.environmentalForm.bacteriasAreas.syncInfo.isSync = true;
          task.environmentalForm.bacteriasAreas.syncInfo.updated = false;
        }
        await this.inspectionStorage.update(task);
      }
      if (
        !task.environmentalForm.sootAreas.syncInfo.isSync ||
        task.environmentalForm.sootAreas.syncInfo.updated
      ) {
        if (
          task.environmentalForm.sootAreas.areasInspection.find(
            (x) => x.areaName
          )
        ) {
          task.environmentalForm.sootAreas = await this.sendDamageInspection(
            task.environmentalForm.sootAreas,
            task,
            DamageAreaType.Soot,
            52,
            "Soot Inspection - " + task.title
          );
        } else {
          task.environmentalForm.sootAreas.syncInfo.isSync = true;
          task.environmentalForm.sootAreas.syncInfo.updated = false;
        }
        await this.inspectionStorage.update(task);
      }

      if (
        !task.environmentalForm.moistureMappingAreas.syncInfo.isSync ||
        task.environmentalForm.moistureMappingAreas.syncInfo.updated
      ) {
        if (
          task.environmentalForm.moistureMappingAreas.areamoistureMapping.find(
            (x) => x.area
          )
        ) {
          task.environmentalForm.moistureMappingAreas =
            await this.sendMoistureMapping(task);
        } else {
          task.environmentalForm.moistureMappingAreas.syncInfo.isSync = true;
          task.environmentalForm.moistureMappingAreas.syncInfo.updated = false;
        }
        await this.inspectionStorage.update(task);
      }

      if (
        !task.environmentalForm.asbestosAreas.syncInfo.isSync ||
        task.environmentalForm.asbestosAreas.syncInfo.updated
      ) {
        if (
          task.environmentalForm.asbestosAreas.asbestosAreas.find(
            (x) => x.materialLocation
          )
        ) {
          task.environmentalForm.asbestosAreas = await this.sendAsbestos(task);
        } else {
          task.environmentalForm.asbestosAreas.syncInfo.isSync = true;
          task.environmentalForm.asbestosAreas.syncInfo.updated = false;
        }
        await this.inspectionStorage.update(task);
      }

      if (
        !task.environmentalForm.leadAreas.syncInfo.isSync ||
        task.environmentalForm.leadAreas.syncInfo.updated
      ) {
        if (task.environmentalForm.leadAreas.leadAreas.find((x) => x.sample)) {
          task.environmentalForm.leadAreas = await this.sendLead(task);

          task.environmentalForm.leadAreas.syncInfo.updated = false;
        } else {
          task.environmentalForm.leadAreas.syncInfo.isSync = true;
          task.environmentalForm.leadAreas.syncInfo.updated = false;
        }
        await this.inspectionStorage.update(task);
      }

      var log =
        " moldAreas: " +
        task.environmentalForm.moldAreas.syncInfo.isSync +
        ", bacteriasAreas: " +
        task.environmentalForm.bacteriasAreas.syncInfo.isSync +
        ", sootAreas: " +
        task.environmentalForm.sootAreas.syncInfo.isSync +
        ", generalInfoInspection: " +
        task.environmentalForm.generalInfoInspection.syncInfo.isSync +
        ", moistureMappingAreas: " +
        task.environmentalForm.moistureMappingAreas.syncInfo.isSync +
        ", leadAreas: " +
        task.environmentalForm.leadAreas.syncInfo.isSync +
        ", asbestosAreas: " +
        task.environmentalForm.asbestosAreas.syncInfo.isSync;

      console.log(log);

      if (
        task.environmentalForm.moldAreas.syncInfo.isSync &&
        task.environmentalForm.bacteriasAreas.syncInfo.isSync &&
        task.environmentalForm.sootAreas.syncInfo.isSync &&
        task.environmentalForm.generalInfoInspection.syncInfo.isSync &&
        task.environmentalForm.moistureMappingAreas.syncInfo.isSync &&
        task.environmentalForm.leadAreas.syncInfo.isSync &&
        task.environmentalForm.asbestosAreas.syncInfo.isSync
      ) {
        if (task.internalStatus == InspectionStatus.PendingSaved) {
          task.internalStatus = InspectionStatus.Saved;
          task.wasRejected = false;
        }
        if (task.internalStatus == InspectionStatus.PendingSentLab) {
          task.internalStatus = InspectionStatus.LabsSent;
          task.wasRejected = false;
        }
        if (task.internalStatus == InspectionStatus.PendingToComplete) {
          task.wasRejected = false;
          task.internalStatus = InspectionStatus.Completed;
        }

        await this.inspectionStorage.update(task);
        return true;
      } else {
        await this.inspectionStorage.update(task);
        return false;
      }
    } catch (error) {
      console.log(error);
      var message = this.toast.create({
        message: error,
        color: "danger",
        duration: 2000,
      });
      (await message).present();
      console.log(error);
      return false;
    }
  }

  async sendLead(task: InspectionTask): Promise<LeadAreas> {
    try {
      let postData = {
        //ID: "126",
        IBLOCK_ID: BitrixListsITest.Leads,
        IBLOCK_TYPE_ID: "lists",

        FIELDS: {
          NAME: `Lead - ${task.id} - ${task.title}`,
          PROPERTY_3526: task.id,
        },
      };

      var areas = task.environmentalForm.leadAreas;

      if (
        areas.leadAreas.find(
          (x) =>
            x.areaPictures.images.length > 0 &&
            x.areaPictures.images.find((i) => i.isSync == false)
        )
      ) {
        areas.syncInfo.isSync = false;
        areas.syncInfo.updated = false;
        return areas;
      }

      if (
        task.environmentalForm.leadAreas.syncInfo.syncCode &&
        parseInt(task.environmentalForm.leadAreas.syncInfo.syncCode) > 0
      ) {
        postData["ELEMENT_ID"] =
          task.environmentalForm.leadAreas.syncInfo.syncCode;
      } else {
        postData["ELEMENT_CODE"] =
          30 + "-" + task.id + "-" + (Math.random() * 100).toString();
      }

      postData.FIELDS[bitrixMappingEnvironmental.Lead.leadHeader.contactCode] =
        task.contactId;

      if (task.environmentalForm.leadAreas.inspectionDate) {
        postData.FIELDS[
          bitrixMappingEnvironmental.Lead.leadHeader.inspectionDateCode
        ] = await this.getBitrixDateTime1(
          task.environmentalForm.leadAreas.inspectionDate
        );
      }
      if (task.environmentalForm.leadAreas.inspectionType) {
        postData.FIELDS[
          bitrixMappingEnvironmental.Lead.leadHeader.inspectionTypeCode
        ] = task.environmentalForm.leadAreas.inspectionType;
      }
      var loadFirstImage = false;
      var bitrixFields = bitrixMappingEnvironmental.Lead;
      await Promise.all(
        task.environmentalForm.leadAreas.leadAreas.map(
          async (area: Lead, index: number) => {
            if (area.sample) {
              postData.FIELDS[bitrixFields.sampleCode[index]] = area.sample;
            }
            if (area.sampleOther) {
              postData.FIELDS[bitrixFields.sampleOtherCode[index]] =
                area.sampleOther;
            }

            if (
              area.areaPictures.images.length > 0 &&
              area.areaPictures.images.find((x) => !x.syncList)
            ) {
              var imageIndex = area.areaPictures.images.findIndex(
                (x) => !x.syncList
              );
              loadFirstImage = true;
              area.areaPictures.images[imageIndex].flag = 1;
              postData.FIELDS[bitrixFields.areaPicturesCode[index]] = [
                area.areaPictures.images[imageIndex].syncCode,
              ];
            }

            if (area.cardinalDirection) {
              postData.FIELDS[bitrixFields.cardinalDirectionCode[index]] =
                area.cardinalDirection;
            }
            if (area.dimensionCm2) {
              postData.FIELDS[bitrixFields.dimensionCm2Code[index]] =
                area.dimensionCm2;
            }
            if (area.material) {
              postData.FIELDS[bitrixFields.materialCode[index]] = area.material;
            }
            if (area.typeOfSample) {
              postData.FIELDS[bitrixFields.typeOfSampleCode[index]] =
                area.typeOfSample;
            }
            if (area.labResults) {
              postData.FIELDS[bitrixFields.labResultsCode[index]] =
                area.labResults;
            }
            if (area.observations) {
              postData.FIELDS[bitrixFields.observationsCode[index]] =
                area.observations;
            }
          }
        )
      );

      var response = await this.bitrix
        .syncDamageAreaInspection(postData, BitrixListsITest.Leads)
        .toPromise();

      if (response && response.result > 0) {
        var result = response.result;
        if (result > 0) {
          if (loadFirstImage) {
            await Promise.all(
              areas.leadAreas.map((x, index) => {
                var imageIndex = x.areaPictures.images.findIndex(
                  (x) => x.flag == 1
                );
                if (imageIndex >= 0) {
                  x.areaPictures.images[imageIndex].syncList = true;
                  x.areaPictures.images[imageIndex].flag = null;
                  delete postData.FIELDS[bitrixFields.areaPicturesCode[index]];
                }
              })
            );
          }

          areas.syncInfo.syncCode = areas.syncInfo.syncCode
            ? areas.syncInfo.syncCode
            : result.toString();
          postData["ELEMENT_ID"] = areas.syncInfo.syncCode;
          areas.syncInfo.isSync = result > 0;
          areas.syncInfo.updated = false;
          areas = await this.syncLeadAreaImages(
            areas,
            postData,
            BitrixListsITest.Leads,
            "Lead"
          );
          if (
            areas.leadAreas.find((area) =>
              area.areaPictures.images.find(
                (x) => x.syncList && x.syncList == false
              )
            )
          ) {
            areas.syncInfo.isSync = false;
            areas.syncInfo.updated = false;
          }
        } else {
          areas.syncInfo.isSync = false;
          areas.syncInfo.updated = false;
        }
      } else {
        areas.syncInfo.isSync = false;
        areas.syncInfo.updated = false;
      }

      return areas;
    } catch (error) {
      areas.syncInfo.isSync = false;
      areas.syncInfo.updated = false;
      console.log(error);
      return areas;
    }
  }

  async sendAsbestos(task: InspectionTask): Promise<AsbestoAreas> {
    try {
      let postData = {
        //ID: "126",
        IBLOCK_ID: BitrixListsITest.Asbestos,
        IBLOCK_TYPE_ID: "lists",

        FIELDS: {
          NAME: `Asbestos - ${task.id} - ${task.title}`,
          PROPERTY_3522: task.id,
        },
      };

      var areas = task.environmentalForm.asbestosAreas;

      if (
        areas.asbestosAreas.find(
          (x) =>
            x.areaPictures.images.length > 0 &&
            x.areaPictures.images.find((i) => i.isSync == false)
        )
      ) {
        areas.syncInfo.isSync = false;
        areas.syncInfo.updated = false;
        return areas;
      }

      if (
        task.environmentalForm.asbestosAreas.syncInfo.syncCode &&
        parseInt(task.environmentalForm.asbestosAreas.syncInfo.syncCode) > 0
      ) {
        postData["ELEMENT_ID"] =
          task.environmentalForm.asbestosAreas.syncInfo.syncCode;
      } else {
        postData["ELEMENT_CODE"] =
          32 + "-" + task.id + "-" + (Math.random() * 100).toString();
      }

      postData.FIELDS[
        bitrixMappingEnvironmental.Asbestos.asbestosHeader.contactCode
      ] = task.contactId;

      if (task.environmentalForm.asbestosAreas.inspectionDate) {
        //TODO fix date
        postData.FIELDS[
          bitrixMappingEnvironmental.Asbestos.asbestosHeader.inspectionDateCode
        ] = await this.getBitrixDateTime1(
          task.environmentalForm.asbestosAreas.inspectionDate
        );
      }
      if (task.environmentalForm.asbestosAreas.inspectionType) {
        postData.FIELDS[
          bitrixMappingEnvironmental.Asbestos.asbestosHeader.inspectionTypeCode
        ] = task.environmentalForm.asbestosAreas.inspectionType;
      }
      var loadFirstImage = false;
      await Promise.all(
        areas.asbestosAreas.map(async (area: Asbesto, index: number) => {
          if (area.materialLocation) {
            postData.FIELDS[
              bitrixMappingEnvironmental.Asbestos.materialLocationCode[index]
            ] = area.materialLocation;
          }

          if (
            area.areaPictures.images.length > 0 &&
            area.areaPictures.images.find((x) => !x.syncList)
          ) {
            var imageIndex = area.areaPictures.images.findIndex(
              (x) => !x.syncList
            );
            loadFirstImage = true;
            area.areaPictures.images[imageIndex].flag = 1;
            postData.FIELDS[
              bitrixMappingEnvironmental.Asbestos.areaPicturesCode[index]
            ] = [area.areaPictures.images[imageIndex].syncCode];
          }

          if (area.materialLocationOther) {
            postData.FIELDS[
              bitrixMappingEnvironmental.Asbestos.materialLocationOtherCode[
                index
              ]
            ] = area.materialLocationOther;
          }
          if (area.materialDescription) {
            postData.FIELDS[
              bitrixMappingEnvironmental.Asbestos.materialDescriptionCode[index]
            ] = area.materialDescription;
          }
          if (area.totalQuantity) {
            postData.FIELDS[
              bitrixMappingEnvironmental.Asbestos.totalQuantityCode[index]
            ] = area.totalQuantity;
          }
          if (area.F_NF) {
            postData.FIELDS[
              bitrixMappingEnvironmental.Asbestos.F_NFCode[index]
            ] = area.F_NF;
          }
          if (area.condition) {
            postData.FIELDS[
              bitrixMappingEnvironmental.Asbestos.areaConditionCode[index]
            ] = area.condition;
          }
          if (area.labResults) {
            postData.FIELDS[
              bitrixMappingEnvironmental.Asbestos.labResultsCode[index]
            ] = area.labResults;
          }
          if (area.observations) {
            postData.FIELDS[
              bitrixMappingEnvironmental.Asbestos.observationsCode[index]
            ] = area.observations;
          }
        })
      );

      var response = await this.bitrix
        .syncDamageAreaInspection(postData, BitrixListsITest.Asbestos)
        .toPromise();

      if (response && response.result > 0) {
        var result = response.result;
        if (result > 0) {
          if (loadFirstImage) {
            await Promise.all(
              areas.asbestosAreas.map((x, index) => {
                var imageIndex = x.areaPictures.images.findIndex(
                  (x) => x.flag == 1
                );
                if (imageIndex >= 0) {
                  x.areaPictures.images[imageIndex].syncList = true;
                  x.areaPictures.images[imageIndex].flag = null;
                  delete postData.FIELDS[
                    bitrixMappingEnvironmental.Asbestos.areaPicturesCode[index]
                  ];
                }
              })
            );
          }

          areas.syncInfo.syncCode = areas.syncInfo.syncCode
            ? areas.syncInfo.syncCode
            : result.toString();
          postData["ELEMENT_ID"] = areas.syncInfo.syncCode;
          areas.syncInfo.isSync = result > 0;
          areas.syncInfo.updated = false;
          areas = await this.syncAsbestosAreaImages(
            areas,
            postData,
            BitrixListsITest.Leads,
            "Asbestos"
          );
          if (
            areas.asbestosAreas.find((area) =>
              area.areaPictures.images.find((x) => x && x.syncList == false)
            )
          ) {
            areas.syncInfo.isSync = false;
            areas.syncInfo.updated = false;
          }
        } else {
          areas.syncInfo.isSync = false;
          areas.syncInfo.updated = false;
        }
      } else {
        areas.syncInfo.isSync = false;
        areas.syncInfo.updated = false;
      }

      return areas;
    } catch (error) {
      console.log(error);
      areas.syncInfo.isSync = false;
      areas.syncInfo.updated = false;
      return areas;
    }
  }

  async sendMoistureMapping(
    task: InspectionTask
  ): Promise<MoistureMappingAreas> {
    try {
      let postData = {
        //ID: "126",
        IBLOCK_ID: BitrixListsITest.Moisture,
        IBLOCK_TYPE_ID: "lists",
        FIELDS: {
          NAME: `Moisture Mapping - ${task.id} - ${task.title}`,
          PROPERTY_3528: task.id,
        },
      };

      var areas = task.environmentalForm.moistureMappingAreas;

      if (
        areas.areamoistureMapping.find(
          (x) =>
            x.areaPictures.images.length > 0 &&
            x.areaPictures.images.find((i) => i.isSync == false)
        )
      ) {
        areas.syncInfo.isSync = false;
        areas.syncInfo.updated = false;
        return areas;
      }

      if (
        task.environmentalForm.moistureMappingAreas.syncInfo.syncCode &&
        parseInt(
          task.environmentalForm.moistureMappingAreas.syncInfo.syncCode
        ) > 0
      ) {
        postData["ELEMENT_ID"] =
          task.environmentalForm.moistureMappingAreas.syncInfo.syncCode;
      } else {
        postData["ELEMENT_CODE"] =
          34 + "-" + task.id + "-" + (Math.random() * 100).toString();
      }
      if (task.contactId) {
        postData.FIELDS[
          bitrixMappingEnvironmental.Moisture.moistureHeader.contactCode
        ] = task.contactId;
      }
      if (task.environmentalForm.moistureMappingAreas.dateTesed) {
        //TODO: fix
        postData.FIELDS[
          bitrixMappingEnvironmental.Moisture.moistureHeader.dateTesedCode
        ] = await this.getBitrixDateTime1(
          task.environmentalForm.moistureMappingAreas.dateTesed
        );
      }
      if (task.environmentalForm.moistureMappingAreas.inspectionType) {
        postData.FIELDS[
          bitrixMappingEnvironmental.Moisture.moistureHeader.inspectionTypeCode
        ] = task.environmentalForm.moistureMappingAreas.inspectionType;
      }

      var loadFirstImage = false;

      await Promise.all(
        task.environmentalForm.moistureMappingAreas.areamoistureMapping.map(
          async (area: MoistureMapping, index) => {
            if (area.area) {
              postData.FIELDS[
                bitrixMappingEnvironmental.Moisture.areaCode[index]
              ] = area.area;
            }
            if (area.areaOther) {
              postData.FIELDS[
                bitrixMappingEnvironmental.Moisture.areaOtherCode[index]
              ] = area.areaOther;
            }

            if (area.roomTemp) {
              postData.FIELDS[
                bitrixMappingEnvironmental.Moisture.roomTempCode[index]
              ] = area.roomTemp;
            }
            if (area.relativeHumidity) {
              postData.FIELDS[
                bitrixMappingEnvironmental.Moisture.relativeHumidityCode[index]
              ] = area.relativeHumidity;
            }
            if (area.dewPoint) {
              postData.FIELDS[
                bitrixMappingEnvironmental.Moisture.dewPointCode[index]
              ] = area.dewPoint;
            }
            if (area.standardTemperatureNorth) {
              postData.FIELDS[
                bitrixMappingEnvironmental.Moisture.standardTemperatureNorthCode[
                  index
                ]
              ] = area.standardTemperatureNorth;
            }
            if (area.standardTemperatureWest) {
              postData.FIELDS[
                bitrixMappingEnvironmental.Moisture.standardTemperatureWestCode[
                  index
                ]
              ] = area.standardTemperatureWest;
            }
            if (area.standardTemperatureSouth) {
              postData.FIELDS[
                bitrixMappingEnvironmental.Moisture.standardTemperatureSouthCode[
                  index
                ]
              ] = area.standardTemperatureSouth;
            }
            if (area.standardTemperatureEast) {
              postData.FIELDS[
                bitrixMappingEnvironmental.Moisture.standardTemperatureEastCode[
                  index
                ]
              ] = area.standardTemperatureEast;
            }
            if (area.standardTemperatureCeiling) {
              postData.FIELDS[
                bitrixMappingEnvironmental.Moisture.standardTemperatureCeilingCode[
                  index
                ]
              ] = area.standardTemperatureCeiling;
            }
            if (
              area.areaPictures.images.length > 0 &&
              area.areaPictures.images.find((x) => !x.syncList)
            ) {
              var imageIndex = area.areaPictures.images.findIndex(
                (x) => !x.syncList
              );
              loadFirstImage = true;
              area.areaPictures.images[imageIndex].flag = 1;
              postData.FIELDS[
                bitrixMappingEnvironmental.Moisture.areaPicturesCode[index]
              ] = [area.areaPictures.images[imageIndex].syncCode];
            }
            if (area.standardTemperatureFloor) {
              postData.FIELDS[
                bitrixMappingEnvironmental.Moisture.standardTemperatureFloorCode[
                  index
                ]
              ] = area.standardTemperatureFloor;
            }
          }
        )
      );

      var response = await this.bitrix
        .syncDamageAreaInspection(postData, BitrixListsITest.Moisture)
        .toPromise();

      if (response && response.result > 0) {
        var result = response.result;
        if (result > 0) {
          if (loadFirstImage) {
            await Promise.all(
              areas.areamoistureMapping.map((x, index) => {
                var imageIndex = x.areaPictures.images.findIndex(
                  (x) => x.flag == 1
                );
                if (imageIndex >= 0) {
                  x.areaPictures.images[imageIndex].syncList = true;
                  x.areaPictures.images[imageIndex].flag = null;
                  delete postData.FIELDS[
                    bitrixMappingEnvironmental.Moisture.areaPicturesCode[index]
                  ];
                }
              })
            );
          }

          areas.syncInfo.syncCode = areas.syncInfo.syncCode
            ? areas.syncInfo.syncCode
            : result.toString();
          postData["ELEMENT_ID"] = areas.syncInfo.syncCode;
          areas.syncInfo.isSync = result > 0;
          areas.syncInfo.updated = false;
          areas = await this.syncMoistureAreaImages(
            areas,
            postData,
            BitrixListsITest.Moisture,
            "Moisture"
          );
          if (
            areas.areamoistureMapping.find((area) =>
              area.areaPictures.images.find((x) => x && x.syncList == false)
            )
          ) {
            areas.syncInfo.isSync = false;
            areas.syncInfo.updated = false;
          }
        } else {
          areas.syncInfo.isSync = false;
          areas.syncInfo.updated = false;
        }
      } else {
        areas.syncInfo.isSync = false;
        areas.syncInfo.updated = false;
      }

      return areas;
    } catch (error) {
      console.log(error);
      areas.syncInfo.isSync = false;
      areas.syncInfo.updated = false;
      return areas;
    }
  }

  async syncDamageAreaImages(
    areas: DamageAreas,
    postData: any,
    list: number,
    type: string
  ) {
    try {
      var bitrixFields = bitrixMappingEnvironmental[type];
      for (
        let index = 0;
        index < areas.areasInspection[0].areaPictures.maxPictures;
        index++
      ) {
        try {
          const cleanPostData = JSON.parse(JSON.stringify(postData));

          var send = false;
          await Promise.all(
            areas.areasInspection.map(async (area, indexArea) => {
              if (
                area.areaPictures.images[index] &&
                area.areaPictures.images[index].syncList == false &&
                area.areaPictures.images[index].syncCode
              ) {
                area.areaPictures.images[index].flag = 1;
                cleanPostData.FIELDS[bitrixFields.areaPicturesCode[indexArea]] =
                  [area.areaPictures.images[index].syncCode];
                send = true;
              }
            })
          );
          if (send) {
            var response = await this.bitrix
              .syncDamageAreaInspection(cleanPostData, list)
              .toPromise();

            if (response && response.result > 0) {
              await Promise.all(
                areas.areasInspection.map((x, index) => {
                  var imageIndex = x.areaPictures.images.findIndex(
                    (x) => x.flag == 1
                  );
                  if (imageIndex >= 0) {
                    x.areaPictures.images[imageIndex].syncList = true;
                    x.areaPictures.images[imageIndex].flag = null;
                  }
                })
              );
            }
          }
        } catch (error) {
          console.log(error);
        }
      }

      var response = await this.bitrix
        .syncDamageAreaInspection(postData, list)
        .toPromise();
      return areas;
    } catch (error) {
      console.log(error);

      return areas;
    }
  }

  async syncLeadAreaImages(
    areas: LeadAreas,
    postData: any,
    list: number,
    type: string
  ) {
    try {
      var bitrixFields = bitrixMappingEnvironmental[type];

      for (
        let index = 0;
        index < areas.leadAreas[0].areaPictures.maxPictures;
        index++
      ) {
        try {
          const cleanPostData = JSON.parse(JSON.stringify(postData));

          var send = false;
          await Promise.all(
            areas.leadAreas.map(async (area, indexArea) => {
              if (
                area.areaPictures.images[index] &&
                area.areaPictures.images[index].syncList == false &&
                area.areaPictures.images[index].syncCode
              ) {
                area.areaPictures.images[index].flag = 1;
                cleanPostData.FIELDS[bitrixFields.areaPicturesCode[indexArea]] =
                  [area.areaPictures.images[index].syncCode];
                send = true;
              }
            })
          );
          if (send) {
            var response = await this.bitrix
              .syncDamageAreaInspection(cleanPostData, list)
              .toPromise();

            if (response && response.result > 0) {
              await Promise.all(
                areas.leadAreas.map((x, index) => {
                  var imageIndex = x.areaPictures.images.findIndex(
                    (x) => x.flag == 1
                  );
                  if (imageIndex >= 0) {
                    x.areaPictures.images[imageIndex].syncList = true;
                    x.areaPictures.images[imageIndex].flag = null;
                  }
                })
              );
            }
          }
        } catch (error) {
          console.log(error);
        }
      }

      var response = await this.bitrix
        .syncDamageAreaInspection(postData, list)
        .toPromise();
      return areas;
    } catch (error) {
      console.log(error);

      return areas;
    }
  }

  async syncMoistureAreaImages(
    areas: MoistureMappingAreas,
    postData: any,
    list: number,
    type: string
  ) {
    try {
      var bitrixFields = bitrixMappingEnvironmental[type];

      for (
        let index = 0;
        index < areas.areamoistureMapping[0].areaPictures.maxPictures;
        index++
      ) {
        try {
          const cleanPostData = JSON.parse(JSON.stringify(postData));

          var send = false;
          await Promise.all(
            areas.areamoistureMapping.map(async (area, indexArea) => {
              if (
                area.areaPictures.images[index] &&
                area.areaPictures.images[index].syncList == false &&
                area.areaPictures.images[index].syncCode
              ) {
                area.areaPictures.images[index].flag = 1;
                cleanPostData.FIELDS[bitrixFields.areaPicturesCode[indexArea]] =
                  [area.areaPictures.images[index].syncCode];
                send = true;
              }
            })
          );
          if (send) {
            var response = await this.bitrix
              .syncDamageAreaInspection(cleanPostData, list)
              .toPromise();

            if (response && response.result > 0) {
              await Promise.all(
                areas.areamoistureMapping.map((x, index) => {
                  var imageIndex = x.areaPictures.images.findIndex(
                    (x) => x.flag == 1
                  );
                  if (imageIndex >= 0) {
                    x.areaPictures.images[imageIndex].syncList = true;
                    x.areaPictures.images[imageIndex].flag = null;
                  }
                })
              );
            }
          }
        } catch (error) {
          console.log(error);
        }
      }

      var response = await this.bitrix
        .syncDamageAreaInspection(postData, list)
        .toPromise();
      return areas;
    } catch (error) {
      console.log(error);
      return areas;
    }
  }

  async syncAsbestosAreaImages(
    areas: AsbestoAreas,
    postData: any,
    list: number,
    type: string
  ) {
    try {
      var bitrixFields = bitrixMappingEnvironmental[type];

      for (
        let index = 0;
        index < areas.asbestosAreas[0].areaPictures.maxPictures;
        index++
      ) {
        try {
          const cleanPostData = JSON.parse(JSON.stringify(postData));

          var send = false;
          await Promise.all(
            areas.asbestosAreas.map(async (area, indexArea) => {
              if (
                area.areaPictures.images[index] &&
                area.areaPictures.images[index].syncList == false &&
                area.areaPictures.images[index].syncCode
              ) {
                area.areaPictures.images[index].flag = 1;
                cleanPostData.FIELDS[bitrixFields.areaPicturesCode[indexArea]] =
                  [area.areaPictures.images[index].syncCode];
                send = true;
              }
            })
          );
          if (send) {
            var response = await this.bitrix
              .syncDamageAreaInspection(cleanPostData, list)
              .toPromise();

            if (response && response.result > 0) {
              await Promise.all(
                areas.asbestosAreas.map((x, index) => {
                  var imageIndex = x.areaPictures.images.findIndex(
                    (x) => x.flag == 1
                  );
                  if (imageIndex >= 0) {
                    x.areaPictures.images[imageIndex].syncList = true;
                    x.areaPictures.images[imageIndex].flag = null;
                  }
                })
              );
            }
          }
        } catch (error) {
          console.log(error);
        }
      }

      var response = await this.bitrix
        .syncDamageAreaInspection(postData, list)
        .toPromise();
      return areas;
    } catch (error) {
      console.log(error);

      return areas;
    }
  }

  async sendDamageInspection(
    areas: DamageAreas,
    task: InspectionTask,
    type: string,
    list: number,
    name: string
  ): Promise<DamageAreas> {
    try {
      if (
        areas.areasInspection.find(
          (x: DamageInspection) =>
            x.areaPictures.images.length > 0 &&
            x.areaPictures.images.find((i) => i.isSync == false)
        )
      ) {
        areas.syncInfo.isSync = false;
        areas.syncInfo.updated = false;
        return areas;
      }

      let postData = {
        //ID: "126",
        IBLOCK_ID: list,
        IBLOCK_TYPE_ID: "lists",
        FIELDS: {
          NAME: name,
        },
      };
      var damageInspectionList = [];

      if (areas.syncInfo.syncCode && areas.syncInfo.syncCode != "") {
        postData["ELEMENT_ID"] = areas.syncInfo.syncCode;
      } else {
        postData["ELEMENT_CODE"] =
          list + "-" + task.id + "-" + (Math.random() * 100).toString();
      }
      damageInspectionList = areas.areasInspection;

      postData.FIELDS[
        bitrixMappingEnvironmental[type].inspectionHeader.contactIdCode
      ] = task.contactId;
      postData.FIELDS[
        bitrixMappingEnvironmental[type].inspectionHeader.startDateCode
      ] = await this.getBitrixDateTime(task.environmentalForm.startDate);
      postData.FIELDS[
        bitrixMappingEnvironmental[type].inspectionHeader.dealIdCode
      ] = task.id;
      postData.FIELDS[
        bitrixMappingEnvironmental[type].inspectionHeader.inspectionType
      ] = areas.moldInspectionType;
      var bitrixFields = bitrixMappingEnvironmental[type];
      var loadFirstImage = false;
      await Promise.all(
        areas.areasInspection.map(
          async (area: DamageInspection, index: number) => {
            if (area.areaName) {
              postData.FIELDS[bitrixFields.areaNameCode[index]] = area.areaName;
            }
            if (area.areaNameOther) {
              postData.FIELDS[bitrixFields.areaNameOtherCode[index]] =
                area.areaNameOther;
            }
            if (area.areaRH) {
              postData.FIELDS[bitrixFields.areaRHCode[index]] = area.areaRH;
            }

            if (area.areaCondition && area.areaCondition.length > 0) {
              postData.FIELDS[bitrixFields.areaConditionCode[index]] =
                area.areaCondition;
            }

            if (area.areaNotes) {
              postData.FIELDS[bitrixFields.areaNotesCode[index]] =
                area.areaNotes;
            }
            if (area.removeCeiling) {
              postData.FIELDS[bitrixFields.removeCeilingCode[index]] =
                area.removeCeiling;
            }
            if (area.ceilingNotes) {
              postData.FIELDS[bitrixFields.ceilingNotesCode[index]] =
                area.ceilingNotes;
            }
            if (area.removeDrywall) {
              postData.FIELDS[bitrixFields.removeDrywallCode[index]] =
                area.removeDrywall;
            }
            if (area.drywallNotes) {
              postData.FIELDS[bitrixFields.drywallNotesCode[index]] =
                area.drywallNotes;
            }
            if (area.removeBaseboards) {
              postData.FIELDS[bitrixFields.removeBaseboardsCode[index]] =
                area.removeBaseboards;
            }
            if (area.baseboardsNotes) {
              postData.FIELDS[bitrixFields.baseboardsNotesCode[index]] =
                area.baseboardsNotes;
            }
            if (area.removeFlooring) {
              postData.FIELDS[bitrixFields.removeFlooringCode[index]] =
                area.removeFlooring;
            }
            if (area.flooringNotes) {
              postData.FIELDS[bitrixFields.flooringNotesCode[index]] =
                area.flooringNotes;
            }
            if (area.decontamination) {
              postData.FIELDS[bitrixFields.decontaminationCode[index]] =
                area.decontamination;
            }
            if (area.furnitureOption) {
              postData.FIELDS[bitrixFields.furnitureOptionCode[index]] =
                area.furnitureOption;
            }
            if (area.beddingsOption) {
              postData.FIELDS[bitrixFields.beddingsOptionCode[index]] =
                area.beddingsOption;
            }
            if (area.observations) {
              postData.FIELDS[bitrixFields.observationsCode[index]] =
                area.observations;
            }
            if (area.waterDamageCategory) {
              postData.FIELDS[bitrixFields.waterDamageCategoryCode[index]] =
                area.waterDamageCategory;
            }
            if (area.waterDamageClass) {
              postData.FIELDS[bitrixFields.waterDamageClassCode[index]] =
                area.waterDamageClass;
            }

            if (
              area.areaPictures.images.length > 0 &&
              area.areaPictures.images.find((x) => !x.syncList)
            ) {
              var imageIndex = area.areaPictures.images.findIndex(
                (x) => !x.syncList
              );
              loadFirstImage = true;
              area.areaPictures.images[imageIndex].flag = 1;
              postData.FIELDS[bitrixFields.areaPicturesCode[index]] = [
                area.areaPictures.images[imageIndex].syncCode,
              ];
            }

            if (area.samples) {
              await Promise.all(
                area.samples.map((element, sampleIndex: number) => {
                  var varient: string = "Sample" + (sampleIndex + 1);

                  if (element.type) {
                    postData.FIELDS[bitrixFields["typeCode" + varient][index]] =
                      element.type;
                  }

                  if (element.labResult) {
                    postData.FIELDS[
                      bitrixFields["labResultCode" + varient][index]
                    ] = element.labResult;
                  }

                  if (type == DamageAreaType.Mold) {
                    if (element.volume) {
                      postData.FIELDS[
                        bitrixFields["volumeCode" + varient][index]
                      ] = element.volume;
                    }

                    if (element.cassetteNumber) {
                      postData.FIELDS[
                        bitrixFields["cassetteNumberCode" + varient][index]
                      ] = element.cassetteNumber;
                    }

                    if (element.toxicMold) {
                      postData.FIELDS[
                        bitrixFields["toxicMoldCode" + varient][index]
                      ] = element.toxicMold;
                    }

                    if (element.areaSwab) {
                      postData.FIELDS[
                        bitrixFields["areaSwabCode" + varient][index]
                      ] = element.areaSwab;
                    }
                  }
                })
              );
            }
            if (area.recomendations) {
              postData.FIELDS[bitrixFields.recomendationsCode[index]] =
                area.recomendations;
            }
          }
        )
      );

      var response = await this.bitrix
        .syncDamageAreaInspection(postData, list)
        .toPromise();

      if (response && response.result > 0) {
        var result = response.result;
        if (result > 0) {
          if (loadFirstImage) {
            await Promise.all(
              areas.areasInspection.map((x, index) => {
                var imageIndex = x.areaPictures.images.findIndex(
                  (x) => x.flag == 1
                );
                if (imageIndex >= 0) {
                  x.areaPictures.images[imageIndex].syncList = true;
                  x.areaPictures.images[imageIndex].flag = null;
                  delete postData.FIELDS[bitrixFields.areaPicturesCode[index]];
                }
              })
            );
          }

          areas.syncInfo.syncCode = areas.syncInfo.syncCode
            ? areas.syncInfo.syncCode
            : result.toString();
          postData["ELEMENT_ID"] = areas.syncInfo.syncCode;
          areas.syncInfo.isSync = result > 0;
          areas.syncInfo.updated = false;
          areas = await this.syncDamageAreaImages(areas, postData, list, type);
          if (
            areas.areasInspection.find((area) =>
              area.areaPictures.images.find((x) => x && x.syncList == false)
            )
          ) {
            areas.syncInfo.isSync = false;
            areas.syncInfo.updated = false;
          }
        } else {
          areas.syncInfo.isSync = false;
          areas.syncInfo.updated = false;
        }
      } else {
        areas.syncInfo.isSync = false;
        areas.syncInfo.updated = false;
      }
      return areas;
    } catch (error) {
      console.log(error);
      areas.syncInfo.isSync = false;
      areas.syncInfo.updated = false;
      return areas;
    }
  }
}

export type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];

export function entries<T>(obj: T): Entries<T> {
  return Object.entries(obj) as any;
}
