import * as cheerio from 'cheerio';
import { Parser } from '@/lib/scraper';

/**
 * Parser for LinkedIn job postings
 */
export const linkedinParser: Parser = {
  parse($: cheerio.CheerioAPI, url: string) {
    try {
      // Extract job title
      const jobTitle = $('.top-card-layout__title')
        .first()
        .text()
        .trim();
      
      // Extract company name
      const company = $('.topcard__org-name-link')
        .first()
        .text()
        .trim();
      
      // Extract location
      const location = $('.topcard__flavor--bullet')
        .first()
        .text()
        .trim();
      
      // Extract job description
      const description = $('.description__text')
        .text()
        .trim();
      
      // Extract job details
      const details: Record<string, string> = {};
      $('.description__job-criteria-item').each((i, el) => {
        const label = $(el).find('.description__job-criteria-subheader').text().trim();
        const value = $(el).find('.description__job-criteria-text').text().trim();
        
        if (label && value) {
          details[label.toLowerCase().replace(/\s+/g, '_')] = value;
        }
      });
      
      return {
        jobTitle: jobTitle || 'Unknown Position',
        company: company || 'Unknown Company',
        location: location || 'Unknown Location',
        description,
        details
      };
    } catch (error) {
      console.error('Error parsing LinkedIn job:', error);
      throw new Error('Failed to parse LinkedIn job posting');
    }
  }
};