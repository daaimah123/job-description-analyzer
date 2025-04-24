"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Lightbulb, Target, BookOpen, CheckCircle2, Download, Loader2 } from 'lucide-react'
import ResumeAnalysis from "@/components/resume-analysis"
import ExampleResume from "@/components/example-resume"
import { analyzeResume } from "@/lib/resume-analyzer"

interface Problem {
  title: string
  description: string
}

interface Impact {
  title: string
  description: string
}

interface CaseStudy {
  title: string
  description: string
}

interface Action {
  title: string
  description: string
}

interface AnalysisProps {
  analysis: {
    jobTitle: string
    company: string
    problems: Problem[]
    impacts: Impact[]
    caseStudies: CaseStudy[]
    conclusion: string
    actions: Action[]
  }
}

export default function JobAnalysis({ analysis }: AnalysisProps) {
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [resumeText, setResumeText] = useState<string>("")
  const [resumeAnalysis, setResumeAnalysis] = useState<any>(null)
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false)

  const downloadAnalysis = () => {
    // Create text content for the file
    const content = `
Job Description Analysis for ${analysis.jobTitle} at ${analysis.company}

UNDERLYING PROBLEMS TO SOLVE
${analysis.problems.map((p, i) => `${i + 1}. ${p.title}: ${p.description}`).join("\n")}

BUSINESS IMPACT SOUGHT
${analysis.impacts.map((i, idx) => `${idx + 1}. ${i.title}: ${i.description}`).join("\n")}

CASE STUDY SELECTION GUIDANCE
${analysis.caseStudies.map((c, i) => `${i + 1}. ${c.title}: ${c.description}`).join("\n")}

CONCLUSION
${analysis.conclusion}

SUGGESTED ACTIONS
${analysis.actions.map((a, i) => `${i + 1}. ${a.title}: ${a.description}`).join("\n")}
    `

    // Create a Blob with the content as plain text
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)

    // Create a link and trigger download
    const a = document.createElement("a")
    a.href = url
    a.download = `${analysis.jobTitle.replace(/\s+/g, "-").toLowerCase()}-analysis.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      setResumeFile(files[0])
    }
  }

  const handleResumeAnalysis = async () => {
    if (!resumeFile) {
      alert("Please upload a resume file first")
      return
    }

    setIsAnalyzing(true)

    try {
      // Read the file content
      const text = await readFileAsText(resumeFile)
      setResumeText(text)

      // Analyze the resume against the job description
      const result = await analyzeResume(text, analysis)
      setResumeAnalysis(result)
    } catch (error) {
      console.error("Error analyzing resume:", error)
      alert("Error analyzing resume. Please try again with a different file.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Helper function to read file as text
  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          resolve(e.target.result as string)
        } else {
          reject(new Error("Failed to read file"))
        }
      }
      reader.onerror = () => reject(reader.error)
      reader.readAsText(file)
    })
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="bg-white rounded-lg shadow-lg border-2 border-amber-700 overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-amber-700 to-teal-700 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold font-serif">{analysis.jobTitle}</h2>
              <p className="text-amber-100">{analysis.company}</p>
            </div>
            <Button
              variant="outline"
              className="bg-white text-amber-900 hover:bg-amber-100 border-none"
              onClick={downloadAnalysis}
            >
              <Download className="mr-2 h-4 w-4" />
              Download as Text
            </Button>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <div className="bg-amber-700 p-2 rounded-full text-white mr-3">
                <Lightbulb size={24} />
              </div>
              <h3 className="text-xl font-bold text-amber-900 font-serif">Underlying Problems to Solve</h3>
            </div>
            <div className="pl-12 space-y-4">
              {analysis.problems.map((problem, index) => (
                <div key={index} className="border-l-4 border-amber-700 pl-4 py-1">
                  <h4 className="font-bold text-amber-900">{problem.title}</h4>
                  <p className="text-amber-800">{problem.description}</p>
                </div>
              ))}
            </div>
          </div>

          <Separator className="my-8 bg-amber-200" />

          <div className="mb-8">
            <div className="flex items-center mb-4">
              <div className="bg-teal-700 p-2 rounded-full text-white mr-3">
                <Target size={24} />
              </div>
              <h3 className="text-xl font-bold text-teal-900 font-serif">Business Impact Sought</h3>
            </div>
            <div className="pl-12 space-y-4">
              {analysis.impacts.map((impact, index) => (
                <div key={index} className="border-l-4 border-teal-700 pl-4 py-1">
                  <h4 className="font-bold text-teal-900">{impact.title}</h4>
                  <p className="text-teal-800">{impact.description}</p>
                </div>
              ))}
            </div>
          </div>

          <Separator className="my-8 bg-amber-200" />

          <div className="mb-8">
            <div className="flex items-center mb-4">
              <div className="bg-amber-700 p-2 rounded-full text-white mr-3">
                <BookOpen size={24} />
              </div>
              <h3 className="text-xl font-bold text-amber-900 font-serif">Case Study Selection Guidance</h3>
            </div>
            <div className="pl-12 space-y-4">
              {analysis.caseStudies.map((study, index) => (
                <div key={index} className="border-l-4 border-amber-700 pl-4 py-1">
                  <h4 className="font-bold text-amber-900">{study.title}</h4>
                  <p className="text-amber-800">{study.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-amber-50 p-6 rounded-lg border border-amber-200 my-8">
            <p className="text-amber-900 italic">{analysis.conclusion}</p>
          </div>

          <div className="bg-teal-50 p-6 rounded-lg border border-teal-200">
            <h3 className="text-xl font-bold text-teal-900 mb-4 font-serif">Suggested Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analysis.actions.map((action, index) => (
                <Card key={index} className="p-4 border-teal-200 bg-white">
                  <div className="flex items-start">
                    <CheckCircle2 className="text-teal-700 mr-3 mt-1 flex-shrink-0" size={20} />
                    <div>
                      <h4 className="font-bold text-teal-900">{action.title}</h4>
                      <p className="text-teal-800 text-sm">{action.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-12 bg-white rounded-lg shadow-lg border-2 border-teal-700 overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-teal-700 to-amber-700 text-white">
          <h3 className="text-2xl font-bold font-serif">Align Your Story With The Journey</h3>
          <p className="opacity-90">Upload your resume to discover how your path resonates with this opportunity</p>
        </div>

        <div className="p-6">
          <div className="mb-6 text-center">
            <p className="text-amber-800 mb-4">
              Your experiences are sacred stones on your path. Let's see how they align with this new journey.
            </p>
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="resume-upload"
                className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer ${
                  resumeFile ? "bg-teal-50 border-teal-300" : "bg-amber-50 border-amber-300"
                } hover:bg-amber-100`}
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {resumeFile ? (
                    <>
                      <CheckCircle2 className="w-8 h-8 mb-3 text-teal-700" />
                      <p className="mb-2 text-sm text-teal-700">
                        <span className="font-semibold">{resumeFile.name}</span> selected
                      </p>
                      <p className="text-xs text-teal-700">{Math.round(resumeFile.size / 1024)} KB</p>
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-8 h-8 mb-3 text-amber-700"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        ></path>
                      </svg>
                      <p className="mb-2 text-sm text-amber-700">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-amber-700">PDF, DOCX or TXT (MAX. 5MB)</p>
                    </>
                  )}
                </div>
                <input
                  id="resume-upload"
                  type="file"
                  className="hidden"
                  accept=".pdf,.docx,.txt"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>

          <div className="bg-amber-50 p-6 rounded-lg border border-amber-200 mb-6">
            <h4 className="text-lg font-bold text-amber-900 mb-2 font-serif">Wisdom for Your Journey</h4>
            <ul className="space-y-2 text-amber-800">
              <li className="flex items-start">
                <div className="mr-2 mt-1 text-amber-700">•</div>
                <p>
                  <span className="font-bold">Tell your whole story</span> - Beyond what you did, share why you did it
                  and how it created ripples of impact
                </p>
              </li>
              <li className="flex items-start">
                <div className="mr-2 mt-1 text-amber-700">•</div>
                <p>
                  <span className="font-bold">Speak the language</span> - Weave keywords from the job description
                  naturally into your narrative
                </p>
              </li>
              <li className="flex items-start">
                <div className="mr-2 mt-1 text-amber-700">•</div>
                <p>
                  <span className="font-bold">Quantify your journey</span> - Numbers and percentages create anchors for
                  understanding your impact
                </p>
              </li>
              <li className="flex items-start">
                <div className="mr-2 mt-1 text-amber-700">•</div>
                <p>
                  <span className="font-bold">Embrace simplicity</span> - Clean formatting helps both human eyes and
                  digital gatekeepers
                </p>
              </li>
            </ul>
          </div>

          <div className="text-center">
            <Button
              className="bg-teal-700 hover:bg-teal-800 text-white px-8 py-2 rounded-full"
              onClick={handleResumeAnalysis}
              disabled={!resumeFile || isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing Resume...
                </>
              ) : (
                "Analyze My Resume"
              )}
            </Button>
          </div>
        </div>
      </div>

      {resumeAnalysis && (
        <ResumeAnalysis analysis={resumeAnalysis} jobTitle={analysis.jobTitle} company={analysis.company} />
      )}
      {resumeAnalysis && (
        <ExampleResume
          jobTitle={analysis.jobTitle}
          company={analysis.company}
          keywords={[...resumeAnalysis.keywordMatches.matched, ...resumeAnalysis.keywordMatches.missing]}
          problems={analysis.problems}
          resumeText={resumeText}
        />
      )}
    </div>
  )
}
