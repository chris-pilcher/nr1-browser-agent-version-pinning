export const scrapeBrowserAgentData = async () => {
    const URL = 'https://docs.newrelic.com/docs/browser/browser-monitoring/getting-started/browser-agent-eol-policy/';

    try {
        const response = await fetch(URL);
        const html = await response.text();

        const parser = new DOMParser();
        const document = parser.parseFromString(html, 'text/html');

        const table = document.querySelector('table');

        if (!table) {
            console.error('No table found on the page.');
            return [];
        }

        const rows = table.querySelectorAll('tbody tr');

        const data = Array.from(rows).map((row) => {
            const cells = row.querySelectorAll('td');

            return {
                version: cells[0]?.textContent.trim(),
                startDate: new Date(cells[1]?.textContent.trim()),
                endDate: new Date(cells[2]?.textContent.trim()),
            };
        });

        return data;
    } catch (error) {
        console.error('Error scraping data:', error);
        return [];
    }
};
