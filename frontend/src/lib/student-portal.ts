export const studentNavGroups = [
  {
    label: "Core",
    items: [
      { href: "/dashboard", label: "Overview", icon: "dashboard" },
      { href: "/dashboard/browse", label: "Discover", icon: "travel_explore" },
      { href: "/dashboard/applications", label: "Applications", icon: "work_history" },
      { href: "/dashboard/saved", label: "Saved", icon: "bookmark" },
    ],
  },
  {
    label: "Growth",
    items: [
      { href: "/dashboard/recommendations", label: "Matches", icon: "auto_awesome" },
      { href: "/dashboard/resume", label: "Resume Lab", icon: "description" },
      { href: "/dashboard/analytics", label: "Analytics", icon: "insights" },
      { href: "/dashboard/profile", label: "Profile", icon: "person" },
    ],
  },
  {
    label: "Support",
    items: [
      { href: "/dashboard/messages", label: "Messages", icon: "mail" },
      { href: "/dashboard/notifications", label: "Inbox", icon: "notifications" },
      { href: "/dashboard/settings", label: "Settings", icon: "settings" },
      { href: "/dashboard/help", label: "Help", icon: "help" },
    ],
  },
] as const;

export const studentQuickLinks = [
  {
    href: "/dashboard/recommendations",
    title: "Review fresh matches",
    copy: "See AI-ranked roles based on your profile momentum.",
    icon: "bolt",
  },
  {
    href: "/dashboard/resume",
    title: "Tune your resume",
    copy: "Bridge skill gaps before your next application sprint.",
    icon: "edit_note",
  },
  {
    href: "/dashboard/notifications",
    title: "Check recruiter updates",
    copy: "Interview invites and deadlines all land here.",
    icon: "notifications_active",
  },
  {
    href: "/dashboard/messages",
    title: "Reply to employers",
    copy: "Keep conversations moving with recruiters and internship providers.",
    icon: "mail",
  },
] as const;

export const studentSupportLinks = [
  {
    href: "/dashboard/help",
    title: "Student help desk",
    copy: "Get guidance on interviews, profile quality, and support tickets.",
  },
  {
    href: "/dashboard/settings",
    title: "Privacy and preferences",
    copy: "Control visibility, alerts, and how employers can reach you.",
  },
] as const;

export const studentNotificationFeed = [
  {
    title: "Stripe moved your application to technical review",
    detail: "Your latest project work matched the role's backend signals. Prep material is ready.",
    time: "8 min ago",
    tone: "amber",
    ctaLabel: "Open applications",
    ctaHref: "/dashboard/applications",
  },
  {
    title: "Two new product roles unlocked for your profile",
    detail: "Your updated skills increased match quality for product and UX internships.",
    time: "1 hr ago",
    tone: "slate",
    ctaLabel: "View matches",
    ctaHref: "/dashboard/recommendations",
  },
  {
    title: "Profile strength improved after your last edit",
    detail: "Adding measurable outcomes made your profile more discoverable in employer search.",
    time: "Yesterday",
    tone: "emerald",
    ctaLabel: "Open profile",
    ctaHref: "/dashboard/profile",
  },
] as const;

export const studentFaqs = [
  {
    q: "How do I improve my match quality?",
    a: "Complete your headline, add role-specific skills, and tailor your resume before applying to similar openings.",
  },
  {
    q: "Where can I manage interview updates?",
    a: "Use Applications for pipeline status and Notifications for reminders, recruiter notes, and scheduling prompts.",
  },
  {
    q: "Can I control who sees my profile?",
    a: "Yes. Visibility and notification preferences live in Settings so you can tune exposure without leaving the dashboard.",
  },
] as const;

export const studentMessages = [
  {
    id: "meta-recruiter",
    company: "Meta",
    contact: "Sarah Jenkins",
    role: "Software Engineering Co-op",
    preview: "Your profile stood out. Are you free this week for a short screening call?",
    time: "9:12 AM",
    unread: true,
  },
  {
    id: "stripe-team",
    company: "Stripe",
    contact: "Campus Recruiting",
    role: "Software Engineering Intern",
    preview: "We have moved you into the technical interview stage. Please pick a slot.",
    time: "Yesterday",
    unread: true,
  },
  {
    id: "orange-lab",
    company: "Orange",
    contact: "Innovation Lab",
    role: "AI Research Internship",
    preview: "Thanks for your interest. We would love a quick note on your current projects.",
    time: "Tue",
    unread: false,
  },
] as const;

export function getApplicationStageWidth(status: string) {
  if (status === "PENDING") return "28%";
  if (status === "SHORTLISTED") return "64%";
  return "100%";
}

export function getApplicationTone(status: string) {
  if (status === "ACCEPTED") {
    return {
      badge: "bg-emerald-50 text-emerald-700 border-emerald-100",
      label: "Offer secured",
    };
  }
  if (status === "REJECTED") {
    return {
      badge: "bg-rose-50 text-rose-700 border-rose-100",
      label: "Closed",
    };
  }
  if (status === "SHORTLISTED") {
    return {
      badge: "bg-amber-50 text-amber-700 border-amber-100",
      label: "Interviewing",
    };
  }
  return {
    badge: "bg-slate-100 text-slate-700 border-slate-200",
    label: "In review",
  };
}
