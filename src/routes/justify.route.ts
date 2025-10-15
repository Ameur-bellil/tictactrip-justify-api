import { Router } from "express";
import { JustifyController } from "../controllers/justify.controller";
import { authenticate } from "../middlewares/auth.middleware";

const justifyRouter = Router();

justifyRouter.post("/justify", authenticate, JustifyController.justify);

export default justifyRouter;
