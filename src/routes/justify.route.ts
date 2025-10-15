import { Router } from "express";
import { JustifyController } from "../controllers/justify.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { rateLimit } from "../middlewares/ratelimit.middleware";

const justifyRouter = Router();

/**
 * @swagger
 * /api/justify:
 *   post:
 *     summary: Justifie un texte
 *     description: |
 *       Prend un texte brut et le justifie à une largeur fixe (80 caractères par ligne).
 *       - Nécessite un token JWT valide (envoyé dans le header `Authorization: Bearer <token>`).
 *       - La dernière ligne du texte n’est **pas justifiée**.
 *     tags:
 *       - Justify
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         text/plain:
 *           schema:
 *             type: string
 *             example: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum nec odio ipsum."
 *     responses:
 *       200:
 *         description: Texte justifié avec des espaces distribués uniformément.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Lorem  ipsum  dolor  sit  amet,  consectetur  adipiscing  elit. Vestibulum nec odio ipsum."
 *       400:
 *         description: Body vide ou invalide.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No text provided or invalid format"
 *       401:
 *         description: Token manquant ou invalide.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Missing token"
 *       402:
 *         description: Limite quotidienne de mots dépassée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Paiement requis : limite quotidienne de mots (80 000) dépassée"
 *                 limit:
 *                   type: integer
 *                   example: 80000
 */
justifyRouter.post("/justify", authenticate, rateLimit, JustifyController.justify);

export default justifyRouter;
