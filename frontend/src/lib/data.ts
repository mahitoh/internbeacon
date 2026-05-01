import { Internship, Application } from "@/types";

export const MOCK_INTERNSHIPS: Internship[] = [
  {
    id: "1",
    title: "Full Stack Developer Intern",
    company: "TechNexus",
    location: "Remote",
    description: "Join our dynamic team to build scalable web applications using React and Node.js.",
    requirements: ["Proficiency in JavaScript/TypeScript", "Experience with React", "Understanding of REST APIs"],
    tags: ["React", "Node.js", "TypeScript"],
    postedAt: "2024-03-20",
    duration: "3 Months",
    stipend: "$2000/mo",
  },
  {
    id: "2",
    title: "UI/UX Design Intern",
    company: "CreativeFlow",
    location: "San Francisco, CA",
    description: "Help us design beautiful and intuitive user interfaces for our flagship products.",
    requirements: ["Figma proficiency", "Strong portfolio", "Knowledge of design systems"],
    tags: ["UI/UX", "Figma", "Design"],
    postedAt: "2024-03-18",
    duration: "6 Months",
    stipend: "$2500/mo",
  },
  {
    id: "3",
    title: "Data Science Intern",
    company: "DataViz AI",
    location: "New York, NY",
    description: "Analyze large datasets and build predictive models to drive business insights.",
    requirements: ["Python knowledge", "Statistical analysis Skills", "Experience with Pandas/NumPy"],
    tags: ["Python", "ML", "SQL"],
    postedAt: "2024-03-15",
    duration: "4 Months",
    stipend: "$2200/mo",
  },
  {
    id: "4",
    title: "Marketing Strategy Intern",
    company: "BrandBoost",
    location: "Austin, TX",
    description: "Assist in developing and executing marketing campaigns for global brands.",
    requirements: ["Strong communication", "Social media Savvy", "Analytical mindset"],
    tags: ["Marketing", "SEO", "Content"],
    postedAt: "2024-03-10",
    duration: "3 Months",
    stipend: "$1500/mo",
  },
  {
    id: "5",
    title: "Cybersecurity Analyst Intern",
    company: "ShieldGuard",
    location: "Remote",
    description: "Work with our security team to monitor and protect our infrastructure from threats.",
    requirements: ["Knowledge of networking protocols", "Basic understanding of Linux", "Passion for security"],
    tags: ["Security", "Network", "Linux"],
    postedAt: "2024-03-22",
    duration: "6 Months",
    stipend: "$2300/mo",
  },
  {
    id: "6",
    title: "Product Management Intern",
    company: "InnovaHub",
    location: "Berlin, Germany",
    description: "Collaborate with engineering and design teams to define and launch new features.",
    requirements: ["Strong analytical skills", "Excellent communication", "Problem-solving mindset"],
    tags: ["Product", "Agile", "Strategy"],
    postedAt: "2024-03-21",
    duration: "4 Months",
    stipend: "$2100/mo",
  },
  {
    id: "7",
    title: "Mobile App Developer Intern",
    company: "AppVantage",
    location: "London, UK",
    description: "Develop cross-platform mobile applications using Flutter or React Native.",
    requirements: ["Experience with Flutter/React Native", "Dart/JavaScript knowledge", "UI implementation skills"],
    tags: ["Mobile", "Flutter", "React Native"],
    postedAt: "2024-03-19",
    duration: "3 Months",
    stipend: "$2400/mo",
  },
  {
    id: "8",
    title: "Financial Analyst Intern",
    company: "Global Capital",
    location: "Chicago, IL",
    description: "Support our finance team with market research and financial modeling.",
    requirements: ["Finance or Economics major", "Excel proficiency", "Attention to detail"],
    tags: ["Finance", "Analysis", "Excel"],
    postedAt: "2024-03-17",
    duration: "6 Months",
    stipend: "$2600/mo",
  },
  {
    id: "9",
    title: "Content Marketing Intern",
    company: "StoryWeave",
    location: "Remote",
    description: "Create engaging content for our blog and social media channels to drive traffic.",
    requirements: ["Excellent writing skills", "Creativity", "Knowledge of SEO basics"],
    tags: ["Content", "Writing", "SEO"],
    postedAt: "2024-03-16",
    duration: "3 Months",
    stipend: "$1800/mo",
  },
  {
    id: "10",
    title: "Cloud Engineering Intern",
    company: "SkyScale",
    location: "Seattle, WA",
    description: "Learn to manage and scale cloud infrastructure using AWS and Terraform.",
    requirements: ["Basic AWS knowledge", "Understanding of IaC", "Scripting skills"],
    tags: ["Cloud", "AWS", "Terraform"],
    postedAt: "2024-03-14",
    duration: "4 Months",
    stipend: "$2700/mo",
  },
  {
    id: "11",
    title: "HR Operations Intern",
    company: "PeopleFirst",
    location: "Paris, France",
    description: "Assist with recruitment processes and employee onboarding experiences.",
    requirements: ["Strong interpersonal skills", "Organized", "HR interest"],
    tags: ["HR", "People", "Admin"],
    postedAt: "2024-03-13",
    duration: "6 Months",
    stipend: "$1900/mo",
  },
  {
    id: "12",
    title: "DevOps Intern",
    company: "AutoDeploy",
    location: "Toronto, Canada",
    description: "Optimize CI/CD pipelines and assist in containerization with Docker and K8s.",
    requirements: ["Linux basics", "Docker familiarity", "CI/CD understanding"],
    tags: ["DevOps", "Docker", "CI/CD"],
    postedAt: "2024-03-12",
    duration: "4 Months",
    stipend: "$2500/mo",
  }
];

export const MOCK_APPLICATIONS: Application[] = [
  {
    id: "app_1",
    status: "SHORTLISTED",
    createdAt: "2024-10-15T10:00:00Z",
    updatedAt: "2024-10-20T14:30:00Z",
    offer: {
      id: "1",
      title: "Frontend Engineering Intern",
      location: "Dublin, Ireland (Hybrid)",
      company: {
        user: { name: "Stripe" }
      }
    }
  },
  {
    id: "app_2",
    status: "PENDING",
    createdAt: "2024-10-18T09:15:00Z",
    updatedAt: "2024-10-18T09:15:00Z",
    offer: {
      id: "2",
      title: "UX Design Apprentice",
      location: "San Francisco, USA (Remote)",
      company: {
        user: { name: "Airbnb" }
      }
    }
  },
  {
    id: "app_3",
    status: "ACCEPTED",
    createdAt: "2024-09-25T11:00:00Z",
    updatedAt: "2024-10-05T16:45:00Z",
    offer: {
      id: "3",
      title: "Backend Infrastructure Intern",
      location: "Stockholm, Sweden (On-site)",
      company: {
        user: { name: "Spotify" }
      }
    }
  },
  {
    id: "app_4",
    status: "REJECTED",
    createdAt: "2024-09-10T08:00:00Z",
    updatedAt: "2024-09-20T10:00:00Z",
    offer: {
      id: "4",
      title: "Software Engineer Intern",
      location: "Mountain View, CA",
      company: {
        user: { name: "Google" }
      }
    }
  },
  {
    id: "app_5",
    status: "PENDING",
    createdAt: "2024-10-22T14:00:00Z",
    updatedAt: "2024-10-22T14:00:00Z",
    offer: {
      id: "5",
      title: "Product Management Intern",
      location: "London, UK",
      company: {
        user: { name: "Revolut" }
      }
    }
  }
];

