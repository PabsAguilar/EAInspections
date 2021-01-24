import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import { IStorage } from "../interfaces/Istorage";
import { IStorageModel } from "../interfaces/Istorage-model";
import { InspectionTask } from "../models/inspection-task";
import { GenericStorageService } from "./generic-storage.service";
const SYNCSTAMPKEY = "inspection-stamp-key";
@Injectable({
  providedIn: "root",
})
export class InspectionsStorageService implements IStorage {
  constructor(private storage: Storage) {}

  collectionName: string = "inspections-task";
  genericStorage: GenericStorageService = new GenericStorageService(
    this.collectionName,
    this.storage
  );

  add(item: InspectionTask): Promise<any> {
    return this.genericStorage.add(item);
  }
  addItems(item: IStorageModel[]): Promise<any> {
    return this.genericStorage.addItems(item);
  }
  update(item: InspectionTask): Promise<any> {
    return this.genericStorage.update(item);
  }
  updateAll(items: IStorageModel[]): Promise<any> {
    return this.genericStorage.updateAll(items);
  }
  getAll(): Promise<InspectionTask[]> {
    return this.genericStorage.getAll();
  }
  get(id: number): Promise<InspectionTask> {
    return this.genericStorage.get(id);
  }
  delete(item: any): Promise<InspectionTask> {
    return this.genericStorage.delete(item);
  }

  async getPendingInspections() {
    var list = await this.getAll();
    var pending;
    if (list != null) {
      pending = list
        .filter((item) => {
          return (
            item.internalStatus === "New" ||
            item.internalStatus === "In Progress"
          );
        })
        .sort(
          (a, b) =>
            this.getTime(a.scheduleDateTime) - this.getTime(b.scheduleDateTime)
        );
    }

    return pending;
  }

  async getCompletedInspections() {
    var list = await this.getAll();
    if (list != null) {
      var completed = list
        .filter((item) => {
          return item.internalStatus !== "New";
        })
        .sort(
          (a, b) =>
            this.getTime(a.scheduleDateTime) - this.getTime(b.scheduleDateTime)
        );
      return completed;
    }
    return [];
  }

  private getTime(date?: Date) {
    return date != null ? new Date(date).getTime() : 0;
  }

  async getExternal() {
    this.storage.set(SYNCSTAMPKEY, new Date());

    var completed = await this.getCompletedInspections();

    var list = await this.getInspectionMockedJson();
    for (let index = 0; index < list.length; index++) {
      var item = list[index] as any;
      item.internalStatus = "New";

      var itemCompleted = null;
      if (completed != null && completed.length > 0) {
        itemCompleted = completed.find((x) => {
          return x.id === item.id;
        });
      }

      list[index] = itemCompleted ? itemCompleted : item;
    }

    return this.genericStorage.addItems(list);
  }

  async getSyncStamp() {
    return await this.storage.get(SYNCSTAMPKEY);
  }

  async syncPendingTask() {
    var list = await this.getAll();
    if (list == null || list.length == 0) {
      return false;
    }
    list.forEach((element) => {
      if (element.internalStatus == "Pending") {
        element.internalStatus = "Completed";
      }
    });
    return await this.updateAll(list);
  }

