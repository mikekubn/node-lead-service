import LeadService, {Lead} from "../../services/leads.service";
import { Request, Response } from 'express';

export class Controller {
    async createDE(req: Request, res: Response): Promise<void> {
        const lead : Lead = req.body as Lead;
        try {
            const result = await LeadService.create(lead);
            switch (result.code) {
                case 0:
                    res.status(500).end();
                    break;
                case 1:
                    res.status(201).end();
                    break;
            }
        }
        catch {
            res.status(500).end();
        }
    }
}
export default new Controller();
