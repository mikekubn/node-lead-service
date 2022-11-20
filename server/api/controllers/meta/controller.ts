import MetaService, {Meta} from "../../services/meta.service";
import { Request, Response } from 'express';

export class Controller {
    async getMetaByRegion(req: Request, res: Response): Promise<void> {
        const region = req.params['region'];
        try {
            const metadata: Meta = await MetaService.getMetaByRegion(region);
            res.json(metadata);
        }
        catch {
            res.status(404).end();
        }

    }
}
export default new Controller();
