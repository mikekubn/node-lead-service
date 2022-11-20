import {PipedriveDeal, PipedriveOrganization, PipedrivePerson} from "../../pipedrive/pipedrive";
import pipedriveApi from "../../pipedrive/pipedrive";

export interface Lead {
    businessName: string,
    personName: string,
    email: string,
    phone: string,
    consent: false,
    currencies: Array<string>
}

class RegistrationResult {
    constructor(code: number, message: string) {
        this.code = code;
        this.message = message;
    }

    code: number;
    message: string;
}

export class LeadService {
    async create(lead: Lead): Promise<RegistrationResult> {
        const org : PipedriveOrganization = new PipedriveOrganization(lead.businessName);
        const createdOrg = await pipedriveApi.createOrganization(org);
        if(!createdOrg.id) {
            return new RegistrationResult(0, "Incorrect organization registration")
        }
        const person : PipedrivePerson = new PipedrivePerson(lead.personName, createdOrg.id, lead.email, lead.phone);
        const createdPerson = await pipedriveApi.createPerson(person, createdOrg);
        const deal : PipedriveDeal = new PipedriveDeal(createdOrg.name);
        const createdDeal = await pipedriveApi.createDeal(deal, createdPerson, createdOrg);
        if(!createdDeal.id) {
            return new RegistrationResult(0, "Incorrect deal registration");
        }
        return new RegistrationResult(1, "OK");
    }
}

export default new LeadService();