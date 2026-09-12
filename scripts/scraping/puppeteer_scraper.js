const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());
const cheerio = require("cheerio");

async function scrapeGlints(browser, limit) {
  const page = await browser.newPage();
  try {
    await page.goto("https://glints.com/id/opportunities/jobs/explore?keyword=developer", { waitUntil: "networkidle2", timeout: 30000 });
  } catch(e) {}
  await new Promise(r => setTimeout(r, 2000));
  const html = await page.content();
  const $ = cheerio.load(html);
  
  const jobs = [];
  $('div[class*="JobCard"]').each((i, el) => {
    if (i >= limit) return;
    const titleEl = $(el).find('h3, h2, a');
    const title = titleEl.first().text().trim() || "Software Developer";
    let href = $(el).find('a').attr("href") || $(el).closest('a').attr("href");
    const apply_url = href ? (href.startsWith("http") ? href : "https://glints.com" + href) : "https://glints.com/id/opportunities/jobs/explore";
    const id = apply_url.split('/').pop() || `glints-${Date.now()}-${i}`;
    
    const spans = [];
    $(el).find('span').each((_, span) => {
      const txt = $(span).text().trim();
      if(txt) spans.push(txt);
    });

    let salary = null;
    let job_type = "full-time";
    let experience = null;
    let location = "Indonesia";
    let company = "";

    const companyEl = $(el).find('a[class*="Company"], div[class*="Company"], span[class*="Company"]').first();
    company = companyEl.text().trim();
    
    if (!company) {
       const companyLocIndex = spans.findIndex(s => s.includes('Jakarta') || s.includes('Jawa') || s.includes('Bali') || s.includes('Banten'));
       if (companyLocIndex > -1) {
           company = spans[companyLocIndex].split(/(Jakarta|Jawa|Bali|Banten)/)[0];
       } else {
           company = "Perusahaan Dirahasiakan";
       }
    } else {
       const locKeywords = ['Jakarta', 'Jawa', 'Bali', 'Banten', 'Sumatera', 'Kalimantan', 'Sulawesi', 'Kota', 'Kab.'];
       for (const keyword of locKeywords) {
           if (company.includes(keyword) && company.indexOf(keyword) > 3) {
               location = company.substring(company.indexOf(keyword));
               company = company.substring(0, company.indexOf(keyword));
               break;
           }
       }
    }

    spans.forEach(s => {
        if (s.includes('Rp') || s.includes('jt') || s.includes('Gaji Tidak Ditampilkan')) salary = s;
        if (s.toLowerCase().includes('waktu') || s.toLowerCase().includes('kontrak') || s.toLowerCase().includes('freelance') || s.toLowerCase().includes('magang')) job_type = s;
        if (s.toLowerCase().includes('tahun') || s.toLowerCase().includes('pengalaman')) experience = s;
    });

    jobs.push({
      id, title, company: company || "Glints Company", company_logo: "", location: location || "Indonesia", job_type: job_type || "full-time", salary, experience, description: "Ditemukan via Glints Explorer", apply_url, date_posted: new Date().toISOString()
    });
  });
  
  return jobs.slice(0, limit);
}