  getInspectionMockedJson() {
    var array = [
      {
        id: 0,
        scheduleDateTime: "Tuesday, February 2, 2021 2:51 AM",
        name: {
          first: "Fox",
          last: "Francis",
        },
        contactName: "Fox Francis",
        serviceAddress: "440 Vermont Court, Daytona Beach, FL, 4151",
        contactPhone: "+1 (818) 424-3238",
        company: "ORBIXTAR",
        contactEmail: "fox.francis@orbixtar.net",
        referalPartnerContact: "Cathryn Meyers",
        referalPartnerCompany: "ZENTIX",
        inspectorName: "Inspector A",
        inspectorUserId: 25,
        inspectionsInstructions:
          "Consequat tempor eu anim fugiat. Id laboris Lorem exercitation commodo exercitation fugiat. Velit sunt sint magna occaecat.",
        inspectionType: "Comprehensive Inspection",
      },
      {
        id: 1,
        scheduleDateTime: "Sunday, January 31, 2021 7:34 AM",
        name: {
          first: "Lyons",
          last: "Massey",
        },
        contactName: "Lyons Massey",
        serviceAddress: "540 Autumn Avenue, Melbourne, FL, 8842",
        contactPhone: "+1 (924) 405-2264",
        company: "EURON",
        contactEmail: "lyons.massey@euron.name",
        referalPartnerContact: "Knox Tucker",
        referalPartnerCompany: "SAVVY",
        inspectorName: "Inspector A",
        inspectorUserId: 25,
        inspectionsInstructions:
          "Nostrud eiusmod aliquip incididunt cupidatat deserunt aliqua duis. Commodo aliqua amet ullamco laboris culpa nulla aliquip qui dolore elit laborum. Amet irure veniam Lorem ut aute ad est quis aliqua deserunt non veniam. Laboris velit proident est deserunt in non minim anim. Eiusmod eiusmod occaecat cupidatat cillum pariatur velit qui aute sit eu nulla culpa nostrud nostrud. Minim id cupidatat minim aute magna fugiat officia aliquip duis nisi.",
        inspectionType: "Environmental Inspection",
      },
      {
        id: 2,
        scheduleDateTime: "Friday, January 15, 2021 6:19 AM",
        name: {
          first: "Beverly",
          last: "Knox",
        },
        contactName: "Beverly Knox",
        serviceAddress: "218 Prospect Avenue, Melbourne, FL, 5958",
        contactPhone: "+1 (942) 514-3522",
        company: "SKYPLEX",
        contactEmail: "beverly.knox@skyplex.co.uk",
        referalPartnerContact: "Cantrell Shields",
        referalPartnerCompany: "CENTURIA",
        inspectorName: "Inspector A",
        inspectorUserId: 25,
        inspectionsInstructions:
          "Laboris commodo tempor officia voluptate irure deserunt pariatur nulla veniam tempor duis duis adipisicing enim. Ex duis est culpa irure est consectetur adipisicing dolor anim anim cillum. Laborum consequat ullamco consectetur exercitation aliquip cillum magna eiusmod anim elit non reprehenderit. Officia consectetur occaecat et elit dolor. Veniam ipsum ex minim voluptate esse adipisicing quis. Cupidatat culpa magna esse ad in minim esse pariatur ipsum aliqua sint. Id elit officia aute exercitation ipsum.",
        inspectionType: "Comprehensive Inspection",
      },
      {
        id: 3,
        scheduleDateTime: "Tuesday, January 19, 2021 5:53 PM",
        name: {
          first: "Isabel",
          last: "Koch",
        },
        contactName: "Isabel Koch",
        serviceAddress: "741 Kensington Walk, Melbourne, FL, 3451",
        contactPhone: "+1 (961) 576-2324",
        company: "JASPER",
        contactEmail: "isabel.koch@jasper.info",
        referalPartnerContact: "Jimenez Wall",
        referalPartnerCompany: "COMBOGENE",
        inspectorName: "Inspector A",
        inspectorUserId: 25,
        inspectionsInstructions:
          "Anim est labore veniam est. Dolore velit consectetur aliqua do culpa tempor do officia aute. Ut proident laborum in sit Lorem do est proident laborum. Deserunt incididunt anim reprehenderit ipsum dolore labore laboris irure Lorem amet adipisicing amet adipisicing eiusmod.",
        inspectionType: "Environmental Inspection",
      },
      {
        id: 4,
        scheduleDateTime: "Saturday, January 30, 2021 8:32 PM",
        name: {
          first: "Callie",
          last: "Wilcox",
        },
        contactName: "Callie Wilcox",
        serviceAddress: "779 Joval Court, Daytona Beach, FL, 4373",
        contactPhone: "+1 (871) 406-2317",
        company: "STROZEN",
        contactEmail: "callie.wilcox@strozen.me",
        referalPartnerContact: "Effie Marshall",
        referalPartnerCompany: "HARMONEY",
        inspectorName: "Inspector A",
        inspectorUserId: 25,
        inspectionsInstructions:
          "Et enim consequat laborum consectetur ad. Eu do dolore ut magna consectetur fugiat reprehenderit labore proident voluptate. Sunt exercitation fugiat sit anim id voluptate nostrud velit eiusmod. Reprehenderit irure do id anim laborum anim officia commodo quis consectetur. Nulla ex elit quis est. Magna quis fugiat ut incididunt officia quis eiusmod labore quis incididunt deserunt duis nulla excepteur. Voluptate eiusmod enim magna sint ex eiusmod laboris tempor amet dolor amet Lorem.",
        inspectionType: "Comprehensive Inspection",
      },
      {
        id: 5,
        scheduleDateTime: "Tuesday, January 19, 2021 1:47 AM",
        name: {
          first: "Deanna",
          last: "Floyd",
        },
        contactName: "Deanna Floyd",
        serviceAddress: "567 Beverley Road, Daytona Beach, FL, 4530",
        contactPhone: "+1 (812) 555-3167",
        company: "GENESYNK",
        contactEmail: "deanna.floyd@genesynk.com",
        referalPartnerContact: "Lourdes Bowman",
        referalPartnerCompany: "GALLAXIA",
        inspectorName: "Inspector A",
        inspectorUserId: 25,
        inspectionsInstructions:
          "Anim occaecat non proident occaecat ipsum sit mollit. Dolore adipisicing anim occaecat occaecat sit aute sint ut ipsum pariatur incididunt sint sunt ullamco. Veniam occaecat officia quis culpa cillum. Eu amet velit est cillum cillum.",
        inspectionType: "Comprehensive Inspection",
      },
      {
        id: 6,
        scheduleDateTime: "Wednesday, January 27, 2021 4:55 PM",
        name: {
          first: "Taylor",
          last: "Anthony",
        },
        contactName: "Taylor Anthony",
        serviceAddress: "242 Fane Court, Miami, FL, 5047",
        contactPhone: "+1 (955) 562-3526",
        company: "NETAGY",
        contactEmail: "taylor.anthony@netagy.io",
        referalPartnerContact: "Cunningham Moses",
        referalPartnerCompany: "SNIPS",
        inspectorName: "Inspector A",
        inspectorUserId: 25,
        inspectionsInstructions:
          "Eu ut culpa cillum aute mollit velit duis Lorem. Aliqua voluptate do laboris aliquip laboris ad. Magna et reprehenderit laboris occaecat laborum laboris dolore laborum duis. Quis aute in est occaecat eiusmod anim minim eiusmod adipisicing enim.",
        inspectionType: "Comprehensive Inspection",
      },
      {
        id: 7,
        scheduleDateTime: "Sunday, January 24, 2021 2:23 AM",
        name: {
          first: "Chandler",
          last: "Hamilton",
        },
        contactName: "Chandler Hamilton",
        serviceAddress: "638 Hinckley Place, Daytona Beach, FL, 1147",
        contactPhone: "+1 (933) 412-3394",
        company: "INSURETY",
        contactEmail: "chandler.hamilton@insurety.org",
        referalPartnerContact: "Noreen Smith",
        referalPartnerCompany: "OVATION",
        inspectorName: "Inspector A",
        inspectorUserId: 25,
        inspectionsInstructions:
          "Commodo in Lorem aliquip ullamco. Irure cupidatat fugiat incididunt voluptate duis exercitation nostrud duis veniam et qui eiusmod tempor labore. Magna eu ipsum voluptate fugiat Lorem exercitation sint deserunt deserunt aute et velit. Anim consequat et in fugiat. Adipisicing minim enim anim reprehenderit commodo do officia cillum esse sit. Sunt Lorem excepteur cillum adipisicing velit non sint laboris fugiat culpa laborum sint.",
        inspectionType: "Comprehensive Inspection",
      },
      {
        id: 8,
        scheduleDateTime: "Sunday, January 24, 2021 6:30 AM",
        name: {
          first: "Wiggins",
          last: "Harmon",
        },
        contactName: "Wiggins Harmon",
        serviceAddress: "310 Sutter Avenue, Melbourne, FL, 7002",
        contactPhone: "+1 (847) 485-3010",
        company: "SULTRAX",
        contactEmail: "wiggins.harmon@sultrax.biz",
        referalPartnerContact: "Patton Rosa",
        referalPartnerCompany: "ZORK",
        inspectorName: "Inspector A",
        inspectorUserId: 25,
        inspectionsInstructions:
          "Et laborum duis do proident elit aliqua amet. Pariatur proident aute duis cupidatat non in. Tempor consectetur ullamco dolore exercitation. Quis amet aliquip sit ut cillum dolor. Deserunt sunt excepteur magna aliquip dolor fugiat. Duis laboris Lorem non ea ullamco quis et deserunt tempor eu duis. Ipsum Lorem eiusmod eiusmod veniam exercitation mollit adipisicing dolore elit.",
        inspectionType: "Comprehensive Inspection",
      },
      {
        id: 9,
        scheduleDateTime: "Wednesday, January 20, 2021 12:59 PM",
        name: {
          first: "Latisha",
          last: "Walters",
        },
        contactName: "Latisha Walters",
        serviceAddress: "357 Hutchinson Court, Melbourne, FL, 436",
        contactPhone: "+1 (872) 477-3367",
        company: "MAGNINA",
        contactEmail: "latisha.walters@magnina.tv",
        referalPartnerContact: "Chrystal Wheeler",
        referalPartnerCompany: "BUZZWORKS",
        inspectorName: "Inspector A",
        inspectorUserId: 25,
        inspectionsInstructions:
          "Enim aliqua velit anim reprehenderit. Elit amet consectetur incididunt elit. Nostrud pariatur consectetur nostrud consectetur.",
        inspectionType: "Comprehensive Inspection",
      },
      {
        id: 10,
        scheduleDateTime: "Friday, February 5, 2021 10:54 PM",
        name: {
          first: "Ronda",
          last: "Glenn",
        },
        contactName: "Ronda Glenn",
        serviceAddress: "626 Cornelia Street, Melbourne, FL, 5274",
        contactPhone: "+1 (948) 517-3072",
        company: "BOLAX",
        contactEmail: "ronda.glenn@bolax.us",
        referalPartnerContact: "Leann Patton",
        referalPartnerCompany: "SEQUITUR",
        inspectorName: "Inspector A",
        inspectorUserId: 25,
        inspectionsInstructions:
          "Laborum laboris minim ad eiusmod velit cupidatat deserunt. Sunt excepteur magna reprehenderit mollit dolore est nisi. Non do ex dolore aliquip. Do non do deserunt culpa ea proident aliqua ullamco excepteur ad. Laboris nulla anim sunt proident.",
        inspectionType: "Environmental Inspection",
      },
      {
        id: 11,
        scheduleDateTime: "Thursday, January 21, 2021 8:58 AM",
        name: {
          first: "Mccall",
          last: "Levy",
        },
        contactName: "Mccall Levy",
        serviceAddress: "875 Noel Avenue, Melbourne, FL, 371",
        contactPhone: "+1 (843) 413-3877",
        company: "RAMJOB",
        contactEmail: "mccall.levy@ramjob.biz",
        referalPartnerContact: "Bond Ramos",
        referalPartnerCompany: "PORTALINE",
        inspectorName: "Inspector A",
        inspectorUserId: 25,
        inspectionsInstructions:
          "Excepteur ea qui minim anim mollit excepteur Lorem voluptate laboris. Non aute mollit sunt quis nisi. Labore pariatur commodo incididunt exercitation cillum.",
        inspectionType: "Environmental Inspection",
      },
      {
        id: 12,
        scheduleDateTime: "Friday, February 5, 2021 8:39 AM",
        name: {
          first: "Shawn",
          last: "Alston",
        },
        contactName: "Shawn Alston",
        serviceAddress: "631 Brightwater Avenue, Orlando, FL, 7705",
        contactPhone: "+1 (876) 515-2914",
        company: "WEBIOTIC",
        contactEmail: "shawn.alston@webiotic.net",
        referalPartnerContact: "Heath Graham",
        referalPartnerCompany: "ZEPITOPE",
        inspectorName: "Inspector A",
        inspectorUserId: 25,
        inspectionsInstructions:
          "Est reprehenderit reprehenderit ad aliqua ex. Est ut consectetur amet labore nisi ullamco do est incididunt enim velit. Ea dolor sit labore culpa cillum deserunt enim esse id do mollit fugiat. Cupidatat irure dolore ipsum consequat voluptate consequat Lorem duis ullamco do est quis.",
        inspectionType: "Comprehensive Inspection",
      },
      {
        id: 13,
        scheduleDateTime: "Wednesday, January 13, 2021 10:08 PM",
        name: {
          first: "Cash",
          last: "Phillips",
        },
        contactName: "Cash Phillips",
        serviceAddress: "708 Oxford Walk, Daytona Beach, FL, 5040",
        contactPhone: "+1 (929) 408-3173",
        company: "PLASMOSIS",
        contactEmail: "cash.phillips@plasmosis.name",
        referalPartnerContact: "Rosanna Bates",
        referalPartnerCompany: "THREDZ",
        inspectorName: "Inspector A",
        inspectorUserId: 25,
        inspectionsInstructions:
          "Occaecat nisi sunt exercitation et qui ex duis excepteur dolore. Magna dolor excepteur mollit labore pariatur sunt aute mollit id fugiat veniam. Sunt eiusmod cillum non fugiat ullamco. Excepteur occaecat eu voluptate aute sint nisi. Sint aliquip excepteur minim non in tempor deserunt sint ex pariatur adipisicing aute. In officia ut sint nulla voluptate pariatur ex minim Lorem et.",
        inspectionType: "Comprehensive Inspection",
      },
      {
        id: 14,
        scheduleDateTime: "Saturday, January 30, 2021 10:53 PM",
        name: {
          first: "Bonita",
          last: "Erickson",
        },
        contactName: "Bonita Erickson",
        serviceAddress: "834 Sedgwick Street, Daytona Beach, FL, 4661",
        contactPhone: "+1 (959) 414-3726",
        company: "EMTRAC",
        contactEmail: "bonita.erickson@emtrac.co.uk",
        referalPartnerContact: "Heather Russell",
        referalPartnerCompany: "NURPLEX",
        inspectorName: "Inspector A",
        inspectorUserId: 25,
        inspectionsInstructions:
          "Dolor fugiat fugiat est dolore labore est ut ipsum voluptate. Reprehenderit veniam labore ut laborum excepteur ullamco laborum eu cillum magna enim. Commodo nisi laboris aliquip aliquip ad id amet dolor fugiat magna incididunt elit nostrud. Qui in in nulla nulla exercitation ipsum deserunt non quis enim pariatur enim et qui.",
        inspectionType: "Comprehensive Inspection",
      },
      {
        id: 15,
        scheduleDateTime: "Thursday, February 4, 2021 9:23 AM",
        name: {
          first: "Estella",
          last: "Hull",
        },
        contactName: "Estella Hull",
        serviceAddress: "621 Garnet Street, Daytona Beach, FL, 6472",
        contactPhone: "+1 (834) 434-2673",
        company: "ZENSOR",
        contactEmail: "estella.hull@zensor.info",
        referalPartnerContact: "Patty Hubbard",
        referalPartnerCompany: "MAGNAFONE",
        inspectorName: "Inspector A",
        inspectorUserId: 25,
        inspectionsInstructions:
          "Voluptate ut exercitation consequat proident non velit aute eiusmod cupidatat elit labore qui non eiusmod. Lorem cillum aliqua consequat laboris id tempor cupidatat deserunt laborum aute eiusmod excepteur voluptate esse. Mollit nisi exercitation aute amet laboris velit occaecat labore exercitation anim minim. Culpa eiusmod eiusmod aliquip cillum enim.",
        inspectionType: "Environmental Inspection",
      },
      {
        id: 16,
        scheduleDateTime: "Wednesday, January 27, 2021 4:54 AM",
        name: {
          first: "Crosby",
          last: "Hoffman",
        },
        contactName: "Crosby Hoffman",
        serviceAddress: "173 Cumberland Walk, Miami, FL, 607",
        contactPhone: "+1 (900) 501-2453",
        company: "ZOINAGE",
        contactEmail: "crosby.hoffman@zoinage.me",
        referalPartnerContact: "Ochoa Malone",
        referalPartnerCompany: "GEEKWAGON",
        inspectorName: "Inspector A",
        inspectorUserId: 25,
        inspectionsInstructions:
          "Culpa sit enim cupidatat elit voluptate exercitation anim excepteur duis id elit labore culpa. Consectetur eiusmod sint consequat eu. Est excepteur officia adipisicing ipsum deserunt sunt ea labore irure elit ad voluptate non elit. Cupidatat deserunt dolor ea eu quis sunt commodo labore commodo. Sit ex laboris pariatur veniam do consectetur. Excepteur tempor eiusmod sit voluptate laborum veniam dolore cupidatat enim. Aliquip do tempor nisi minim occaecat aute quis laborum exercitation.",
        inspectionType: "Environmental Inspection",
      },
      {
        id: 17,
        scheduleDateTime: "Friday, January 22, 2021 12:01 PM",
        name: {
          first: "Sharron",
          last: "Kerr",
        },
        contactName: "Sharron Kerr",
        serviceAddress: "652 Howard Avenue, Melbourne, FL, 7412",
        contactPhone: "+1 (919) 510-2624",
        company: "GENMOM",
        contactEmail: "sharron.kerr@genmom.com",
        referalPartnerContact: "Phoebe Rodriquez",
        referalPartnerCompany: "MARKETOID",
        inspectorName: "Inspector A",
        inspectorUserId: 25,
        inspectionsInstructions:
          "Occaecat nisi proident anim ipsum ea et sunt excepteur pariatur veniam pariatur. Aute eiusmod ullamco irure culpa occaecat aliqua nostrud exercitation. Mollit nostrud voluptate laborum duis esse ea. Velit adipisicing aute ullamco voluptate duis aliqua eiusmod cillum nostrud sit. Commodo adipisicing amet qui tempor ad exercitation fugiat mollit occaecat.",
        inspectionType: "Environmental Inspection",
      },
      {
        id: 18,
        scheduleDateTime: "Thursday, January 21, 2021 5:53 PM",
        name: {
          first: "Odom",
          last: "Livingston",
        },
        contactName: "Odom Livingston",
        serviceAddress: "976 Agate Court, Melbourne, FL, 2573",
        contactPhone: "+1 (988) 520-2452",
        company: "COMVENE",
        contactEmail: "odom.livingston@comvene.io",
        referalPartnerContact: "Tasha Patrick",
        referalPartnerCompany: "PHOTOBIN",
        inspectorName: "Inspector A",
        inspectorUserId: 25,
        inspectionsInstructions:
          "Aute non adipisicing ex fugiat consectetur laboris qui. Anim non tempor aliquip amet sit irure ad duis. Do sit et enim in Lorem nostrud occaecat ut est mollit laboris laboris nisi ex. Ea adipisicing laboris cillum aute sint exercitation sunt nisi do culpa. Aliqua consectetur anim ea ad tempor aute adipisicing tempor mollit irure nisi. Excepteur ea magna nisi laboris eiusmod ad deserunt ullamco deserunt culpa. Deserunt culpa aliqua pariatur elit.",
        inspectionType: "Comprehensive Inspection",
      },
      {
        id: 19,
        scheduleDateTime: "Thursday, January 14, 2021 8:22 AM",
        name: {
          first: "Watts",
          last: "Huffman",
        },
        contactName: "Watts Huffman",
        serviceAddress: "890 Carlton Avenue, Melbourne, FL, 637",
        contactPhone: "+1 (899) 485-2281",
        company: "HOMETOWN",
        contactEmail: "watts.huffman@hometown.org",
        referalPartnerContact: "Laurie King",
        referalPartnerCompany: "SHEPARD",
        inspectorName: "Inspector A",
        inspectorUserId: 25,
        inspectionsInstructions:
          "Tempor consectetur Lorem reprehenderit excepteur pariatur proident irure sit magna eu nisi adipisicing. Proident fugiat sit sit elit deserunt magna. Eiusmod magna consequat laboris officia officia consequat officia. Excepteur ex id proident sunt id sint labore tempor eiusmod ad nisi do. Culpa sint est non ullamco. Ullamco non culpa nulla sint pariatur aliquip consequat proident.",
        inspectionType: "Comprehensive Inspection",
      },
    ];
    return array;
  }
}
