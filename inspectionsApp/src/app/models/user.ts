export class User {
  email: string;
  name: string;
  lastName: string;
  completeName: string;
  image: string;
  userId: number;
  userType: string;
  enterprise: string;
  id: string;

  constructor(values: Object = {}) {
    this.name = values["NAME"];
    this.lastName = values["LAST_NAME"];
    this.completeName = values["NAME"] + " " + values["LAST_NAME"];
    this.email = values["EMAIL"];
    this.image = values["PERSONAL_PHOTO"];
    this.userType = values["USER_TYPE"];
    this.userId = values["ID"];
    this.id = values["ID"] + values["ENTERPRISE"];
    this.enterprise = values["ENTERPRISE"];
    //this.enterprise = enterprise;
  }
}