async function scrapeJobstreet(browser, limit) {
  const page = await browser.newPage();
  await page.goto("https://id.jobstreet.com/id/job-search/software-engineer-jobs", { waitUntil: "domcontentloaded", timeout: 30000 });
  const html = await page.content();
  const $ = cheerio.load(html);
  const jobs = [];
  $('article[data-automation="normalJob"]').each((i, el) => {
    if (i >= limit) return;
    const titleEl = $(el).find('a[data-automation="jobTitle"]');
    const title = titleEl.text().trim();
    const apply_url = "https://id.jobstreet.com" + titleEl.attr("href");
    const idMatch = apply_url.match(/job\/([^?]+)/);
    const id = idMatch ? idMatch[1] : `js-${Date.now()}-${i}`;
    const company = $(el).find('a[data-automation="jobCompany"]').text().trim() || "Perusahaan Dirahasiakan";
    const location = $(el).find('a[data-automation="jobLocation"]').text().trim() || "Indonesia";
    
    let salary = null;
    let job_type = "full-time";
    
    $(el).find('span').each((_, span) => {
      const text = $(span).text().trim();
      if (text.includes('Rp') || text.includes('IDR')) salary = text;
      if (text.toLowerCase().includes('waktu') || text.toLowerCase().includes('kontrak') || text.toLowerCase().includes('full-time') || text.toLowerCase().includes('paruh')) job_type = text;
    });

    const description = $(el).find('span[data-automation="jobShortDescription"]').text().trim() || "";
    jobs.push({
      id, title, company, company_logo: "", location, job_type, salary, experience: null, description, apply_url, date_posted: new Date().toISOString()
    });
  });
  return jobs;
}

async function scrapeRemotive(browser, limit) {
  const page = await browser.newPage();
  await page.goto("https://remotive.com/api/remote-jobs?category=software-dev&limit=" + limit, { waitUntil: "domcontentloaded", timeout: 30000 });
  const content = await page.evaluate(() => document.body.innerText);
  try {
    const data = JSON.parse(content);
    const jobs = (data.jobs || []).map(j => ({
        id: j.id.toString(), title: j.title, company: j.company_name, company_logo: j.company_logo || "", location: j.candidate_required_location || "Remote", job_type: j.job_type || "full-time", salary: j.salary || null, experience: null, description: j.description || "", apply_url: j.url, date_posted: j.publication_date || new Date().toISOString()
    }));
    return jobs.slice(0, limit);
  } catch(e) {
    return [];
  }
}

async function scrapeDealls(browser, limit) {
  const page = await browser.newPage();
  try {
      await page.goto("https://dealls.com/lowongan-kerja", { waitUntil: "domcontentloaded", timeout: 30000 });
      await new Promise(r => setTimeout(r, 2000));
  } catch(e) {}
  const html = await page.content();
  const $ = cheerio.load(html);
  const jobs = [];
  $('a[href^="/job/"]').each((i, el) => {
      if (i >= limit) return;
      const href = $(el).attr("href");
      const id = href.split("/").pop();
      const title = $(el).find("h2").text().trim() || "Software Engineer";
      const company = $(el).find("p").first().text().trim() || "Dealls Company";
      
      let salary = null;
      let job_type = "full-time";
      $(el).find('span, p').each((_, span) => {
        const text = $(span).text().trim();
        if (text.includes('IDR') || text.includes('Rp') || text.includes('Juta')) salary = text;
        if (text.toLowerCase().includes('waktu') || text.toLowerCase().includes('kontrak') || text.toLowerCase().includes('full')) job_type = text;
      });

      jobs.push({
          id: id || `dealls-${Date.now()}-${i}`, title, company, company_logo: "", location: "Indonesia", job_type, salary, experience: null, description: "Ditemukan via Dealls", apply_url: "https://dealls.com" + href, date_posted: new Date().toISOString()
      });
  });
  return jobs;
}

async function main() {
  const source = process.argv[2];
  const limit = parseInt(process.argv[3]) || 5;
  
  if (!["glints", "jobstreet", "remotive", "dealls"].includes(source)) {
    console.error(JSON.stringify({ error: "Invalid source" }));
    process.exit(1);
  }

  let browser;
  try {
    browser = await puppeteer.launch({ 
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    let jobs = [];
    if (source === "glints") jobs = await scrapeGlints(browser, limit);
    if (source === "jobstreet") jobs = await scrapeJobstreet(browser, limit);
    if (source === "remotive") jobs = await scrapeRemotive(browser, limit);
    if (source === "dealls") jobs = await scrapeDealls(browser, limit);
    
    console.log(JSON.stringify(jobs));
  } catch (error) {
    console.error(JSON.stringify({ error: error.message }));
    process.exit(1);
  } finally {
    if (browser) await browser.close();
  }
}

main();
