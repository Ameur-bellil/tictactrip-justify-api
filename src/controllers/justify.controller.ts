import { Request, Response } from "express";
import { JustifyService } from "../services/justify.service";


const justifyService = new JustifyService(80);
export class JustifyController {
    static justify(req: Request, res: Response) {
        const text = req.body;

        if (!text || typeof text !== "string") {
            return res.status(400).json({ error: "No text provided or invalid format" });
        }

        const justifiedText = justifyService.justifyText(text);
        res.send(justifiedText);
    }
}
