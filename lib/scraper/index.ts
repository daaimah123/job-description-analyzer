import axios from 'axios';
import * as cheerio from 'cheerio';
import UserAgent from 'user-agents';
import { linkedinParser } from './parsers/linkedin';
import { indeedParser } from './parsers/indeed';
import { glassdoorParser } from './parsers/glassdoor';

// Define parser interface
export interface Parser {
  parse: (
    $: cheerio.CheerioAPI, 
    url: string
  ) => {
    jobTitle: string;
    company: string;
    location?: string;
    description: string;
    [key: string]: any;
  };
}

// Map of domain to parser
const parsers: Record<string, Parser> = {
  'linkedin.com': linkedinParser,
  'indeed.com': indeedParser,
  'glassdoor.com': glassdoorParser,
};

/**
 * Determines which parser to use based on the URL
 */
function getParserForUrl(url: string): Parser | null {
  try {
    const domain = new URL(url).hostname.replace('www.', '');
    
    for (const [key, parser] of Object.entries(parsers)) {
      if (domain.includes(key)) {
        return parser;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Invalid URL:', url);
    return null;
  }
}

/**
 * Scrapes a job description from a given URL
 */
export async function scrapeJobDescription(url: string) {
  const parser = getParserForUrl(url);
  
  if (!parser) {
    throw new Error('Unsupported job board. Currently supported: ' + Object.keys(parsers).join(', '));
  }
  
  try {
    // Generate a random user agent for each request to avoid detection
    const userAgent = new UserAgent().toString();
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': userAgent,
        'Accept': 'text/html,application/xhtml+xml,application/xml',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
      },
      timeout: 10000, // 10 seconds
      maxRedirects: 5
    });
    
    if (response.status !== 200) {
      throw new Error(`Failed to fetch job posting. Status: ${response.status}`);
    }
    
    const html = response.data;
    const $ = cheerio.load(html);
    
    // Use the appropriate parser to extract job data
    const jobData = parser.parse($, url);
    
    return {
      source: new URL(url).hostname,
      url,
      ...jobData,
      scrapedAt: new Date().toISOString()
    };
  } catch (error: any) {
    if (error.response) {
      throw new Error(`Failed to fetch job posting. Status: ${error.response.status}`);
    } else if (error.request) {
      throw new Error('No response received from job board. The site may be blocking scrapers.');
    }
    throw error;
  }
}