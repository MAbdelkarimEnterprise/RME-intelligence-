import type {
  Project,
  DocumentItem,
  UserProfile,
  ActivityEvent,
  ChatMessage,
} from "./types";

/**
 * Demo dataset. Used when NEXT_PUBLIC_DEMO_MODE=true (no Supabase keys),
 * so the platform is fully navigable out of the box. Grounded in RME's
 * real digital ecosystem (Oracle ERP, Primavera, CostOS, HITS, BIM 360).
 */

export const currentUser: UserProfile = {
  id: "u-001",
  name: "Mahmoud Elwalid",
  email: "mahmoud.elwalid.mahmoud@gmail.com",
  role: "Admin",
  department: "Digital Transformation",
  avatarColor: "#243a6b",
};

export const projects: Project[] = [
  {
    id: "p-rsm",
    name: "Red Sea Museum Restoration",
    description:
      "Heritage restoration of the Red Sea Museum (Bab Al-Bunt), historic Jeddah — KSA. Drawings, WIRs, IPCs and QA records.",
    color: "#c8102e",
    documentCount: 47,
    members: 11,
    updatedAt: "2026-06-10T07:42:00Z",
  },
  {
    id: "p-damietta",
    name: "Tahya Misr 1 — Damietta Port",
    description:
      "Tahya Misr 1 container terminal at Damietta Port (~$110m). BOQs, civil works, BIM 360 models and progress reports.",
    color: "#243a6b",
    documentCount: 61,
    members: 14,
    updatedAt: "2026-06-10T06:15:00Z",
  },
  {
    id: "p-hsr",
    name: "Egypt High-Speed Railway",
    description:
      "EGP 10bn high-speed rail civil works programme — Primavera P6 schedules, baselines and progress reporting.",
    color: "#1f7a52",
    documentCount: 38,
    members: 16,
    updatedAt: "2026-06-09T14:20:00Z",
  },
  {
    id: "p-dammam",
    name: "Dammam Logistics Zone",
    description:
      "Infrastructure & buildings for the King Abdulaziz Port logistics zone, Dammam — KSA. BOQs, ITPs and compliance records.",
    color: "#324a82",
    documentCount: 33,
    members: 9,
    updatedAt: "2026-06-08T09:05:00Z",
  },
  {
    id: "p-sal",
    name: "SAL Riyadh Logistics Centre",
    description:
      "SAL logistics facilities expansion at King Khalid International Airport, Riyadh — KSA (2026–27). Contracts & handover dossiers.",
    color: "#5c6e88",
    documentCount: 24,
    members: 7,
    updatedAt: "2026-06-07T16:30:00Z",
  },
];

export const documents: DocumentItem[] = [
  {
    id: "d-001",
    name: "Red Sea Museum — Interim Payment Certificate No.16.pdf",
    type: "pdf",
    size: 1_204_000,
    projectId: "p-rsm",
    projectName: "Red Sea Museum Restoration",
    uploadedAt: "2026-06-10T07:42:00Z",
    uploadedBy: "Commercial / QS",
    status: "ready",
    pages: 6,
  },
  {
    id: "d-002",
    name: "Tahya Misr 1 — Container Terminal BOQ.xlsx",
    type: "xlsx",
    size: 1_240_000,
    projectId: "p-damietta",
    projectName: "Tahya Misr 1 — Damietta Port",
    uploadedAt: "2026-06-10T06:15:00Z",
    uploadedBy: "Engineering PMO",
    status: "ready",
    pages: 14,
  },
  {
    id: "d-003",
    name: "Dammam Logistics — Inspection Test Plan Rev.04.docx",
    type: "docx",
    size: 612_000,
    projectId: "p-dammam",
    projectName: "Dammam Logistics Zone",
    uploadedAt: "2026-06-10T07:10:00Z",
    uploadedBy: "QA / QC",
    status: "processing",
    pages: 24,
  },
  {
    id: "d-004",
    name: "Red Sea Museum — Architectural WIR Package (Bab Al-Bunt).pdf",
    type: "pdf",
    size: 8_900_000,
    projectId: "p-rsm",
    projectName: "Red Sea Museum Restoration",
    uploadedAt: "2026-06-08T09:05:00Z",
    uploadedBy: "Site Engineering",
    status: "ready",
    pages: 38,
  },
  {
    id: "d-005",
    name: "SAL Riyadh — Client Handover Dossier (KKIA).pdf",
    type: "pdf",
    size: 15_300_000,
    projectId: "p-sal",
    projectName: "SAL Riyadh Logistics Centre",
    uploadedAt: "2026-06-07T16:30:00Z",
    uploadedBy: "Project Director",
    status: "ready",
    pages: 120,
  },
  {
    id: "d-006",
    name: "Egypt HSR — Master Schedule (P6 Baseline).pdf",
    type: "pdf",
    size: 4_820_000,
    projectId: "p-hsr",
    projectName: "Egypt High-Speed Railway",
    uploadedAt: "2026-06-06T11:10:00Z",
    uploadedBy: "Planning Dept.",
    status: "ready",
    pages: 46,
  },
  {
    id: "d-007",
    name: "Programme Risk Register — Q2 2026.docx",
    type: "docx",
    size: 740_000,
    projectId: "p-hsr",
    projectName: "Egypt High-Speed Railway",
    uploadedAt: "2026-06-05T13:55:00Z",
    uploadedBy: "PMO Risk",
    status: "ready",
    pages: 16,
  },
  {
    id: "d-008",
    name: "Dammam Logistics — Infrastructure & Buildings BOQ.xlsx",
    type: "xlsx",
    size: 964_000,
    projectId: "p-dammam",
    projectName: "Dammam Logistics Zone",
    uploadedAt: "2026-06-04T10:00:00Z",
    uploadedBy: "Cost Control",
    status: "ready",
    pages: 12,
  },
];

