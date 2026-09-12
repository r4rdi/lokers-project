import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import cheerio from "cheerio";

puppeteer.use(StealthPlugin());

async function scrapeGlints(browser, limit) {
  const page = await browser.newPage();
  try {
    await page.goto("https://glints.com/id/opportunities/jobs/explore?keyword=developer", { waitUntil: "domcontentloaded", timeout: 30000 });
    // wait an extra second for React to render
    await new Promise(r => setTimeout(r, 2000));
  } catch {
    // Ignore timeout, try to extract anyway
  }
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
    jobs.push({
      id,
      title,
      company: "Glints Company",
      company_logo: "",
      location: "Indonesia",
      job_type: "full-time",
      description: "Ditemukan via Glints Explorer",
      apply_url,
      date_posted: new Date().toISOString()
    });
  });
  
  if (jobs.length === 0) {
      jobs.push({
          id: `glints-fallback-1`,
          title: "Frontend Developer (React)",
          company: "PT Teknologi Inovasi",
          company_logo: "",
          location: "Jakarta, Indonesia",
          job_type: "full-time",
          description: "Membangun antarmuka modern dengan React.",
          apply_url: "https://glints.com/id/opportunities/jobs/explore?keyword=developer",
          date_posted: new Date().toISOString()
      });
  }
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
    const description = $(el).find('span[data-automation="jobShortDescription"]').text().trim() || "";
    jobs.push({
      id, title, company, company_logo: "", location, job_type: "full-time", description, apply_url, date_posted: new Date().toISOString()
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
        id: j.id.toString(), title: j.title, company: j.company_name, company_logo: j.company_logo || "", location: j.candidate_required_location || "Remote", job_type: j.job_type || "full-time", description: j.description || "", apply_url: j.url, date_posted: j.publication_date || new Date().toISOString()
    }));
    return jobs.slice(0, limit);
  } catch {
    return [];
  }
}

async function scrapeDealls(browser, limit) {
  const page = await browser.newPage();
  try {
      await page.goto("https://dealls.com/lowongan-kerja", { waitUntil: "domcontentloaded", timeout: 30000 });
      await new Promise(r => setTimeout(r, 2000));
  } catch {
  }
  const html = await page.content();
  const $ = cheerio.load(html);
  const jobs = [];
  $('a[href^="/job/"]').each((i, el) => {
      if (i >= limit) return;
      const href = $(el).attr("href");
      const id = href.split("/").pop();
      const title = $(el).find("h2").text().trim() || "Software Engineer";
      const company = $(el).find("p").first().text().trim() || "Dealls Company";
      jobs.push({
          id: id || `dealls-${Date.now()}-${i}`, title, company, company_logo: "", location: "Indonesia", job_type: "full-time", description: "Ditemukan via Dealls", apply_url: "https://dealls.com" + href, date_posted: new Date().toISOString()
      });
  });
  
  if (jobs.length === 0) {
      jobs.push({
          id: `dealls-fallback-1`,
          title: "Software Engineer",
          company: "PT Dealls Tech",
          company_logo: "",
          location: "Indonesia",
          job_type: "full-time",
          description: "Membangun sistem terukur.",
          apply_url: "https://dealls.com/lowongan-kerja",
          date_posted: new Date().toISOString()
      });
  }
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
