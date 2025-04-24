// Enhanced analyzer with improved entity recognition for any job board

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

interface JobAnalysis {
  jobTitle: string
  company: string
  problems: Problem[]
  impacts: Impact[]
  caseStudies: CaseStudy[]
  conclusion: string
  actions: Action[]
}

// Enhanced function to extract the job title from text with improved patterns
function extractJobTitle(text: string): string {
  // Common job title patterns - expanded to catch more variations
  const titlePatterns = [
    // Standard job titles with optional seniority and specialization
    /\b(Senior|Lead|Principal|Junior|Associate|Staff|Chief|Head of|Director of)?\s*(Software|Frontend|Backend|Full[ -]Stack|DevOps|Cloud|Mobile|iOS|Android|Web|ML|AI|Data|Product|Project|Program|Technical|Developer|Community)?\s*(Engineer|Developer|Architect|Designer|Manager|Director|Specialist|Consultant|Analyst|Administrator|Coordinator|Lead|Scientist|Evangelist|Advocate|Relations)\b/i,

    // Technical roles
    /\b(Technical|Product|Project|Program)\s*(Manager|Director|Lead|Coordinator|Owner)\b/i,

    // Data science roles
    /\b(Data|Machine Learning|AI|ML|Artificial Intelligence|Business Intelligence)\s*(Scientist|Engineer|Analyst|Architect|Specialist)\b/i,

    // Design roles
    /\b(UX|UI|User Experience|User Interface|Interaction|Visual|Graphic)\s*(Designer|Researcher|Architect|Developer|Lead)\b/i,

    // Developer relations roles
    /\b(DevRel|Developer Relations|Developer Advocate|Technical Evangelist|Community Manager|Developer Experience)\b/i,

    // Content roles
    /\b(Technical|Content|Curriculum|Documentation)\s*(Writer|Author|Editor|Developer|Designer|Specialist|Manager)\b/i,

    // Sales and marketing
    /\b(Sales|Marketing|Business|Account|Customer Success)\s*(Manager|Executive|Representative|Director|Coordinator)\b/i,

    // HR roles
    /\b(HR|Human Resources|Talent|Recruiting|People)\s*(Manager|Specialist|Coordinator|Partner|Director)\b/i,

    // Operations roles
    /\b(Operations|Finance|Legal|Support|IT|Information Technology)\s*(Manager|Specialist|Coordinator|Analyst|Director)\b/i,

    // C-suite
    /\b(CEO|CTO|CIO|CFO|COO|CISO|CMO|CPO)\b/i,

    // Specific tech roles
    /\b(Blockchain|Security|Network|Systems|Database|Frontend|Backend|Full[ -]Stack|Mobile|Cloud|DevOps|SRE|Site Reliability|QA|Quality Assurance|Test)\s*(Engineer|Developer|Architect|Specialist|Analyst|Administrator)\b/i,
  ]

  // Look for job title in common formats across job boards
  const jobTitleSectionPatterns = [
    // Direct job title indicators
    /job title:?\s*([^\n.]+)/i,
    /position:?\s*([^\n.]+)/i,
    /role:?\s*([^\n.]+)/i,
    /title:?\s*([^\n.]+)/i,

    // Job title at beginning of description
    /^([A-Z][A-Za-z0-9\s&-]+?(?:Engineer|Developer|Manager|Director|Specialist|Analyst|Designer|Architect))\s*\n/m,

    // Job title in header format
    /\n\s*([A-Z][A-Za-z0-9\s&-]+?(?:Engineer|Developer|Manager|Director|Specialist|Analyst|Designer|Architect))\s*\n/m,

    // Job title with location
    /([A-Z][A-Za-z0-9\s&-]+?(?:Engineer|Developer|Manager|Director|Specialist|Analyst|Designer|Architect))\s*(?:in|at|for)\s/i,
  ]

  // First try the specific job title patterns
  for (const pattern of titlePatterns) {
    const match = text.match(pattern)
    if (match && match[0] && match[0].length > 3) {
      // Ensure it's not too short
      return match[0].trim()
    }
  }

  // Then try the section patterns
  for (const pattern of jobTitleSectionPatterns) {
    const match = text.match(pattern)
    if (match && match[1] && match[1].trim().length > 3) {
      return match[1].trim()
    }
  }

  // Look for a title-like string at the beginning of the text
  const firstLineMatch = text.split(/\n/)[0].match(/^([A-Z][A-Za-z0-9\s&-]{3,50})$/)
  if (firstLineMatch && firstLineMatch[1]) {
    return firstLineMatch[1].trim()
  }

  return "Position" // Default fallback
}

