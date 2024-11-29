import { promises as fs } from 'fs';
import * as cheerio from 'cheerio';

async function scrapeBrowserAgentData() {
    const URL = 'https://docs.newrelic.com/docs/browser/browser-monitoring/getting-started/browser-agent-eol-policy/';

    const response = await fetch(URL);
    if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const data = [];
    $('table tbody tr').each((_, row) => {
        const cells = $(row).find('td');

        data.push({
            version: $(cells[0]).text().trim().replace(/^v/, ''), // Remove 'v' prefix
            startDate: new Date($(cells[1]).text().trim()).toISOString(),
            endDate: new Date($(cells[2]).text().trim()).toISOString(),
        });
    });

    if (data.length === 0 || data[0].version || !data[0].startDate || !data[0].endDate) {
        throw new Error(`Invalid data detected. Data:\n\n${JSON.stringify(data)}`);
    }

    await fs.writeFile('browser-agent-eol-policy.json', JSON.stringify(data, null, 2), 'utf8');
    console.log('File written: browser-agent-eol-policy.json');
}

scrapeBrowserAgentData().catch((error) => {
    console.error('Error:', error.message);
    process.exit(1);
});
