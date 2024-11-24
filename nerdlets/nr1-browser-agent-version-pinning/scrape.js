async function scrapeBrowserAgentData() {
    const URL = 'https://docs.newrelic.com/docs/browser/browser-monitoring/getting-started/browser-agent-eol-policy/';

    const response = await fetch(URL);
    if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    const html = await response.text();

    const parser = new DOMParser();
    const document = parser.parseFromString(html, 'text/html');

    const table = document.querySelector('table');

    if (!table) {
        throw new Error('No table found on the page.');
    }

    const rows = table.querySelectorAll('tbody tr');

    return Array.from(rows).map((row) => {
        const cells = row.querySelectorAll('td');

        return {
            version: cells[0]?.textContent.trim(),
            startDate: new Date(cells[1]?.textContent.trim()),
            endDate: new Date(cells[2]?.textContent.trim()),
        };
    });
}

export default scrapeBrowserAgentData;
