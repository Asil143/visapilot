import {
  LayoutDashboard,
  Bot,
  FileText,
  Users,
  Calendar,
  Settings,
  Bell,
  FolderOpen,
  Timer,
  BarChart3,
  AlertTriangle,
  Calculator,
  Compass,
  ListChecks,
  ScrollText,
  UserCircle,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  description?: string;
}

export const dashboardNav: NavItem[] = [
  { title: "Home", href: "/dashboard", icon: LayoutDashboard },
  { title: "Profile", href: "/dashboard/profile", icon: UserCircle },
  { title: "Timeline", href: "/dashboard/timeline", icon: Calendar },
  { title: "AI Assistant", href: "/ai-assistant", icon: Bot },
  { title: "Documents", href: "/dashboard/documents", icon: FileText },
  { title: "Cases", href: "/dashboard/cases", icon: FolderOpen },
  { title: "Community", href: "/community", icon: Users },
];

export const toolsNav: NavItem[] = [
  { title: "Visa Path Finder", href: "/visa-finder", icon: Compass, description: "Find pathways worth researching next" },
  { title: "Visa Checklists", href: "/dashboard/tools/checklists", icon: ListChecks, description: "Step-by-step guides for every visa type" },
  { title: "OPT Day Counter", href: "/dashboard/tools/opt-tracker", icon: Timer, description: "Track OPT unemployment days" },
  { title: "Form worksheets", href: "/dashboard/tools/forms", icon: ScrollText, description: "Prepare answers before filing on USCIS.gov" },
  { title: "Visa Bulletin", href: "/dashboard/tools/visa-bulletin", icon: BarChart3, description: "Priority date tracker & wait estimator" },
  { title: "Fee Calculator", href: "/dashboard/tools/fee-calculator", icon: Calculator, description: "Calculate USCIS filing fees" },
  { title: "RFE Assistant", href: "/rfe-assistant", icon: AlertTriangle, description: "Build your RFE response", badge: "Pack" },
];

export const settingsNav: NavItem[] = [
  { title: "Notifications", href: "/dashboard/reminders", icon: Bell     },
  { title: "Settings",      href: "/settings",            icon: Settings },
];

export const visaGuides = [
  { slug: "f1-visa",           title: "F-1 Student Visa",       subtitle: "Entry, maintenance, and status rules",      icon: "🎓", color: "bg-blue-50 text-blue-700"     },
  { slug: "opt-stem-opt",      title: "OPT & STEM OPT",         subtitle: "Work authorization after graduation",       icon: "💼", color: "bg-purple-50 text-purple-700"  },
  { slug: "h1b-visa",          title: "H-1B Work Visa",          subtitle: "Specialty occupation visa guide",           icon: "🏢", color: "bg-green-50 text-green-700"    },
  { slug: "green-card",        title: "Green Card — Employment", subtitle: "EB-1, EB-2 NIW, EB-2, and EB-3 paths",      icon: "🌿", color: "bg-emerald-50 text-emerald-700" },
  { slug: "family-green-card", title: "Green Card — Family",     subtitle: "Petitioning for a spouse, child, or relative", icon: "💗", color: "bg-rose-50 text-rose-700"   },
  { slug: "j1-visa",           title: "J-1 Exchange Visitor",    subtitle: "Exchange programs & two-year bar",         icon: "🌍", color: "bg-orange-50 text-orange-700"  },
  { slug: "travel-advisory",   title: "Travel Advisory",         subtitle: "Safe travel on a visa & re-entry rules",   icon: "✈️", color: "bg-sky-50 text-sky-700"        },
] as const;
