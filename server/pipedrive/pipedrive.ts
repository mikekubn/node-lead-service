import axios, {Axios} from "axios";
import {response} from "express";
//import l from '../common/logger'

export class PipedriveException {
    code: number;
    message: string;

    constructor(code: number, message: string) {
        this.code = code;
        this.message = message;
    }
}

export class PipedriveObject {
    id?: number;
    name: string;

    constructor(name: string, id?: number) {
        this.id = id;
        this.name = name;
    }
}

export class PipedrivePerson extends PipedriveObject{
    name: string;
    organization: number;
    primaryEmail: string;
    phone: string;

    constructor(name: string, organization: number, primaryEmail: string, phone: string,  id?: number) {
        super(name, id);
        this.organization = organization;
        this.primaryEmail = primaryEmail;
        this.phone = phone;
    }
}

export class PipedriveOrganization extends PipedriveObject{
    name: string;
    ownerId: number | null;

    constructor(name: string, ownerId?: number, id?: number) {
        super(name, id);
        this.ownerId = ownerId || null;
    }
}

export class PipedriveDeal extends PipedriveObject {
    status = "Open";
}

export class PipedriveApiOptions {
    apiToken: string;
    companyDomain: string;
}

export class PipedriveApi {
    private axios: Axios;

    constructor(pipedriveApiOptions : PipedriveApiOptions) {
        this.axios = axios.create({
            baseURL: `https://${pipedriveApiOptions.companyDomain}.pipedrive.com/api/v1`,
            headers: {
                'Content-Type': 'application/json'
            }
        })
        this.axios.interceptors.request.use(config => {
            config.params = { ... config.params, 'api_token': pipedriveApiOptions.apiToken };
            return config;
        })
    }

    async createDeal(deal : PipedriveDeal, person : PipedrivePerson, organization : PipedriveOrganization) : Promise<PipedriveDeal> {
        const createResult = await this.axios.post('deals', {
            title: organization.name,
            user_id: organization.ownerId ?? undefined,
            org_id: organization.id,
            person_id: person.id,
            visible_to: '3',
            status: deal.status
        });
        const responseData = createResult.data;
        if(responseData.success) {
            console.log(JSON.stringify(responseData.data))
            const id = responseData.data.id;
            // const ownerId = responseData.data.owner_id.id;

            return new PipedriveDeal(organization.name, id);
        }
        else {
            throw new PipedriveException(1000, `General exception`);
        }
    }

    async createOrganization(organization: PipedriveOrganization): Promise<PipedriveOrganization> {
        const createResult = await this.axios.post('organizations', {
            name: organization.name,
            owner_id: organization.ownerId ?? undefined,
            visible_to: '3'
        });
        const responseData = createResult.data;
        if(responseData.success) {
            const id = responseData.data.id;
            const ownerId = responseData.data.owner_id.id;

            return new PipedriveOrganization(organization.name, ownerId, id);
        }
        else {
            throw new PipedriveException(1000, `General exception`);
        }
    }

    async createPerson(person: PipedrivePerson, organization: PipedriveOrganization) {
        const createResult = await this.axios.post('persons', {
            name: person.name,
            owner_id: organization.ownerId,
            org_id: organization.id,
            email: [person.primaryEmail],
            phone: [person.phone],
            marketing_status: 'subscribed'
        })
        const responseData = createResult.data;
        if(responseData.success) {
            const id = responseData.data.id;
            const ownerId = responseData.data.owner_id.id;

            return new PipedrivePerson(person.name, ownerId, person.primaryEmail, person.phone, id);
        }
        else {
            throw new PipedriveException(1000, `General exception`);
        }

    }
}

if(!process.env.PIPEDRIVE_TOKEN || !process.env.PIPEDRIVE_DOMAIN) {
    throw "Missing PIPEDRIVE_TOKEN and PIPEDRIVE_DOMAIN env params"
}
export default new PipedriveApi({
    apiToken: process.env.PIPEDRIVE_TOKEN,
    companyDomain: process.env.PIPEDRIVE_DOMAIN
});