export const activity: ActivityEvent[] = [
  {
    id: "a-1",
    type: "upload",
    actor: "Engineering PMO",
    summary: "uploaded Tahya Misr 1 — Container Terminal BOQ.xlsx",
    at: "2026-06-10T06:15:00Z",
  },
  {
    id: "a-2",
    type: "chat",
    actor: "QA / QC",
    summary: "asked the assistant about ITP acceptance criteria (Dammam Logistics)",
    at: "2026-06-10T07:50:00Z",
  },
  {
    id: "a-3",
    type: "project",
    actor: "Mahmoud Elwalid",
    summary: "created project workspace Dammam Logistics Zone",
    at: "2026-06-09T18:02:00Z",
  },
  {
    id: "a-4",
    type: "member",
    actor: "Admin",
    summary: "added 3 engineers to Tahya Misr 1 — Damietta Port",
    at: "2026-06-09T15:40:00Z",
  },
  {
    id: "a-5",
    type: "upload",
    actor: "Commercial / QS",
    summary: "uploaded Red Sea Museum — Interim Payment Certificate No.16.pdf",
    at: "2026-06-09T14:20:00Z",
  },
];

export const sampleConversation: ChatMessage[] = [
  {
    id: "m-1",
    role: "user",
    content: "What are the key deliverables and milestones for the Alamein Towers schedule?",
    createdAt: "2026-06-10T08:00:00Z",
  },
  {
    id: "m-2",
    role: "assistant",
    content:
      "Based on the P6 baseline schedule, the Alamein Towers programme is organised around four key deliverable gates:\n\n- **Substructure completion** — piling, raft and basement works, targeted for end of Q3 2026.\n- **Structural topping-out** — full superstructure to roof level, scheduled mid Q1 2027.\n- **MEP first-fix & façade** — running concurrently from Q4 2026.\n- **Handover & commissioning** — testing, snagging and client handover in Q3 2027.\n\nThe critical path runs through the structural works; any slippage in the topping-out milestone directly affects the handover date.",
    citations: [
      {
        documentId: "d-001",
        documentName: "Alamein Towers — Master Schedule (P6 Baseline).pdf",
        page: 6,
        snippet:
          "Milestone M-04 'Structural Topping-Out' lies on the longest path; total float = 0 days.",
      },
      {
        documentId: "d-001",
        documentName: "Alamein Towers — Master Schedule (P6 Baseline).pdf",
        page: 11,
        snippet: "Handover & commissioning window: 14 Jul 2027 – 28 Sep 2027.",
      },
    ],
    confidence: 0.92,
    createdAt: "2026-06-10T08:00:08Z",
  },
];

export const stats = {
  filesUploaded: 181,
  filesThisWeek: 14,
  conversations: 1_247,
  conversationsThisWeek: 96,
  activeUsers: 38,
  storageUsedGb: 12.4,
  storageQuotaGb: 100,
};

export const departments = [
  "Digital Transformation",
  "PMO",
  "Engineering",
  "Quality (QA/QC)",
  "Cost Control",
  "Procurement",
  "Human Resources",
  "Executive",
];

export const teamMembers: UserProfile[] = [
  currentUser,
  {
    id: "u-002",
    name: "Nour Hassan",
    email: "nour.hassan@rowad-rme.com",
    role: "Manager",
    department: "PMO",
    avatarColor: "#324a82",
  },
  {
    id: "u-003",
    name: "Karim Adel",
    email: "karim.adel@rowad-rme.com",
    role: "Engineer",
    department: "Engineering",
    avatarColor: "#5b6b82",
  },
  {
    id: "u-004",
    name: "Salma Fathy",
    email: "salma.fathy@rowad-rme.com",
    role: "Engineer",
    department: "Quality (QA/QC)",
    avatarColor: "#c8472b",
  },
  {
    id: "u-005",
    name: "Omar Tarek",
    email: "omar.tarek@rowad-rme.com",
    role: "Viewer",
    department: "Cost Control",
    avatarColor: "#444b58",
  },
];
