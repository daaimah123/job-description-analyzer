"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Link2, FileText, Send } from 'lucide-react'
import JobAnalysis from "@/components/job-analysis"
import { analyzeJobDescription } from "@/lib/analyzer"

export default function Home() {
  const [jobDescription, setJobDescription] = useState("")
  const [jobUrl, setJobUrl] = useState("")
  const [analysis, setAnalysis] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("text")

  const handleAnalyze = async () => {
    setIsLoading(true)
    try {
      if (activeTab === "text") {
        if (!jobDescription) {
          alert("Please enter a job description")
          setIsLoading(false)
          return
        }
        
        // Analyze the text directly
        const result = await analyzeJobDescription(jobDescription)
        setAnalysis(result)
      } else {
        // URL tab is active
        if (!jobUrl) {
          alert("Please enter a job URL")
          setIsLoading(false)
          return
        }
        
        // First scrape the job description from the URL
        const response = await fetch('/api/scraper', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url: jobUrl }),
        })
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to scrape job description')
        }
        
        const scrapedData = await response.json()
        
        // Then analyze the scraped description
        const result = await analyzeJobDescription(scrapedData.description)
        
        // Merge the scraped metadata with our analysis
        setAnalysis({
          ...result,
          jobTitle: scrapedData.jobTitle || result.jobTitle,
          company: scrapedData.company || result.company,
        })
      }
    } catch (error) {
      console.error("Error analyzing job description:", error)
      alert("Error: " + (error instanceof Error ? error.message : "Unknown error occurred"))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-12 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-24 h-1 bg-amber-800 mx-1"></div>
            <div className="w-24 h-1 bg-teal-700 mx-1"></div>
            <div className="w-24 h-1 bg-amber-800 mx-1"></div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-amber-900 mb-2 font-serif">Career Path Compass</h1>
          <p className="text-lg text-amber-800 max-w-2xl mx-auto">
            Unveil the hidden wisdom in job descriptions and craft your journey with intention and purpose
          </p>
          <div className="flex justify-center mt-4">
            <div className="w-24 h-1 bg-amber-800 mx-1"></div>
            <div className="w-24 h-1 bg-teal-700 mx-1"></div>
            <div className="w-24 h-1 bg-amber-800 mx-1"></div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden border-2 border-amber-700">
          <div className="p-6 bg-gradient-to-r from-amber-700 to-teal-700 text-white">
            <h2 className="text-2xl font-bold font-serif">Job Description Analysis</h2>
            <p className="opacity-90">
              Share the path that calls to you, and receive guidance to illuminate your journey
            </p>
          </div>

          <div className="p-6 bg-white">
            <Tabs defaultValue="text" value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList className="grid grid-cols-2 mb-4 bg-amber-100">
                <TabsTrigger value="text" className="data-[state=active]:bg-amber-700 data-[state=active]:text-white">
                  <FileText className="mr-2 h-4 w-4" />
                  Paste Text
                </TabsTrigger>
                <TabsTrigger value="url" className="data-[state=active]:bg-amber-700 data-[state=active]:text-white">
                  <Link2 className="mr-2 h-4 w-4" />
                  Enter URL
                </TabsTrigger>
              </TabsList>

              <TabsContent value="text" className="mt-0">
                <Textarea
                  placeholder="Paste the job description here..."
                  className="min-h-[200px] border-amber-300 focus:border-amber-500 focus:ring-amber-500"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
              </TabsContent>

              <TabsContent value="url" className="mt-0">
                <Input
                  type="url"
                  placeholder="https://example.com/job-posting"
                  className="border-amber-300 focus:border-amber-500 focus:ring-amber-500"
                  value={jobUrl}
                  onChange={(e) => setJobUrl(e.target.value)}
                />
              </TabsContent>
            </Tabs>

            <div className="flex justify-center">
              <Button
                onClick={handleAnalyze}
                disabled={isLoading}
                className="bg-amber-700 hover:bg-amber-800 text-white px-8 py-2 rounded-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Analyze Job Description
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {analysis && (
          <div className="mt-12 max-w-4xl mx-auto">
            <JobAnalysis analysis={analysis} />
          </div>
        )}

        <footer className="mt-16 text-center text-amber-800 border-t border-amber-200 pt-6">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-1 bg-amber-800 mx-1"></div>
            <div className="w-16 h-1 bg-teal-700 mx-1"></div>
            <div className="w-16 h-1 bg-amber-800 mx-1"></div>
          </div>
          <p>Career Path Compass © {new Date().getFullYear()}</p>
          <p className="text-sm mt-1">Illuminating career journeys through strategic insight</p>
        </footer>
      </div>
    </main>
  )
}