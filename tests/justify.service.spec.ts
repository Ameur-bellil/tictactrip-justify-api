import { JustifyService } from '../src/services/justify.service';

describe('JustifyService', () => {
    let justifyService: JustifyService;
    const maxLineLength = 80;

    beforeEach(() => {
        justifyService = new JustifyService(maxLineLength);
    });

    afterEach(async () => {
        // Nettoyer Redis après chaque test
        await justifyService['redisClient'].flushdb();
    });

    afterAll(async () => {
        // Fermer la connexion Redis
        await justifyService['redisClient'].quit();
    });




    describe('justifyText - Cas de base', () => {
        it('should return a single line unchanged if short', async () => {
            const input = 'Hello world';
            const result = await justifyService.justifyText(input);
            expect(result).toBe('Hello world');
        });

        it('should handle empty string', async () => {
            const input = '';
            const result = await justifyService.justifyText(input);
            expect(result).toBe('');
        });

        it('should handle single word', async () => {
            const input = 'Hello';
            const result = await justifyService.justifyText(input);
            expect(result).toBe('Hello');
        });

        it('should handle text with exactly 80 characters', async () => {
            // 80 caractères exactement
            const input = 'Ce texte fait exactement quatre vingts caracteres sur une seule ligne test.';
            const result = await justifyService.justifyText(input);
            expect(result.split('\n').length).toBe(1);
        });
    });



    describe('justifyText - Texte littéraire français', () => {
        it('should return the word itself if only one word is given', async () => {
            const result = await justifyService.justifyText(
                'Longtemps, je me suis couché de bonne heure. Parfois, à peine ma bougie éteinte, mes yeux se fermaient si vite que je n’avais pas le temps de me dire: «Je m’endors.» Et, une demi-heure après, la pensée qu’il était temps de chercher le sommeil m’éveillait; je voulais poser le volume que je croyais avoir dans les mains et souffler ma lumière; je n’avais pas cessé en dormant de faire des réflexions sur ce que je venais de lire, mais ces réflexions avaient pris un tour un peu particulier; il me semblait que j’étais moi-même ce dont parlait l’ouvrage: une église, un quatuor, la rivalité de François Ier et de Charles-Quint. \n' +
                '\n' +
                'Cette croyance survivait pendant quelques secondes à mon réveil; elle ne choquait pas ma raison, mais pesait comme des écailles sur mes yeux et les empêchait de se rendre compte que le bougeoir n’était plus allumé. \n' +
                ' Puis elle commençait à me devenir inintelligible, comme après la métempsycose les pensées d’une existence antérieure; le sujet du livre se détachait de moi, j’étais libre de m’y appliquer ou non; aussitôt je recouvrais la vue et j’étais bien étonné de trouver autour de moi une obscurité, douce et reposante pour mes yeux, mais peut-être plus encore pour mon esprit, à qui elle apparaissait comme une chose sans cause, incompréhensible, comme une chose vraiment obscure. Je me demandais quelle heure il pouvait être; j’entendais le sifflement des trains qui, plus ou moins éloigné, comme le chant d’un oiseau dans une forêt, relevant les distances, me décrivait l’étendue de la campagne déserte où le voyageur se hâte vers la station prochaine; et le petit chemin qu’il suit va être gravé dans son souvenir par l’excitation qu’il doit à des lieux nouveaux, à des actes inaccoutumés, à la causerie récente et aux adieux sous la lampe étrangère qui le suivent encore dans le silence de la nuit, à la douceur prochaine du retour.',
            );
            const expected =
                'Longtemps, je me suis couché de bonne heure. Parfois, à peine ma bougie éteinte,\n' +
                'mes  yeux  se  fermaient  si  vite  que  je n’avais pas le temps de me dire: «Je\n' +
                'm’endors.»  Et, une demi-heure après, la pensée qu’il était temps de chercher le\n' +
                'sommeil  m’éveillait;  je  voulais poser le volume que je croyais avoir dans les\n' +
                'mains  et  souffler  ma  lumière;  je  n’avais pas cessé en dormant de faire des\n' +
                'réflexions  sur  ce  que  je venais de lire, mais ces réflexions avaient pris un\n' +
                'tour  un  peu  particulier;  il me semblait que j’étais moi-même ce dont parlait\n' +
                'l’ouvrage:   une  église,  un  quatuor,  la  rivalité  de  François  Ier  et  de\n' +
                'Charles-Quint.  Cette croyance survivait pendant quelques secondes à mon réveil;\n' +
                'elle  ne  choquait pas ma raison, mais pesait comme des écailles sur mes yeux et\n' +
                'les empêchait de se rendre compte que le bougeoir n’était plus allumé. Puis elle\n' +
                'commençait  à me devenir inintelligible, comme après la métempsycose les pensées\n' +
                'd’une existence antérieure; le sujet du livre se détachait de moi, j’étais libre\n' +
                'de m’y appliquer ou non; aussitôt je recouvrais la vue et j’étais bien étonné de\n' +
                'trouver  autour  de  moi  une  obscurité, douce et reposante pour mes yeux, mais\n' +
                'peut-être  plus  encore pour mon esprit, à qui elle apparaissait comme une chose\n' +
                'sans  cause, incompréhensible, comme une chose vraiment obscure. Je me demandais\n' +
                'quelle  heure il pouvait être; j’entendais le sifflement des trains qui, plus ou\n' +
                'moins  éloigné,  comme  le  chant  d’un  oiseau  dans  une  forêt,  relevant les\n' +
                'distances,  me décrivait l’étendue de la campagne déserte où le voyageur se hâte\n' +
                'vers  la station prochaine; et le petit chemin qu’il suit va être gravé dans son\n' +
                'souvenir  par  l’excitation  qu’il  doit  à  des  lieux  nouveaux,  à  des actes\n' +
                'inaccoutumés, à la causerie récente et aux adieux sous la lampe étrangère qui le\n' +
                'suivent encore dans le silence de la nuit, à la douceur prochaine du retour.';

            expect(result).toBe(expected);
        });
    });

    describe('justifyText - Cas particuliers', () => {
        it('should handle a single long word without splitting', async () => {
            const input = 'Supercalifragilisticexpialidocious';
            const result = await justifyService.justifyText(input);
            expect(result).toBe(input);
        });

        it('should handle text with punctuation', async () => {
            const input = 'JavaScript, TypeScript, Python... Tant de langages ! Lequel choisir ? Cela dépend du projet, de l\'équipe, et des objectifs visés pour le développement.';
            const result = await justifyService.justifyText(input);
            const lines = result.split('\n');

            // Vérifier que la ponctuation est préservée
            expect(result).toContain('JavaScript,');
            expect(result).toContain('!');
            expect(result).toContain('?');

            // Les lignes (sauf la dernière) doivent être justifiées
            for (let i = 0; i < lines.length - 1; i++) {
                expect(lines[i].length).toBe(80);
            }
        });

        it('should handle text with numbers', async () => {
            const input = 'En 2024 la technologie evolue rapidement avec plus de 1000 nouvelles innovations chaque annee dans le domaine de intelligence artificielle';
            const result = await justifyService.justifyText(input);

            expect(result).toContain('2024');
            expect(result).toContain('1000');
        });

        it('should handle very long text', async () => {
            const input = 'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum';
            const result = await justifyService.justifyText(input);
            const lines = result.split('\n');

            // Devrait avoir plusieurs lignes
            expect(lines.length).toBeGreaterThan(3);

            // Toutes les lignes sauf la dernière doivent être justifiées
            for (let i = 0; i < lines.length - 1; i++) {
                expect(lines[i].length).toBe(80);
            }
        });
    });

    describe('justifyText - Cache Redis', () => {
        it('should cache justified text in Redis', async () => {
            const input = 'Test de cache Redis avec du texte';

            // Premier appel
            const result1 = await justifyService.justifyText(input);

            // Vérifier que la clé existe dans Redis
            const cacheKey = `justify:${justifyService['hashCode'](input)}`;
            const cached = await justifyService['redisClient'].get(cacheKey);

            expect(cached).toBe(result1);
        });

        it('should return cached result on second call', async () => {
            const input = 'Test de performance du cache';

            // Premier appel
            const result1 = await justifyService.justifyText(input);

            // Deuxième appel (devrait utiliser le cache)
            const result2 = await justifyService.justifyText(input);

            expect(result1).toBe(result2);
        });

        it('should have different cache keys for different texts', async () => {
            const input1 = 'Premier texte';
            const input2 = 'Deuxième texte';

            const hash1 = justifyService['hashCode'](input1);
            const hash2 = justifyService['hashCode'](input2);

            expect(hash1).not.toBe(hash2);
        });
    });

    describe('hashCode - Méthode privée', () => {
        it('should generate consistent hash for same text', () => {
            const text = 'Test text';
            const hash1 = justifyService['hashCode'](text);
            const hash2 = justifyService['hashCode'](text);

            expect(hash1).toBe(hash2);
        });

        it('should generate different hashes for different texts', () => {
            const hash1 = justifyService['hashCode']('Text 1');
            const hash2 = justifyService['hashCode']('Text 2');

            expect(hash1).not.toBe(hash2);
        });

        it('should return a string', () => {
            const hash = justifyService['hashCode']('Test');
            expect(typeof hash).toBe('string');
        });
    });

});