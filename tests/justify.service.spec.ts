import { JustifyService } from '../src/services/justify.service';

describe('JustifyService', () => {
    let justifyService: JustifyService;
    const maxLineLength = 40;

    beforeEach(() => {
        justifyService = new JustifyService(maxLineLength);
    });

    describe('justifyText', () => {
        it('should return a single line unchanged if short', () => {
            const input = 'Hello world';
            const result = justifyService.justifyText(input);
            expect(result).toBe('Hello world');
        });

        it('should justify text into multiple lines correctly', () => {
            const input = 'Lorem ipsum dolor sit amet consectetur adipiscing elit';
            const result = justifyService.justifyText(input);
            const lines = result.split("\n");

            // Toutes les lignes sauf la dernière ont la longueur max
            for (let i = 0; i < lines.length - 1; i++) {
                expect(lines[i].length).toBe(maxLineLength);
            }

            // La dernière ligne peut être plus courte
            expect(lines[lines.length - 1].length).toBeLessThanOrEqual(maxLineLength);

            // Tous les mots sont présents
            for (const word of input.split(" ")) {
                expect(result).toContain(word);
            }
        });

        it('should handle a single long word without splitting', () => {
            const input = 'Supercalifragilisticexpialidocious';
            const result = justifyService.justifyText(input);
            expect(result).toBe(input);
        });
    });

    describe('justifyLine', () => {
        it('should justify a line evenly', () => {
            const words = ['Hello', 'world', 'test'];
            const maxLength = 20;
            const result = justifyService['justifyLine'](words, maxLength);
            expect(result.length).toBe(maxLength);
        });

        it('should return a single word unchanged', () => {
            const words = ['Alone'];
            const result = justifyService['justifyLine'](words, 10);
            expect(result).toBe('Alone');
        });
    });
});
