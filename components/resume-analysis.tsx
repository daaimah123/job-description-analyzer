"use client"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle2, AlertCircle, ArrowUpRight, FileText, Edit3, Zap } from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface ResumeAnalysisProps {
  analysis: {
    matchScore: number
    keywordMatches: {
      matched: string[]
      missing: string[]
    }
    strengthAreas: string[]
    improvementAreas: string[]
    atsRecommendations: string[]
  }
  jobTitle: string
  company: string
}

export default function ResumeAnalysis({ analysis, jobTitle, company }: ResumeAnalysisProps) {
  // Generate specific suggestions based on the analysis
  const generateSpecificSuggestions = () => {
    const suggestions = []

    // Suggestion for professional summary
    suggestions.push({
      title: "Tailor your professional summary",
      description: `Create a targeted summary that specifically mentions your experience with ${
        analysis.keywordMatches.matched.slice(0, 3).join(", ")
      } and how you've addressed challenges similar to what ${company} is facing.`
    })

    // Suggestion for missing keywords
    if (analysis.keywordMatches.missing.length > 0) {
      suggestions.push({
        title: "Incorporate missing keywords",
        description: `Add the following keywords to your resume in context of your actual experience: ${analysis.keywordMatches.missing
          .slice(0, 5)
          .join(", ")}.`
      })
    }

    // Suggestion for quantifying achievements
    suggestions.push({
      title: "Quantify your achievements",
      description: `Add specific metrics to your accomplishments, such as "Increased performance by X%", "Reduced costs by $Y", or "Improved efficiency by Z hours per week".`
    })

    // Suggestion for skills section
    suggestions.push({
      title: "Reorganize your skills section",
      description: `Create a dedicated skills section that groups your abilities into categories like "Technical Skills", "Tools & Platforms", and "Soft Skills" to make them more scannable for ATS.`
    })

    // Suggestion for job title alignment
    suggestions.push({
      title: "Align your job titles",
      description: `Consider adjusting your previous job titles to better align with "${jobTitle}" where truthful and appropriate to improve keyword matching.`
    })

    // Suggestion for bullet point format
    suggestions.push({
      title: "Reformat your bullet points",
      description: `Structure your bullet points using the "Accomplished [X] as measured by [Y] by doing [Z]" format to clearly communicate your impact.`
    })

    return suggestions
  }

  const specificSuggestions = generateSpecificSuggestions()

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="bg-white rounded-lg shadow-lg border-2 border-teal-700 overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-teal-700 to-amber-700 text-white">
          <h3 className="text-2xl font-bold font-serif">Resume Analysis</h3>
          <p className="text-teal-100">
            How your journey aligns with {jobTitle || "Position"} at {company || "Organization"}
          </p>
        </div>

        <div className="p-6">
          <div className="mb-8">
            <h4 className="text-lg font-bold text-teal-900 mb-4 font-serif">Match Score</h4>
            <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
              <div className="flex justify-between mb-2">
                <span className="text-teal-800 font-medium">Alignment with Job Requirements</span>
                <span className="text-teal-900 font-bold">{analysis.matchScore}%</span>
              </div>
              <Progress value={analysis.matchScore} className="h-3 bg-teal-100" />

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="text-sm font-medium text-teal-800 mb-2">Matched Keywords</h5>
                  <div className="flex flex-wrap gap-2">
                    {analysis.keywordMatches.matched.map((keyword, index) => (
                      <Badge key={index} variant="teal" className="bg-teal-100 text-teal-800">
                        {keyword}
                      </Badge>
                    ))}
                    {analysis.keywordMatches.matched.length === 0 && (
                      <span className="text-amber-600 text-sm italic">No direct keyword matches found</span>
                    )}
                  </div>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-amber-800 mb-2">Missing Keywords</h5>
                  <div className="flex flex-wrap gap-2">
                    {analysis.keywordMatches.missing.map((keyword, index) => (
                      <Badge key={index} variant="amber" className="bg-amber-100 text-amber-800">
                        {keyword}
                      </Badge>
                    ))}
                    {analysis.keywordMatches.missing.length === 0 && (
                      <span className="text-teal-600 text-sm italic">No missing keywords found!</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-8 bg-teal-200" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="bg-teal-700 p-2 rounded-full text-white mr-3">
                  <CheckCircle2 size={20} />
                </div>
                <h4 className="text-lg font-bold text-teal-900 font-serif">Strength Areas</h4>
              </div>
              <ul className="space-y-3">
                {analysis.strengthAreas.map((strength, index) => (
                  <li key={index} className="flex items-start">
                    <div className="text-teal-700 mr-2 mt-1">•</div>
                    <p className="text-teal-800">{strength}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="flex items-center mb-4">
                <div className="bg-amber-700 p-2 rounded-full text-white mr-3">
                  <ArrowUpRight size={20} />
                </div>
                <h4 className="text-lg font-bold text-amber-900 font-serif">Improvement Areas</h4>
              </div>
              <ul className="space-y-3">
                {analysis.improvementAreas.map((improvement, index) => (
                  <li key={index} className="flex items-start">
                    <div className="text-amber-700 mr-2 mt-1">•</div>
                    <p className="text-amber-800">{improvement}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Separator className="my-8 bg-teal-200" />

          <div className="mb-8">
            <div className="flex items-center mb-4">
              <div className="bg-amber-700 p-2 rounded-full text-white mr-3">
                <Edit3 size={20} />
              </div>
              <h4 className="text-lg font-bold text-amber-900 font-serif">Specific Improvement Suggestions</h4>
            </div>
            
            <Accordion type="single" collapsible className="bg-amber-50 rounded-lg border border-amber-200">
              {specificSuggestions.map((suggestion, index) => (
                <AccordionItem key={index} value={`suggestion-${index}`} className="border-b border-amber-200 last:border-0">
                  <AccordionTrigger className="px-4 py-3 hover:bg-amber-100 text-amber-900 font-medium">
                    <div className="flex items-center">
                      <Zap className="mr-2 h-4 w-4 text-amber-700" />
                      {suggestion.title}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 py-3 text-amber-800">
                    {suggestion.description}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div>
            <div className="flex items-center mb-4">
              <div className="bg-teal-700 p-2 rounded-full text-white mr-3">
                <FileText size={20} />
              </div>
              <h4 className="text-lg font-bold text-teal-900 font-serif">ATS Optimization Recommendations</h4>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <ul className="space-y-3">
                {analysis.atsRecommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start">
                    <AlertCircle className="text-amber-700 mr-2 mt-1 flex-shrink-0" size={16} />
                    <p className="text-amber-800">{recommendation}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
