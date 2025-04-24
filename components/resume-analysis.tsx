"use client"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle2, AlertCircle, ArrowUpRight, FileText } from "lucide-react"

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
                    {analysis.keywordMatches.missing.slice(0, 8).map((keyword, index) => (
                      <Badge key={index} variant="amber" className="bg-amber-100 text-amber-800">
                        {keyword}
                      </Badge>
                    ))}
                    {analysis.keywordMatches.missing.length > 8 && (
                      <Badge variant="outline" className="border-amber-300 text-amber-800">
                        +{analysis.keywordMatches.missing.length - 8} more
                      </Badge>
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
