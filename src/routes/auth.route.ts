import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";

const authRouter = Router();

/**
 * @swagger
 * /api/token:
 *   post:
 *     summary: Génère un token JWT pour un utilisateur
 *     description: Retourne un token JWT basé sur l'email fourni dans le body.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: foo@bar.com
 *     responses:
 *       200:
 *         description: Token généré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Email invalide ou manquant
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: No Email provided or invalid format
 */
authRouter.post("/token", AuthController);
export default authRouter;