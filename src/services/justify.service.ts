import Redis from "ioredis";

export class JustifyService {
    private readonly maxLineLength: number;
    private readonly redisClient: Redis;

    constructor(maxLineLength: number = 80) {
        this.maxLineLength = maxLineLength;
        this.redisClient = new Redis({
            host: process.env.REDIS_HOST || "localhost",
            port: Number(process.env.REDIS_PORT) || 6379,
        });
    }

    /**
     * Justifie le texte, en utilisant Redis comme cache.
     */
    public async justifyText(text: string): Promise<string> {
        const trimmedText = text.trim();

        if (!trimmedText) {
            return '';
        }

        const cacheKey = `justify:${this.hashCode(trimmedText)}`;

        const cachedResult = await this.redisClient.get(cacheKey);
        if (cachedResult) {
            console.log("[App] Cache hit");
            return cachedResult;
        }

        const words = trimmedText.split(/\s+/).filter(word => word.length > 0);
        if (words.length === 0) {
            return '';
        }

        const lines: string[] = [];
        let currentLine: string[] = [];
        let currentLength = 0;

        for (const word of words) {

            const lineLength = currentLength + currentLine.length + word.length;

            if (currentLine.length > 0 && lineLength > this.maxLineLength) {
                lines.push(this.justifyLine(currentLine, this.maxLineLength));
                currentLine = [word];
                currentLength = word.length;
            } else {

                currentLine.push(word);
                currentLength += word.length;
            }
        }


        if (currentLine.length > 0) {
            lines.push(currentLine.join(" ")); // La dernière ligne n'est PAS justifiée
        }

        const justifiedText = lines.join("\n");

        await this.redisClient.set(cacheKey, justifiedText, "EX", 60 * 60 * 24);

        return justifiedText;
    }

    /**
     * Justifie une seule ligne en distribuant les espaces uniformément.
     */
    private justifyLine(words: string[], lineWidth: number): string {
        if (words.length === 1) {
            return words[0];
        }

        const totalChars = words.reduce((acc, word) => acc + word.length, 0);

        const totalSpaces = lineWidth - totalChars;

        const spacesBetweenWords = words.length - 1;

        const minSpaces = Math.floor(totalSpaces / spacesBetweenWords);

        const extraSpaces = totalSpaces % spacesBetweenWords;

        let justifiedLine = "";


        for (let i = 0; i < words.length - 1; i++) {
            justifiedLine += words[i];
            const spaces = minSpaces + (i < extraSpaces ? 1 : 0);
            justifiedLine += " ".repeat(spaces);
        }


        justifiedLine += words[words.length - 1];

        return justifiedLine;
    }

    /**
     * Crée un hash code du texte pour la clé Redis.
     */
    private hashCode(text: string): string {
        let hash = 0;
        for (let i = 0; i < text.length; i++) {
            hash = (hash << 5) - hash + text.charCodeAt(i);
            hash |= 0; // Conversion en entier 32 bits
        }
        return hash.toString();
    }

    /**
     * Ferme la connexion Redis proprement.
     */
    public async close(): Promise<void> {
        await this.redisClient.quit();
    }
}

export default JustifyService;