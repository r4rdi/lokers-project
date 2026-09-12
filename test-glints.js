const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('glints_test.html', 'utf8');
const $ = cheerio.load(html);

const jobs = [];
$('div[class*="JobCard"]').each((i, el) => {
    const titleEl = $(el).find('h3, h2, a');
    const title = titleEl.first().text().trim();
    
    let href = $(el).find('a').attr("href") || $(el).closest('a').attr("href");
    const apply_url = href ? (href.startsWith("http") ? href : "https://glints.com" + href) : "";
    
    // Attempt to extract company name
    // Usually company name is near the title, often inside an 'a' tag with class containing 'Company' or just adjacent text
    const companyEl = $(el).find('a[class*="Company"], div[class*="Company"], span[class*="Company"]').first();
    const company = companyEl.text().trim();

    // Extract all text contents of the card to see its structure
    const allText = $(el).text();
    
    // Finding specific spans
    const spans = [];
    $(el).find('span').each((_, span) => {
      spans.push($(span).text().trim());
    });

    jobs.push({
        title,
        company,
        allText: allText.substring(0, 100) + '...',
        spans: spans.filter(s => s)
    });
});

console.log(JSON.stringify(jobs.slice(0, 3), null, 2));
