
export interface ForexConversion {
    "id": string,
    "name": string,
    "type": string,
    "rangeFrom": number,
    "rangeThru": number
}

export interface Product {
    id: string,
    name: string
}

export interface Scope {
    "id": "string",
    "rangeFrom": number,
    "rangeThru": number,
    "currency": "string"
}

export type Currency = string;

export interface Meta {
    "currencies": Array<Currency>
    "forexConversions": Array<ForexConversion>,
    "scopes": Array<Scope>,
    "products": Array<Product>
}

const metas : {
    [key in string] : Meta
} = {
    'DE': {
        currencies: ['EUR', 'CZK', 'HUF', 'GBP', 'USD', 'BGN'],
        forexConversions: [],
        products: [],
        scopes: []
    }
}

export class MetaService {
    getMetaByRegion(region: string) {
        if(!Object.keys(metas).includes(region)) {
            throw "Region not supported";
        }
        return metas[region];
    }
}

export default new MetaService();