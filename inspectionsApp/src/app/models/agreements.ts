import { AgreementContact } from "./agreement-contact";

export class Agreements {
  contacts: AgreementContact[];
  inspectorContact: AgreementContact;
  hasOpen: boolean;
  constructor() {
    this.hasOpen = false;
    this.contacts = [];
  }
}