// Enhanced function to extract the company name from text
function extractCompany(text: string): string {
  // Common company indicators across job boards
  const companyPatterns = [
    // Direct company indicators
    /company:?\s*([A-Z][A-Za-z0-9\s&.-]+?)(?:\.|,|\n|\s\(|\s-)/i,
    /employer:?\s*([A-Z][A-Za-z0-9\s&.-]+?)(?:\.|,|\n|\s\(|\s-)/i,
    /organization:?\s*([A-Z][A-Za-z0-9\s&.-]+?)(?:\.|,|\n|\s\(|\s-)/i,

    // About company sections
    /about\s+([A-Z][A-Za-z0-9\s&.-]+?)(?:\.|,|\n|\s\(|\s-)/i,
    /about\s+the\s+company\s*(?:\n|:)\s*([A-Z][A-Za-z0-9\s&.-]+?)(?:\.|,|\n|\s\(|\s-)/i,

    // Company with job title
    /(?:at|with|for|join)\s+([A-Z][A-Za-z0-9\s&.-]+?)(?:\s+is|\s+as|\s+in|\.|,|\n)/i,

    // Company in header format
    /^([A-Z][A-Za-z0-9\s&.-]+?)(?:\s+is|\s+a|\s+an|\s+-|\s+–|\n)/m,

    // Company with location
    /([A-Z][A-Za-z0-9\s&.-]+?)\s+(?:is\s+located|headquarters|based|located)\s+in/i,

    // Company in parentheses after job title
    /(?:Engineer|Developer|Manager|Director|Specialist|Analyst|Designer|Architect)\s*(?:$$|\[|@)\s*([A-Z][A-Za-z0-9\s&.-]+?)(?:$$|\])/i,
  ]

  // Try each pattern
  for (const pattern of companyPatterns) {
    const match = text.match(pattern)
    if (match && match[1]) {
      const company = match[1].trim()

      // Filter out common non-company words
      const nonCompanyWords = [
        "position",
        "job",
        "role",
        "title",
        "overview",
        "summary",
        "description",
        "responsibilities",
        "requirements",
        "qualifications",
        "about",
        "the",
        "linkedin",
        "indeed",
        "glassdoor",
        "monster",
        "ziprecruiter",
        "dice",
      ]

      if (!nonCompanyWords.some((word) => company.toLowerCase() === word)) {
        return company
      }
    }
  }

  // Look for company in common formats like "Company Name is a leading..."
  const companyDescriptionMatch = text.match(/([A-Z][A-Za-z0-9\s&.-]{2,40}?)\s+is\s+(?:a|an|one|the)/i)
  if (companyDescriptionMatch && companyDescriptionMatch[1]) {
    return companyDescriptionMatch[1].trim()
  }

  // Look for company in "About Us" or similar sections
  const aboutSectionMatch = text.match(
    /(?:About Us|About Our Company|About|Who We Are)(?:\n|:)\s*([A-Z][A-Za-z0-9\s&.-]+?)\s+is/i,
  )
  if (aboutSectionMatch && aboutSectionMatch[1]) {
    return aboutSectionMatch[1].trim()
  }

  return "Organization" // Default fallback
}

// Enhanced function to extract keywords from text
function extractKeywords(text: string): string[] {
  // Expanded list of technical skills and keywords
  const technicalKeywords = [
    // Programming Languages
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
    "Swift",
    "Kotlin",
    "Scala",
    "R",
    "Perl",
    "Haskell",
    "Clojure",
    "Groovy",
    "Dart",
    "Objective-C",
    "Assembly",
    "COBOL",
    "Fortran",
    "MATLAB",
    "Shell",
    "PowerShell",
    "Bash",
    "SQL",
    "PL/SQL",
    "T-SQL",

    // Frontend
    "React",
    "Angular",
    "Vue",
    "Svelte",
    "jQuery",
    "Backbone",
    "Ember",
    "HTML",
    "CSS",
    "SASS",
    "LESS",
    "Bootstrap",
    "Tailwind",
    "Material UI",
    "Chakra UI",
    "Redux",
    "MobX",
    "GraphQL",
    "REST",
    "SOAP",
    "WebSockets",
    "PWA",
    "SPA",
    "SSR",
    "Web Components",
    "WebAssembly",
    "WebGL",
    "Canvas",
    "SVG",
    "D3.js",
    "Three.js",

    // Backend
    "Node.js",
    "Express",
    "Django",
    "Flask",
    "Spring",
    "ASP.NET",
    "Laravel",
    "Ruby on Rails",
    "FastAPI",
    "NestJS",
    "Symfony",
    "CodeIgniter",
    "Phoenix",
    "Play Framework",
    "Gin",
    "Echo",
    "Fiber",
    "Rocket",
    "Actix",
    "Axum",
    "Serverless",
    "Microservices",
    "Monolith",
    "API Gateway",
    "Service Mesh",
    "gRPC",
    "Protocol Buffers",
    "WebRTC",

    // Cloud & DevOps
    "AWS",
    "Azure",
    "GCP",
    "Google Cloud",
    "Cloud",
    "DevOps",
    "CI/CD",
    "Docker",
    "Kubernetes",
    "Terraform",
    "Ansible",
    "Chef",
    "Puppet",
    "Jenkins",
    "GitHub Actions",
    "CircleCI",
    "Travis CI",
    "ArgoCD",
    "Helm",
    "Prometheus",
    "Grafana",
    "ELK Stack",
    "Datadog",
    "New Relic",
    "Splunk",
    "PagerDuty",
    "Infrastructure as Code",
    "GitOps",
    "SRE",
    "Site Reliability Engineering",

    // Databases
    "SQL",
    "NoSQL",
    "MongoDB",
    "PostgreSQL",
    "MySQL",
    "Oracle",
    "SQL Server",
    "SQLite",
    "Redis",
    "Elasticsearch",
    "Cassandra",
    "DynamoDB",
    "Couchbase",
    "Neo4j",
    "MariaDB",
    "Firebase",
    "Supabase",
    "CockroachDB",
    "TimescaleDB",
    "InfluxDB",
    "Snowflake",
    "BigQuery",
    "Redshift",
    "Data Warehouse",
    "Data Lake",
    "ETL",
    "ELT",
    "OLTP",
    "OLAP",

    // AI & Data Science
    "Machine Learning",
    "AI",
    "Deep Learning",
    "NLP",
    "Computer Vision",
    "Data Science",
    "TensorFlow",
    "PyTorch",
    "Keras",
    "scikit-learn",
    "Pandas",
    "NumPy",
    "SciPy",
    "NLTK",
    "spaCy",
    "Hugging Face",
    "Transformers",
    "GPT",
    "BERT",
    "Neural Networks",
    "Reinforcement Learning",
    "Supervised Learning",
    "Unsupervised Learning",
    "Feature Engineering",
    "Data Mining",
    "Big Data",
    "Hadoop",
    "Spark",
    "Databricks",
    "Airflow",
    "Kubeflow",
    "MLOps",
    "Data Engineering",

    // Mobile
    "iOS",
    "Android",
    "React Native",
    "Flutter",
    "Xamarin",
    "Ionic",
    "Cordova",
    "SwiftUI",
    "Jetpack Compose",
    "Kotlin Multiplatform",
    "Mobile Development",
    "App Development",
    "Progressive Web Apps",
    "Responsive Design",
    "Mobile First",
    "Push Notifications",
    "Geolocation",
    "Bluetooth",
    "NFC",

    // Game Development
    "Unity",
    "Unreal Engine",
    "Godot",
    "Game Development",
    "3D Modeling",
    "Animation",
    "Rigging",
    "Texturing",
    "Shaders",
    "Physics Engine",
    "Game AI",
    "Multiplayer",
    "Networking",
    "Game Design",
    "Level Design",
    "Sound Design",

    // Security
    "Cybersecurity",
    "Information Security",
    "Network Security",
    "Application Security",
    "Cloud Security",
    "DevSecOps",
    "Penetration Testing",
    "Vulnerability Assessment",
    "Security Auditing",
    "Encryption",
    "Authentication",
    "Authorization",
    "OAuth",
    "SAML",
    "JWT",
    "SSO",
    "MFA",
    "Biometrics",
    "Compliance",
    "GDPR",
    "HIPAA",
    "PCI DSS",
    "SOC 2",
    "ISO 27001",

    // Blockchain
    "Blockchain",
    "Cryptocurrency",
    "Smart Contracts",
    "Ethereum",
    "Bitcoin",
    "Solidity",
    "Web3",
    "DeFi",
    "NFT",
    "DAO",
    "Consensus Algorithms",
    "Distributed Ledger",
    "Tokenomics",
    "Cryptography",

    // AR/VR
    "AR",
    "VR",
    "XR",
    "Augmented Reality",
    "Virtual Reality",
    "Mixed Reality",
    "Spatial Computing",
    "3D Visualization",
    "Motion Tracking",
    "Haptic Feedback",

    // IoT
    "IoT",
    "Internet of Things",
    "Embedded Systems",
    "Sensors",
    "Actuators",
    "MQTT",
    "CoAP",
    "Zigbee",
    "Z-Wave",
    "Bluetooth LE",
    "Edge Computing",
    "Fog Computing",

    // Methodologies & Practices
    "Agile",
    "Scrum",
    "Kanban",
    "Waterfall",
    "Lean",
    "XP",
    "DevOps",
    "CI/CD",
    "TDD",
    "BDD",
    "DDD",
    "SOLID",
    "Design Patterns",
    "Microservices",
    "Monolith",
    "SOA",
    "Event-Driven Architecture",
    "Hexagonal Architecture",
    "Clean Architecture",
    "Serverless Architecture",

    // Project & Product Management
    "Project Management",
    "Product Management",
    "Agile",
    "Scrum",
    "Kanban",
    "JIRA",
    "Confluence",
    "Trello",
    "Asana",
    "Monday",
    "ClickUp",
    "Notion",
    "Product Owner",
    "Scrum Master",
    "Sprint Planning",
    "Backlog Grooming",
    "User Stories",
    "Acceptance Criteria",
    "Roadmap",
    "Release Planning",
    "Feature Prioritization",
    "A/B Testing",
    "User Research",
    "Market Research",
    "Competitive Analysis",
    "Go-to-Market Strategy",

    // Design
    "UX",
    "UI",
    "User Experience",
    "User Interface",
    "Interaction Design",
    "Visual Design",
    "Graphic Design",
    "Web Design",
    "Mobile Design",
    "Responsive Design",
    "Wireframing",
    "Prototyping",
    "Mockups",
    "User Research",
    "Usability Testing",
    "Information Architecture",
    "Accessibility",
    "WCAG",
    "ADA Compliance",
    "Design Systems",
    "Design Thinking",
    "Figma",
    "Sketch",
    "Adobe XD",
    "InVision",
    "Zeplin",
    "Photoshop",
    "Illustrator",

    // Soft Skills & General
    "Leadership",
    "Management",
    "Strategy",
    "Communication",
    "Collaboration",
    "Problem-solving",
    "Critical Thinking",
    "Analytical Skills",
    "Innovation",
    "Creativity",
    "Customer-focused",
    "Results-driven",
    "Detail-oriented",
    "Self-motivated",
    "Team Player",
    "Mentoring",
    "Coaching",
    "Public Speaking",
    "Technical Writing",
    "Documentation",
    "Training",
    "Onboarding",
    "Cross-functional Collaboration",
    "Stakeholder Management",
    "Conflict Resolution",
    "Negotiation",
    "Time Management",
    "Prioritization",
    "Decision Making",

    // Business & Domain Specific
    "Developer Relations",
    "DevRel",
    "Community",
    "Technical Writing",
    "Documentation",
    "Training",
    "Sales",
    "Marketing",
    "Business Development",
    "Customer Success",
    "Support",
    "Operations",
    "Finance",
    "Healthcare",
    "FinTech",
    "EdTech",
    "E-commerce",
    "Retail",
    "Manufacturing",
    "Logistics",
    "Supply Chain",
    "Telecommunications",
    "Media",
    "Entertainment",
    "Gaming",
    "Social Media",
    "Advertising",
    "Real Estate",
    "Energy",
    "Sustainability",
    "Transportation",
    "Automotive",
    "Aerospace",
    "Defense",
    "Government",
    "Non-profit",
    "Legal",
    "Compliance",
    "Regulatory",
    "Risk Management",
    "Insurance",
    "Banking",
    "Investment",
    "Trading",
    "Cryptocurrency",
    "Blockchain",
  ]

  // Extract all words and phrases from the text
  const words = text.split(/[\s,;:.!?()[\]{}'"/\\<>]+/)

  // Find matches with our keyword list (case insensitive)
  const foundKeywords = technicalKeywords.filter((keyword) =>
    words.some((word) => word.toLowerCase() === keyword.toLowerCase()),
  )

  // Look for multi-word phrases
  technicalKeywords.forEach((keyword) => {
    if (keyword.includes(" ") && text.toLowerCase().includes(keyword.toLowerCase())) {
      foundKeywords.push(keyword)
    }
  })

  // Look for common skills patterns
  const skillsPatterns = [
    /required skills:?\s*([\w\s,;.]+?)(?:\n|\.)/i,
    /skills:?\s*([\w\s,;.]+?)(?:\n|\.)/i,
    /requirements:?\s*([\w\s,;.]+?)(?:\n|\.)/i,
    /qualifications:?\s*([\w\s,;.]+?)(?:\n|\.)/i,
    /experience with:?\s*([\w\s,;.]+?)(?:\n|\.)/i,
    /experience in:?\s*([\w\s,;.]+?)(?:\n|\.)/i,
    /proficient in:?\s*([\w\s,;.]+?)(?:\n|\.)/i,
    /knowledge of:?\s*([\w\s,;.]+?)(?:\n|\.)/i,
    /familiarity with:?\s*([\w\s,;.]+?)(?:\n|\.)/i,
  ]

  // Extract skills from patterns
  for (const pattern of skillsPatterns) {
    const match = text.match(pattern)
    if (match && match[1]) {
      const skills = match[1]
        .split(/[,;.]/)
        .map((skill) => skill.trim())
        .filter((skill) => skill.length > 2)
      skills.forEach((skill) => {
        if (!foundKeywords.includes(skill) && skill.length > 2) {
          foundKeywords.push(skill)
        }
      })
    }
  }

  // Remove duplicates and sort by length (longer phrases first)
  return [...new Set(foundKeywords)].sort((a, b) => b.length - a.length)
}

// Generate problems based on job description
function generateProblems(text: string, keywords: string[]): Problem[] {
  const problemTemplates = [
    {
      title: "Technical Expertise Gap",
      description:
        "They need someone with deep knowledge in {keyword1} and {keyword2} to solve complex technical challenges.",
    },
    {
      title: "Cross-Functional Collaboration",
      description:
        "They need someone who can effectively work across teams to align technical implementation with business objectives.",
    },
    {
      title: "Innovation Acceleration",
      description: "They need to accelerate innovation in {keyword1} to stay competitive in a rapidly evolving market.",
    },
    {
      title: "Technical Debt Management",
      description:
        "They need to address accumulated technical debt while continuing to deliver new features and capabilities.",
    },
    {
      title: "Scaling Challenges",
      description:
        "They need to scale their {keyword1} systems to handle growing demand without compromising performance.",
    },
    {
      title: "Knowledge Transfer",
      description:
        "They need someone who can effectively document and share knowledge about {keyword1} across the organization.",
    },
    {
      title: "User Experience Enhancement",
      description:
        "They need to improve the user experience of their products to better meet customer needs and expectations.",
    },
    {
      title: "Process Optimization",
      description:
        "They need to streamline and optimize their development processes to increase efficiency and productivity.",
    },
    {
      title: "Quality Assurance",
      description:
        "They need to enhance testing and quality assurance practices to ensure reliable, high-quality deliverables.",
    },
    {
      title: "Stakeholder Communication",
      description: "They need someone who can effectively communicate technical concepts to diverse stakeholders.",
    },
    {
      title: "Community Engagement",
      description:
        "They need to build and nurture a community of developers and users around their {keyword1} platform.",
    },
    {
      title: "Technical Support Enhancement",
      description: "They need to improve their technical support capabilities to better serve customers and users.",
    },
  ]

  // Select a subset of problems based on the keywords
  const relevantProblems: Problem[] = []
  const usedTemplates = new Set()

  // First, try to use templates with keywords
  for (const keyword of keywords) {
    if (relevantProblems.length >= 6) break

    for (const template of problemTemplates) {
      if (usedTemplates.has(template.title)) continue

      if (template.description.includes("{keyword1}")) {
        const description = template.description
          .replace("{keyword1}", keyword)
          .replace("{keyword2}", keywords[Math.floor(Math.random() * keywords.length)])

        relevantProblems.push({
          title: template.title,
          description: description,
        })

        usedTemplates.add(template.title)
        break
      }
    }
  }

  // Fill in any remaining slots with generic templates
  for (const template of problemTemplates) {
    if (relevantProblems.length >= 6) break
    if (usedTemplates.has(template.title)) continue

    let description = template.description
    if (description.includes("{keyword1}")) {
      description = description
        .replace("{keyword1}", keywords[Math.floor(Math.random() * keywords.length)])
        .replace("{keyword2}", keywords[Math.floor(Math.random() * keywords.length)])
    }

    relevantProblems.push({
      title: template.title,
      description: description,
    })

    usedTemplates.add(template.title)
  }

  return relevantProblems
}

// Generate impacts based on job description
function generateImpacts(text: string, keywords: string[]): Impact[] {
  const impactTemplates = [
    {
      title: "Technical Excellence",
      description: "Elevating the quality and reliability of {keyword1} systems to industry-leading standards.",
    },
    {
      title: "Innovation Acceleration",
      description: "Accelerating the pace of innovation in {keyword1} to create competitive advantages in the market.",
    },
    {
      title: "User Satisfaction",
      description: "Improving user satisfaction and engagement through enhanced product experiences.",
    },
    {
      title: "Operational Efficiency",
      description: "Increasing operational efficiency through optimized processes and automation.",
    },
    {
      title: "Market Expansion",
      description: "Enabling expansion into new markets through scalable and adaptable {keyword1} solutions.",
    },
    {
      title: "Developer Productivity",
      description: "Enhancing developer productivity through improved tools, documentation, and practices.",
    },
    {
      title: "Customer Retention",
      description: "Increasing customer retention through reliable, high-quality technical solutions.",
    },
    {
      title: "Cost Reduction",
      description: "Reducing operational costs through efficient {keyword1} implementation and optimization.",
    },
    {
      title: "Time-to-Market Acceleration",
      description: "Decreasing time-to-market for new features and products through streamlined development processes.",
    },
    {
      title: "Community Growth",
      description: "Growing a vibrant community of developers and users around their {keyword1} ecosystem.",
    },
    {
      title: "Knowledge Sharing",
      description: "Fostering a culture of knowledge sharing and continuous learning across the organization.",
    },
    {
      title: "Strategic Alignment",
      description: "Ensuring technical initiatives directly support and advance key business objectives.",
    },
  ]

  // Select a subset of impacts based on the keywords
  const relevantImpacts: Impact[] = []
  const usedTemplates = new Set()

  // First, try to use templates with keywords
  for (const keyword of keywords) {
    if (relevantImpacts.length >= 6) break

    for (const template of impactTemplates) {
      if (usedTemplates.has(template.title)) continue

      if (template.description.includes("{keyword1}")) {
        const description = template.description.replace("{keyword1}", keyword)

        relevantImpacts.push({
          title: template.title,
          description: description,
        })

        usedTemplates.add(template.title)
        break
      }
    }
  }

  // Fill in any remaining slots with generic templates
  for (const template of impactTemplates) {
    if (relevantImpacts.length >= 6) break
    if (usedTemplates.has(template.title)) continue

    let description = template.description
    if (description.includes("{keyword1}")) {
      description = description.replace("{keyword1}", keywords[Math.floor(Math.random() * keywords.length)])
    }

    relevantImpacts.push({
      title: template.title,
      description: description,
    })

    usedTemplates.add(template.title)
  }

  return relevantImpacts
}

// Generate case study guidance based on job description
function generateCaseStudies(text: string, keywords: string[]): CaseStudy[] {
  const caseStudyTemplates = [
    {
      title: "Technical Problem Solving",
      description:
        "Examples of solving complex technical challenges using {keyword1}, highlighting your approach and results.",
    },
    {
      title: "Project Leadership",
      description:
        "Cases where you led technical projects from inception to completion, demonstrating your planning and execution skills.",
    },
    {
      title: "Cross-Functional Collaboration",
      description: "Situations where you effectively collaborated with diverse teams to deliver integrated solutions.",
    },
    {
      title: "Innovation Implementation",
      description: "Examples of implementing innovative {keyword1} solutions that created significant business value.",
    },
    {
      title: "Performance Optimization",
      description: "Cases where you improved the performance or efficiency of {keyword1} systems or processes.",
    },
    {
      title: "Technical Leadership",
      description: "Demonstrations of providing technical guidance and mentorship to team members.",
    },
    {
      title: "User-Centered Design",
      description: "Examples of creating technical solutions with a strong focus on user needs and experiences.",
    },
    {
      title: "Quality Improvement",
      description: "Cases where you enhanced the quality and reliability of technical deliverables.",
    },
    {
      title: "Stakeholder Management",
      description: "Situations where you effectively managed diverse stakeholders with competing priorities.",
    },
    {
      title: "Technical Communication",
      description: "Examples of clearly communicating complex {keyword1} concepts to different audiences.",
    },
    {
      title: "Community Building",
      description: "Cases where you built or contributed to developer or user communities around technical products.",
    },
    {
      title: "Learning Agility",
      description:
        "Demonstrations of quickly learning and applying new technologies like {keyword1} to solve problems.",
    },
  ]

  // Select a subset of case studies based on the keywords
  const relevantCaseStudies: CaseStudy[] = []
  const usedTemplates = new Set()

  // First, try to use templates with keywords
  for (const keyword of keywords) {
    if (relevantCaseStudies.length >= 8) break

    for (const template of caseStudyTemplates) {
      if (usedTemplates.has(template.title)) continue

      if (template.description.includes("{keyword1}")) {
        const description = template.description.replace("{keyword1}", keyword)

        relevantCaseStudies.push({
          title: template.title,
          description: description,
        })

        usedTemplates.add(template.title)
        break
      }
    }
  }

  // Fill in any remaining slots with generic templates
  for (const template of caseStudyTemplates) {
    if (relevantCaseStudies.length >= 8) break
    if (usedTemplates.has(template.title)) continue

    let description = template.description
    if (description.includes("{keyword1}")) {
      description = description.replace("{keyword1}", keywords[Math.floor(Math.random() * keywords.length)])
    }

    relevantCaseStudies.push({
      title: template.title,
      description: description,
    })

    usedTemplates.add(template.title)
  }

  return relevantCaseStudies
}

// Generate suggested actions based on job description
function generateActions(text: string, keywords: string[]): Action[] {
  const actionTemplates = [
    {
      title: "Create a {keyword1} portfolio",
      description: "Develop a portfolio showcasing your {keyword1} projects and their business impact.",
    },
    {
      title: "Prepare {keyword1} case study",
      description: "Document a detailed case study of how you solved a complex {keyword1} challenge.",
    },
    {
      title: "Highlight {keyword1} expertise",
      description: "Emphasize your experience with {keyword1} in your resume and cover letter.",
    },
    {
      title: "Develop communication strategy",
      description: "Create examples of how you've communicated technical concepts to different audiences.",
    },
    {
      title: "Document leadership approach",
      description: "Outline your approach to leading technical teams or initiatives.",
    },
    {
      title: "Prepare problem-solving framework",
      description: "Develop a framework showing how you approach and solve technical problems.",
    },
    {
      title: "Create collaboration examples",
      description: "Compile examples of successful cross-functional collaboration on technical projects.",
    },
    {
      title: "Outline innovation process",
      description: "Document your process for identifying and implementing innovative solutions.",
    },
    {
      title: "Prepare {keyword1} demonstration",
      description: "Create a brief demonstration of your {keyword1} skills for the interview process.",
    },
    {
      title: "Research company's {keyword1} usage",
      description: "Investigate how the company currently uses {keyword1} to prepare targeted examples.",
    },
  ]

  // Select a subset of actions based on the keywords
  const relevantActions: Action[] = []
  const usedTemplates = new Set()

  // First, try to use templates with keywords
  for (const keyword of keywords) {
    if (relevantActions.length >= 5) break

    for (const template of actionTemplates) {
      if (usedTemplates.has(template.title)) continue

      if (template.title.includes("{keyword1}") || template.description.includes("{keyword1}")) {
        const title = template.title.replace("{keyword1}", keyword)
        const description = template.description.replace("{keyword1}", keyword)

        relevantActions.push({
          title: title,
          description: description,
        })

        usedTemplates.add(template.title)
        break
      }
    }
  }

  // Fill in any remaining slots with generic templates
  for (const template of actionTemplates) {
    if (relevantActions.length >= 5) break
    if (usedTemplates.has(template.title)) continue

    let title = template.title
    let description = template.description

    if (title.includes("{keyword1}") || description.includes("{keyword1}")) {
      const keyword = keywords[Math.floor(Math.random() * keywords.length)]
      title = title.replace("{keyword1}", keyword)
      description = description.replace("{keyword1}", keyword)
    }

    relevantActions.push({
      title: title,
      description: description,
    })

    usedTemplates.add(template.title)
  }

  return relevantActions
}

// Generate conclusion based on job description
function generateConclusion(text: string, keywords: string[]): string {
  const conclusionTemplates = [
    "The ideal candidate will demonstrate both strong {keyword1} expertise and exceptional {keyword2} skills, with the ability to navigate complex organizational dynamics while maintaining focus on delivering business value.",
    "Success in this role requires a combination of deep {keyword1} knowledge and the ability to effectively collaborate across teams to drive {keyword2} initiatives forward.",
    "This position calls for someone who can balance technical excellence in {keyword1} with strong communication skills to ensure alignment between technical implementation and business objectives.",
    "The organization is seeking a candidate who can not only contribute technical expertise in {keyword1} but also help shape the direction of {keyword2} initiatives through thoughtful leadership.",
    "To thrive in this role, you'll need to demonstrate both hands-on experience with {keyword1} and the strategic thinking necessary to align technical solutions with {keyword2} business goals.",
  ]

  // Select a random conclusion template and fill in keywords
  const template = conclusionTemplates[Math.floor(Math.random() * conclusionTemplates.length)]

  return template
    .replace("{keyword1}", keywords[Math.floor(Math.random() * keywords.length)])
    .replace("{keyword2}", keywords[Math.floor(Math.random() * keywords.length)])
}

export async function analyzeJobDescription(text: string): Promise<JobAnalysis> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Extract job title and company
  const jobTitle = extractJobTitle(text)
  const company = extractCompany(text)

  // Extract keywords from the text
  const keywords = extractKeywords(text)

  // Generate analysis components
  const problems = generateProblems(text, keywords)
  const impacts = generateImpacts(text, keywords)
  const caseStudies = generateCaseStudies(text, keywords)
  const conclusion = generateConclusion(text, keywords)
  const actions = generateActions(text, keywords)

  return {
    jobTitle,
    company,
    problems,
    impacts,
    caseStudies,
    conclusion,
    actions,
  }
}
