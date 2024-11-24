import { scrapeBrowserAgentData } from './scrape';

describe('scrapeBrowserAgentData Integration Test', () => {
    it('should fetch and parse eol browser agent data form the webpage', async () => {
        const result = await scrapeBrowserAgentData();

        expect(result).toBeInstanceOf(Array);
        expect(result.length).toBeGreaterThan(0);

        result.forEach((item) => {
            expect(item).toHaveProperty('version');
            expect(item).toHaveProperty('startDate');
            expect(item).toHaveProperty('endDate');

            expect(item.version).toBeTruthy();
            expect(item.startDate).toBeInstanceOf(Date);
            expect(item.endDate).toBeInstanceOf(Date);

            // Validate version format (e.g. v1.0.0)
            const versionRegex = /^v\d+.\d+.\d+$/;
            expect(item.version).toMatch(versionRegex);
        });
    });
});
