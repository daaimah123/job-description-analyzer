// Resume analyzer functionality

interface ResumeAnalysis {
    matchScore: number
    keywordMatches: {
      matched: string[]
      missing: string[]
    }
    strengthAreas: string[]
    improvementAreas: string[]
    atsRecommendations: string[]
  }
  
  /**
   * Analyzes a resume against a job description
   * @param resumeText The text content of the resume
   * @param jobAnalysis The job analysis object
   * @returns Resume analysis results
   */
  export async function analyzeResume(resumeText: string, jobAnalysis: any): Promise<ResumeAnalysis> {
    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500))
  
    // Extract keywords from job description
    const jobKeywords = extractKeywords(jobAnalysis)
  
    // Extract keywords from resume
    const resumeKeywords = extractResumeKeywords(resumeText)
  
    // Calculate keyword matches
    const matchedKeywords = jobKeywords.filter((keyword) =>
      resumeKeywords.some(
        (resumeKeyword) =>
          resumeKeyword.toLowerCase().includes(keyword.toLowerCase()) ||
          keyword.toLowerCase().includes(resumeKeyword.toLowerCase()),
      ),
    )
  
    const missingKeywords = jobKeywords.filter(
      (keyword) =>
        !resumeKeywords.some(
          (resumeKeyword) =>
            resumeKeyword.toLowerCase().includes(keyword.toLowerCase()) ||
            keyword.toLowerCase().includes(resumeKeyword.toLowerCase()),
        ),
    )
  
    // Calculate match score (percentage of job keywords found in resume)
    const matchScore = jobKeywords.length > 0 ? Math.round((matchedKeywords.length / jobKeywords.length) * 100) : 0
  
    // Generate strength areas
    const strengthAreas = generateStrengthAreas(matchedKeywords, resumeText, jobAnalysis)
  
    // Generate improvement areas
    const improvementAreas = generateImprovementAreas(missingKeywords, jobAnalysis)
  
    // Generate ATS recommendations
    const atsRecommendations = generateATSRecommendations(resumeText, jobAnalysis)
  
    return {
      matchScore,
      keywordMatches: {
        matched: matchedKeywords,
        missing: missingKeywords,
      },
      strengthAreas,
      improvementAreas,
      atsRecommendations,
    }
  }
  
  // Update the extractKeywords function to use the job analysis data properly
  function extractKeywords(jobAnalysis: any): string[] {
    const keywords: string[] = []
  
    // Extract keywords from job title
    if (jobAnalysis.jobTitle) {
      const titleWords = jobAnalysis.jobTitle.split(/\s+/)
      titleWords.forEach((word: string) => {
        if (isRelevantKeyword(word) && !keywords.includes(word)) {
          keywords.push(word)
        }
      })
    }
  
    // Extract keywords from problems
    if (jobAnalysis.problems && Array.isArray(jobAnalysis.problems)) {
      jobAnalysis.problems.forEach((problem: any) => {
        if (problem.title) {
          const titleWords = problem.title.split(/\s+/)
          titleWords.forEach((word: string) => {
            if (isRelevantKeyword(word) && !keywords.includes(word)) {
              keywords.push(word)
            }
          })
        }
  
        if (problem.description) {
          // Extract technical terms and skills from descriptions
          const technicalTerms = extractTechnicalTerms(problem.description)
          technicalTerms.forEach((term: string) => {
            if (!keywords.includes(term)) {
              keywords.push(term)
            }
          })
        }
      })
    }
  
    // Extract keywords from impacts
    if (jobAnalysis.impacts && Array.isArray(jobAnalysis.impacts)) {
      jobAnalysis.impacts.forEach((impact: any) => {
        if (impact.title) {
          const titleWords = impact.title.split(/\s+/)
          titleWords.forEach((word: string) => {
            if (isRelevantKeyword(word) && !keywords.includes(word)) {
              keywords.push(word)
            }
          })
        }
  
        if (impact.description) {
          // Extract technical terms and skills from descriptions
          const technicalTerms = extractTechnicalTerms(impact.description)
          technicalTerms.forEach((term: string) => {
            if (!keywords.includes(term)) {
              keywords.push(term)
            }
          })
        }
      })
    }
  
    return keywords
  }
  
  /**
   * Check if a word is a relevant keyword (not a common word)
   */
  function isRelevantKeyword(word: string): boolean {
    // Remove punctuation
    word = word.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "")
  
    // Ignore common words, short words, and non-alphabetic words
    const commonWords = [
      "the",
      "and",
      "a",
      "an",
      "in",
      "on",
      "at",
      "to",
      "for",
      "with",
      "by",
      "of",
      "from",
      "as",
      "is",
      "are",
      "was",
      "were",
      "be",
      "been",
      "being",
      "have",
      "has",
      "had",
      "do",
      "does",
      "did",
      "will",
      "would",
      "shall",
      "should",
      "may",
      "might",
      "must",
      "can",
      "could",
      "about",
      "across",
      "after",
      "against",
      "among",
      "around",
      "before",
      "behind",
      "below",
      "beneath",
      "beside",
      "between",
      "beyond",
      "during",
      "except",
      "inside",
      "outside",
      "through",
      "toward",
      "under",
      "within",
      "without",
      "you",
      "your",
      "they",
      "their",
      "we",
      "our",
      "i",
      "my",
      "me",
      "he",
      "she",
      "it",
      "its",
      "this",
      "that",
      "these",
      "those",
      "who",
      "whom",
      "whose",
      "which",
      "what",
      "where",
      "when",
      "why",
      "how",
      "all",
      "any",
      "both",
      "each",
      "few",
      "more",
      "most",
      "other",
      "some",
      "such",
      "no",
      "nor",
      "not",
      "only",
      "own",
      "same",
      "so",
      "than",
      "too",
      "very",
      "just",
      "but",
      "if",
      "or",
      "because",
      "while",
      "until",
      "although",
    ]
  
    return word.length > 3 && !commonWords.includes(word.toLowerCase()) && /^[a-zA-Z]+$/.test(word)
  }
  
  /**
   * Extract technical terms and skills from text
   */
  function extractTechnicalTerms(text: string): string[] {
    const technicalTerms: string[] = []
  
    // Common technical skills and terms to look for
    const technicalKeywords = [
      "JavaScript",
      "TypeScript",
      "Python",
      "Java",
      "C#",
      "C++",
      "Ruby",
      "Go",
      "Rust",
      "PHP",
      "React",
      "Angular",
      "Vue",
      "Node.js",
      "Express",
      "Django",
      "Flask",
      "Spring",
      "ASP.NET",
      "AWS",
      "Azure",
      "GCP",
      "Cloud",
      "DevOps",
      "CI/CD",
      "Docker",
      "Kubernetes",
      "Terraform",
      "SQL",
      "NoSQL",
      "MongoDB",
      "PostgreSQL",
      "MySQL",
      "Redis",
      "Elasticsearch",
      "Machine Learning",
      "AI",
      "Deep Learning",
      "Data Science",
      "TensorFlow",
      "PyTorch",
      "Frontend",
      "Backend",
      "Full Stack",
      "Mobile",
      "iOS",
      "Android",
      "React Native",
      "Flutter",
      "Agile",
      "Scrum",
      "Kanban",
      "Project Management",
      "Product Management",
      "UX",
      "UI",
      "User Experience",
      "User Interface",
      "Design",
      "Figma",
      "Sketch",
      "Leadership",
      "Management",
      "Strategy",
      "Communication",
      "Collaboration",
      "API",
      "REST",
      "GraphQL",
      "Microservices",
      "Serverless",
      "Architecture",
      "Testing",
      "QA",
      "TDD",
      "BDD",
      "Automation",
      "Security",
      "Performance",
      "Git",
      "GitHub",
      "GitLab",
      "Bitbucket",
      "Version Control",
      "Analytics",
      "SEO",
      "Marketing",
      "Growth",
      "Sales",
      "Customer Success",
      "Technical Writing",
      "Documentation",
      "Training",
      "Mentoring",
      "Coaching",
      "Blockchain",
      "Cryptocurrency",
      "Smart Contracts",
      "Web3",
      "AR",
      "VR",
      "XR",
      "Augmented Reality",
      "Virtual Reality",
      "IoT",
      "Internet of Things",
      "Embedded Systems",
      "Cybersecurity",
      "Information Security",
      "Network Security",
      "Game Development",
      "Unity",
      "Unreal Engine",
      "Data Analysis",
      "Data Engineering",
      "ETL",
      "Big Data",
      "Hadoop",
      "Spark",
      "Content Management",
      "CMS",
      "WordPress",
      "Drupal",
      "Shopify",
      "E-commerce",
      "Payments",
      "Stripe",
      "PayPal",
      "Fintech",
      "Healthcare",
      "EdTech",
      "PropTech",
      "InsurTech",
      "LegalTech",
      "Sustainability",
      "Green Tech",
      "Clean Energy",
      "Telecommunications",
      "5G",
      "Networking",
      "Protocols",
      "Quantum Computing",
      "Robotics",
      "Automation",
      "RPA",
    ]
  
    // Check for exact matches of technical terms
    for (const term of technicalKeywords) {
      if (text.toLowerCase().includes(term.toLowerCase())) {
        technicalTerms.push(term)
      }
    }
  
    // Look for phrases that might indicate skills or requirements
    const skillPhrases = [
      "experience with",
      "experience in",
      "knowledge of",
      "proficient in",
      "skilled in",
      "expertise in",
      "familiar with",
      "background in",
      "understanding of",
      "ability to",
      "skills in",
      "competency in",
    ]
  
    for (const phrase of skillPhrases) {
      const regex = new RegExp(`${phrase}\\s+([\\w\\s,]+?)(?:\\.|,|;|\\n)`, "gi")
      const matches = text.matchAll(regex)
  
      for (const match of matches) {
        if (match[1]) {
          const skills = match[1].split(/,|\sand\s/).map((s) => s.trim())
          skills.forEach((skill) => {
            if (skill.length > 2 && !technicalTerms.includes(skill)) {
              technicalTerms.push(skill)
            }
          })
        }
      }
    }
  
    return technicalTerms
  }
  
  // Update the extractResumeKeywords function to be more focused
  function extractResumeKeywords(resumeText: string): string[] {
    const resumeKeywords: string[] = []
  
    // Extract technical terms from resume
    const technicalTerms = extractTechnicalTerms(resumeText)
    technicalTerms.forEach((term) => {
      if (!resumeKeywords.includes(term)) {
        resumeKeywords.push(term)
      }
    })
  
    // Look for education keywords
    const educationKeywords = [
      "Bachelor",
      "Master",
      "PhD",
      "Doctorate",
      "BSc",
      "MSc",
      "BA",
      "MA",
      "MBA",
      "Degree",
      "Certificate",
      "Certification",
      "Diploma",
      "Graduate",
      "Undergraduate",
    ]
  
    for (const term of educationKeywords) {
      if (resumeText.toLowerCase().includes(term.toLowerCase())) {
        resumeKeywords.push(term)
      }
    }
  
    // Look for experience level keywords
    const experienceKeywords = [
      "years of experience",
      "year experience",
      "senior",
      "junior",
      "lead",
      "manager",
      "director",
      "head",
      "chief",
      "principal",
      "staff",
      "associate",
    ]
  
    for (const term of experienceKeywords) {
      if (resumeText.toLowerCase().includes(term.toLowerCase())) {
        resumeKeywords.push(term)
      }
    }
  
    return resumeKeywords
  }
  
  /**
   * Check if a word is a potential keyword
   */
  function isKeyword(word: string): boolean {
    // Remove punctuation
    word = word.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "")
  
    // Ignore common words and short words
    const commonWords = [
      "the",
      "and",
      "a",
      "an",
      "in",
      "on",
      "at",
      "to",
      "for",
      "with",
      "by",
      "of",
      "from",
      "as",
      "is",
      "are",
      "was",
      "were",
      "be",
      "been",
      "being",
      "have",
      "has",
      "had",
      "do",
      "does",
      "did",
      "will",
      "would",
      "shall",
      "should",
      "may",
      "might",
      "must",
      "can",
      "could",
    ]
  
    return word.length > 3 && !commonWords.includes(word.toLowerCase())
  }
  
  /**
   * Generate strength areas based on matched keywords
   */
  function generateStrengthAreas(matchedKeywords: string[], resumeText: string, jobAnalysis: any): string[] {
    const strengths: string[] = []
  
    if (matchedKeywords.length >= 3) {
      strengths.push(`Strong alignment with ${matchedKeywords.slice(0, 3).join(", ")} requirements.`)
    }
  
    // Check for experience mentions
    if (resumeText.toLowerCase().includes("experience") && resumeText.toLowerCase().includes("year")) {
      strengths.push("Your experience level appears to match the job requirements.")
    }
  
    // Check for education mentions
    if (
      resumeText.toLowerCase().includes("degree") ||
      resumeText.toLowerCase().includes("bachelor") ||
      resumeText.toLowerCase().includes("master") ||
      resumeText.toLowerCase().includes("phd")
    ) {
      strengths.push("Your educational background is highlighted appropriately.")
    }
  
    // Check for achievements
    if (
      resumeText.toLowerCase().includes("achieve") ||
      resumeText.toLowerCase().includes("award") ||
      resumeText.toLowerCase().includes("recognition")
    ) {
      strengths.push("Your achievements and recognitions stand out positively.")
    }
  
    // Add generic strengths if we don't have enough
    if (strengths.length < 3) {
      strengths.push("Your resume contains relevant industry terminology.")
  
      if (strengths.length < 3) {
        strengths.push("Your skills section aligns with several job requirements.")
      }
    }
  
    return strengths
  }
  
  /**
   * Generate improvement areas based on missing keywords
   */
  function generateImprovementAreas(missingKeywords: string[], jobAnalysis: any): string[] {
    const improvements: string[] = []
  
    if (missingKeywords.length > 0) {
      const keywordsToMention = missingKeywords.slice(0, 3).join(", ")
      improvements.push(`Consider adding keywords like ${keywordsToMention} to better match the job requirements.`)
    }
  
    improvements.push("Quantify your achievements with specific metrics and results to demonstrate impact.")
    improvements.push("Ensure your resume clearly shows the connection between your experience and this specific role.")
    improvements.push("Tailor your professional summary to directly address the core problems this role aims to solve.")
  
    return improvements
  }
  
  /**
   * Generate ATS recommendations
   */
  function generateATSRecommendations(resumeText: string, jobAnalysis: any): string[] {
    const recommendations: string[] = []
  
    // Check resume length
    const wordCount = resumeText.split(/\s+/).length
    if (wordCount > 1000) {
      recommendations.push("Your resume is quite lengthy. Consider condensing it to 1-2 pages for better ATS processing.")
    } else if (wordCount < 300) {
      recommendations.push("Your resume may be too brief. Consider adding more relevant details about your experience.")
    }
  
    // Check for formatting issues
    if (resumeText.includes("•") || resumeText.includes("►") || resumeText.includes("■")) {
      recommendations.push(
        "Some special characters may not parse well in ATS systems. Consider using simple bullet points.",
      )
    }
  
    // Standard recommendations
    recommendations.push(
      "Use standard section headings like 'Experience,' 'Education,' and 'Skills' for better ATS recognition.",
    )
    recommendations.push(
      "Incorporate exact phrases from the job description where they honestly reflect your experience.",
    )
    recommendations.push("Avoid using tables, headers/footers, or complex formatting that may confuse ATS systems.")
  
    return recommendations
  }
  