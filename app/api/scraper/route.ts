import { NextResponse } from 'next/server';
import { scrapeJobDescription } from '@/lib/scraper';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    
    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }
    
    const jobData = await scrapeJobDescription(url);
    return NextResponse.json(jobData);
  } catch (error) {
    console.error('Scraper error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error occurred' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    supportedSites: ['linkedin.com', 'indeed.com', 'glassdoor.com']
  });
}