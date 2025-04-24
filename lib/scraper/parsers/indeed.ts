import * as cheerio from 'cheerio';
import { Parser } from '@/lib/scraper';

/**
 * Parser for Indeed job postings
 */
export const indeedParser: Parser = {
  parse($: cheerio.CheerioAPI, url: string) {
    try {
      // Extract job title
      const jobTitle = $('.jobsearch-JobInfoHeader-title')
        .first()
        .text()
        .trim();
      
      // Extract company name
      const company = $('.jobsearch-InlineCompanyRating-companyName')
        .first()
        .text()
        .trim();
      
      // Extract location
      const location = $('.jobsearch-JobInfoHeader-subtitle .jobsearch-JobInfoHeader-locationName')
        .first()
        .text()
        .trim();
      
      // Extract job description
      const description = $('#jobDescriptionText')
        .text()
        .trim();
      
      // Extract salary if available
      const salary = $('.jobsearch-JobMetadataHeader-item')
        .filter((i, el) => $(el).text().includes('$'))
        .first()
        .text()
        .trim();
      
      // Extract job type
      const jobType = $('.jobsearch-JobMetadataHeader-item')
        .filter((i, el) => $(el).text().includes('time') || $(el).text().includes('contract'))
        .first()
        .text()
        .trim();
      
      return {
        jobTitle: jobTitle || 'Unknown Position',
        company: company || 'Unknown Company',
        location: location || 'Unknown Location',
        description,
        salary: salary || null,
        jobType: jobType || null
      };
    } catch (error) {
      console.error('Error parsing Indeed job:', error);
      throw new Error('Failed to parse Indeed job posting');
    }
  }
};