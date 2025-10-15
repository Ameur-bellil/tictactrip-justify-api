import { Request, Response, NextFunction } from "express";

// Limite de 80 000 mots par jour
const WORD_LIMIT_PER_DAY = 80000;

// Structure : Map<email, { count: number; date: string }>
const usageMap = new Map<string, { count: number; date: string }>();

export function rateLimit(req: Request, res: Response, next: NextFunction) {
    const user = (req as any).user; // ajouté par authenticate middleware
    if (!user || !user.email) {
        return res.status(401).json({ error: "Unauthorized: missing user" });
    }

    const email = user.email;
    const text = req.body;

    if (!text || typeof text !== "string") {
        return res.status(400).json({ error: "Invalid text format" });
    }


    const wordCount = text.trim().split(/\s+/).length;

    const today = new Date().toISOString().slice(0, 10); // ex: "2025-10-15"
    const usage = usageMap.get(email);

    // Si premier usage ou nouveau jour → reset compteur
    if (!usage || usage.date !== today) {
        usageMap.set(email, { count: wordCount, date: today });
        return next();
    }

    // Vérifie la limite
    const newTotal = usage.count + wordCount;
    if (newTotal > WORD_LIMIT_PER_DAY) {
        return res.status(402).json({error: "Payment Required",limit : WORD_LIMIT_PER_DAY});
    }

    // Met à jour le compteur
    usageMap.set(email, { count: newTotal, date: today });

    next();
}
