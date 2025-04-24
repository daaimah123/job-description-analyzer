import * as cheerio from 'cheerio';
import { Parser } from '@/lib/scraper';

/**
 * Parser for Glassdoor job postings
 */
export const glassdoorParser: Parser = {
  parse($: cheerio.CheerioAPI, url: string) {
    try {
      // Extract job title
      const jobTitle = $('.e1tk4kwz4')
        .first()
        .text()
        .trim();
      
      // Extract company name
      const company = $('.e1tk4kwz5')
        .first()
        .text()
        .trim();
      
      // Extract location
      const location = $('.e1tk4kwz6')
        .first()
        .text()
        .trim();
      
      // Extract job description
      const description = $('.jobDescriptionContent')
        .text()
        .trim();
      
      // Extract salary estimate if available
      const salary = $('.css-1bluz6i')
        .filter((i, el) => $(el).text().includes('$'))
        .first()
        .text()
        .trim();
      
      return {
        jobTitle: jobTitle || 'Unknown Position',
        company: company || 'Unknown Company',
        location: location || 'Unknown Location',
        description,
        salary: salary || null
      };
    } catch (error) {
      console.error('Error parsing Glassdoor job:', error);
      throw new Error('Failed to parse Glassdoor job posting');
    }
  }
};