"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Download, FileText } from "lucide-react"
import { useState } from "react"
import React from "react"

interface ExampleResumeProps {
  jobTitle: string
  company: string
  keywords: string[]
  problems: Array<{ title: string; description: string }>
  resumeText?: string // Original resume text for reference
}

export default function ExampleResume({ jobTitle, company, keywords, problems, resumeText = "" }: ExampleResumeProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  // Reset expanded state when resumeText changes
  React.useEffect(() => {
    setIsExpanded(false)
  }, [resumeText])

  // Extract information from the original resume if available
  const extractResumeInfo = () => {
    if (!resumeText) return null

    // Try to extract name
    const nameMatch = resumeText.match(/^([A-Z][a-z]+\s+[A-Z][a-z]+)/m)
    const name = nameMatch ? nameMatch[1] : "Jane Smith"

    // Try to extract contact info
    const emailMatch = resumeText.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/)
    const email = emailMatch ? emailMatch[0] : "jane.smith@email.com"

    // Simplified phone number regex that just looks for digits
    const phoneMatch = resumeText.match(/\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/)
    const phone = phoneMatch ? phoneMatch[0] : "(555) 123-4567"

    // Try to extract location
    const locationMatch = resumeText.match(/([A-Za-z]+,\s*[A-Z]{2})/)
    const location = locationMatch ? locationMatch[1] : "San Francisco, CA"

    // Try to extract education
    const educationMatch = resumeText.match(
      /(Bachelor|Master|PhD|BS|MS|BA|MBA|Doctorate)(\s+of\s+|\s+in\s+|\s+)([A-Za-z\s]+)/i,
    )
    const education = educationMatch
      ? `${educationMatch[1]} of ${educationMatch[3]}`
      : "Bachelor of Science in Computer Science"

    // Try to extract current job title
    const currentTitleMatch = resumeText.match(
      /(Senior|Lead|Principal|Staff)?\s*([A-Za-z\s]+)(Engineer|Developer|Manager|Director|Specialist|Analyst)/i,
    )
    const currentTitle = currentTitleMatch ? currentTitleMatch[0] : "Senior Developer"

    // Try to extract current company
    const currentCompanyMatch = resumeText.match(/at\s+([A-Za-z0-9\s&.-]+)/i)
    const currentCompany = currentCompanyMatch ? currentCompanyMatch[1] : "XYZ Tech Solutions"

    // Try to extract years of experience
    const experienceMatch = resumeText.match(/(\d+)(?:\+)?\s+years?(?:\s+of)?\s+experience/i)
    const yearsOfExperience = experienceMatch ? experienceMatch[1] : "5"

    return {
      name,
      email,
      phone,
      location,
      education,
      currentTitle,
      currentCompany,
      yearsOfExperience,
    }
  }

  // Generate a sample resume based on the job analysis and original resume
  const generateResume = () => {
    // Extract relevant skills from keywords
    const technicalSkills = keywords
      .filter(
        (keyword) =>
          !keyword.includes("Management") && !keyword.includes("Leadership") && !keyword.includes("Communication"),
      )
      .slice(0, 8)

    const softSkills = keywords
      .filter(
        (keyword) =>
          keyword.includes("Management") ||
          keyword.includes("Leadership") ||
          keyword.includes("Communication") ||
          keyword.includes("Collaboration"),
      )
      .slice(0, 4)

    // Create job title variations
    const jobTitleWords = jobTitle.split(/\s+/)
    const baseTitle = jobTitleWords[jobTitleWords.length - 1] // Last word (e.g., "Engineer", "Developer")
    const specialization = jobTitleWords.slice(0, -1).join(" ") // Everything before the last word

    // Extract info from original resume if available
    const resumeInfo = extractResumeInfo()

    // Use extracted info or defaults
    const name = resumeInfo?.name || "JANE SMITH"
    const location = resumeInfo?.location || "San Francisco, CA"
    const phone = resumeInfo?.phone || "(555) 123-4567"
    const email = resumeInfo?.email || "jane.smith@email.com"
    const yearsOfExperience = resumeInfo?.yearsOfExperience || "5"
    const currentTitle = resumeInfo?.currentTitle || `SENIOR ${baseTitle.toUpperCase()}`
    const currentCompany = resumeInfo?.currentCompany || "XYZ Tech Solutions"
    const education = resumeInfo?.education || "Bachelor of Science in Computer Science"

    // Generate resume content
    const resumeContent = `
${name}
${location} | ${phone} | ${email} | linkedin.com/in/${name.toLowerCase().replace(/\s+/g, "")} | github.com/${name.toLowerCase().replace(/\s+/g, "")}

PROFESSIONAL SUMMARY
Results-driven ${jobTitle} with ${yearsOfExperience}+ years of experience delivering high-quality solutions in fast-paced environments. Proven track record of ${problems[0].title.toLowerCase()} and ${problems[1].title.toLowerCase()}. Passionate about ${specialization} technologies and committed to continuous improvement and innovation.

SKILLS
Technical: ${technicalSkills.join(", ")}
Professional: ${softSkills.join(", ")}

PROFESSIONAL EXPERIENCE

${currentTitle}
${currentCompany} | ${location} | January 2020 - Present
• Led the development of a ${technicalSkills[0]} platform that increased system performance by 40% and reduced operational costs by $200K annually
• Implemented ${technicalSkills[1]} solutions to address ${problems[0].title.toLowerCase()}, resulting in a 25% improvement in user satisfaction
• Collaborated with cross-functional teams to deliver ${technicalSkills[2]} features that expanded market reach by 30%
• Mentored junior developers on ${technicalSkills[3]} best practices, improving team productivity by 15%
• Designed and implemented a ${technicalSkills[4]} architecture that scaled to support 2M+ daily active users

${baseTitle.toUpperCase()}
ABC Innovation | ${location} | March 2018 - December 2019
• Developed ${technicalSkills[0]} applications that processed over 1TB of data daily with 99.9% uptime
• Created a ${technicalSkills[5]} framework that reduced development time by 35%
• Collaborated with product managers to prioritize features based on user feedback and business impact
• Implemented automated testing using ${technicalSkills[2]}, increasing code coverage from 65% to 92%
• Participated in code reviews and technical design discussions to ensure high-quality deliverables

JUNIOR ${baseTitle.toUpperCase()}
Tech Startup Inc. | ${location} | June 2016 - February 2018
• Built responsive web applications using ${technicalSkills[1]} and ${technicalSkills[3]}
• Contributed to the development of RESTful APIs using ${technicalSkills[4]}
• Fixed critical bugs that improved application stability by 28%
• Participated in Agile development processes, including daily stand-ups and sprint planning

EDUCATION
${education}
University of California, Berkeley | 2016
• GPA: 3.8/4.0
• Relevant Coursework: Data Structures, Algorithms, Software Engineering, Database Systems

PROJECTS
${specialization} Platform (github.com/${name.toLowerCase().replace(/\s+/g, "")}/${specialization.toLowerCase().replace(/\s+/g, "-")})
• Developed a ${technicalSkills[0]}-based platform that demonstrates ${problems[2].title.toLowerCase()}
• Implemented ${technicalSkills[2]} for real-time data processing and visualization
• Utilized ${technicalSkills[5]} for automated deployment and scaling

CERTIFICATIONS
• ${technicalSkills[0]} Professional Certification
• ${technicalSkills[1]} Developer Certification
`

    return resumeContent
  }

  const resumeContent = generateResume()

  const downloadResume = () => {
    const blob = new Blob([resumeContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `optimized-resume-${jobTitle.replace(/\s+/g, "-").toLowerCase()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="bg-white rounded-lg shadow-lg border-2 border-teal-700 overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-teal-700 to-amber-700 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-bold font-serif">Optimized ATS-Friendly Resume</h3>
              <p className="text-teal-100">
                Tailored for {jobTitle} at {company}
              </p>
            </div>
            <Button
              variant="outline"
              className="bg-white text-teal-900 hover:bg-teal-100 border-none"
              onClick={downloadResume}
            >
              <Download className="mr-2 h-4 w-4" />
              Download Example
            </Button>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <div className="bg-teal-700 p-2 rounded-full text-white mr-3">
                <FileText size={20} />
              </div>
              <h4 className="text-lg font-bold text-teal-900 font-serif">ATS-Optimized Format</h4>
            </div>
            <p className="text-amber-800 mb-4">
              This optimized resume combines elements from your original resume with the job requirements:
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              <li className="flex items-start">
                <div className="text-teal-700 mr-2 mt-1">•</div>
                <p className="text-teal-800">Clean, standard formatting without tables or columns</p>
              </li>
              <li className="flex items-start">
                <div className="text-teal-700 mr-2 mt-1">•</div>
                <p className="text-teal-800">Standard section headings (Experience, Skills, Education)</p>
              </li>
              <li className="flex items-start">
                <div className="text-teal-700 mr-2 mt-1">•</div>
                <p className="text-teal-800">Incorporation of key terms from the job description</p>
              </li>
              <li className="flex items-start">
                <div className="text-teal-700 mr-2 mt-1">•</div>
                <p className="text-teal-800">Quantified achievements with metrics and results</p>
              </li>
              <li className="flex items-start">
                <div className="text-teal-700 mr-2 mt-1">•</div>
                <p className="text-teal-800">Chronological format with most recent experience first</p>
              </li>
              <li className="flex items-start">
                <div className="text-teal-700 mr-2 mt-1">•</div>
                <p className="text-teal-800">Simple text formatting without special characters</p>
              </li>
            </ul>
          </div>

          <Card className="border border-amber-200 p-4 bg-amber-50">
            <div
              className={`font-mono text-sm whitespace-pre-wrap ${!isExpanded ? "max-h-96 overflow-hidden relative" : ""}`}
            >
              {resumeContent}
              {!isExpanded && (
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-amber-50 to-transparent"></div>
              )}
            </div>
            {!isExpanded && (
              <div className="text-center mt-4">
                <Button
                  variant="outline"
                  className="border-amber-300 text-amber-800 hover:bg-amber-100"
                  onClick={() => setIsExpanded(true)}
                >
                  Show Full Resume
                </Button>
              </div>
            )}
          </Card>

          <div className="mt-6 bg-teal-50 p-4 rounded-lg border border-teal-200">
            <h5 className="font-bold text-teal-900 mb-2">How to Use This Example</h5>
            <ul className="space-y-2">
              <li className="flex items-start">
                <div className="text-teal-700 mr-2 mt-1">•</div>
                <p className="text-teal-800">
                  Use this as a template to restructure your resume while keeping your authentic experience
                </p>
              </li>
              <li className="flex items-start">
                <div className="text-teal-700 mr-2 mt-1">•</div>
                <p className="text-teal-800">Incorporate the highlighted keywords naturally throughout your resume</p>
              </li>
              <li className="flex items-start">
                <div className="text-teal-700 mr-2 mt-1">•</div>
                <p className="text-teal-800">
                  Quantify your achievements with specific metrics that demonstrate your impact
                </p>
              </li>
              <li className="flex items-start">
                <div className="text-teal-700 mr-2 mt-1">•</div>
                <p className="text-teal-800">
                  Tailor your professional summary to directly address the main problems this role aims to solve
                </p>
              </li>
              <li className="flex items-start">
                <div className="text-teal-700 mr-2 mt-1">•</div>
                <p className="text-teal-800">
                  Focus on achievements that demonstrate your ability to solve the specific challenges mentioned in the
                  job description
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
