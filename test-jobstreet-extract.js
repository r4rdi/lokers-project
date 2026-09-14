/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('jobstreet_test.html', 'utf8');
const $ = cheerio.load(html);

const jobs = [];
$('article[data-automation="normalJob"]').each((_, el) => {
    const titleEl = $(el).find('a[data-automation="jobTitle"]');
    const title = titleEl.text().trim();
    const company = $(el).find('a[data-automation="jobCompany"]').text().trim();
    const location = $(el).find('a[data-automation="jobLocation"]').text().trim();

    // Sometimes salary is in a span with text like 'IDR'
    const spans = [];
    $(el).find('span').each((_index, span) => {
      spans.push($(span).text().trim());
    });

    jobs.push({
        title,
        company,
        location,
        spans: spans.filter(s => s && s.length > 2)
    });
});

console.log(JSON.stringify(jobs.slice(0, 3), null, 2));