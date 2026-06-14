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
    id: "p-primavera",
    name: "Oracle Primavera",
    description:
      "P6 EPPM & Unifier schedules, baselines and lifecycle workflows for active infrastructure projects.",
    color: "#243a6b",
    documentCount: 42,
    members: 9,
    updatedAt: "2026-06-09T14:20:00Z",
  },
  {
    id: "p-hr",
    name: "HR Connector",
    description:
      "HITS Solutions human-capital data — payroll policies, performance frameworks and onboarding SOPs.",
    color: "#5b6b82",
    documentCount: 18,
    members: 5,
    updatedAt: "2026-06-08T09:05:00Z",
  },
  {
    id: "p-qualisense",
    name: "QualiSense",
    description:
      "Quality assurance, inspection test plans and compliance audit records across site operations.",
    color: "#c8472b",
    documentCount: 27,
    members: 7,
    updatedAt: "2026-06-10T07:42:00Z",
  },
  {
    id: "p-infra",
    name: "Infrastructure Projects",
    description:
      "Cairo, Alamein, Damietta & Ivory Coast civil works — BOQs, BIM 360 models and progress reports.",
    color: "#324a82",
    documentCount: 61,
    members: 14,
    updatedAt: "2026-06-10T06:15:00Z",
  },
  {
    id: "p-client",
    name: "Client Deliverables",
    description:
      "Contracts, handover dossiers and stakeholder correspondence for external client submissions.",
    color: "#444b58",
    documentCount: 33,
    members: 6,
    updatedAt: "2026-06-07T16:30:00Z",
  },
];

export const documents: DocumentItem[] = [
  {
    id: "d-001",
    name: "Alamein Towers — Master Schedule (P6 Baseline).pdf",
    type: "pdf",
    size: 4_820_000,
    projectId: "p-primavera",
    projectName: "Oracle Primavera",
    uploadedAt: "2026-06-09T14:20:00Z",
    uploadedBy: "Mahmoud Elwalid",
    status: "ready",
    pages: 38,
  },
  {
    id: "d-002",
    name: "Infrastructure BOQ — Damietta Port Access.xlsx",
    type: "xlsx",
    size: 1_240_000,
    projectId: "p-infra",
    projectName: "Infrastructure Projects",
    uploadedAt: "2026-06-10T06:15:00Z",
    uploadedBy: "Engineering PMO",
    status: "ready",
    pages: 12,
  },
  {
    id: "d-003",
    name: "QualiSense — Inspection Test Plan Rev.04.docx",
    type: "docx",
    size: 612_000,
    projectId: "p-qualisense",
    projectName: "QualiSense",
    uploadedAt: "2026-06-10T07:42:00Z",
    uploadedBy: "QA Department",
    status: "processing",
    pages: 24,
  },
  {
    id: "d-004",
    name: "HR Onboarding SOP — New Joiners.pptx",
    type: "pptx",
    size: 8_900_000,
    projectId: "p-hr",
    projectName: "HR Connector",
    uploadedAt: "2026-06-08T09:05:00Z",
    uploadedBy: "HITS / HR",
    status: "ready",
    pages: 41,
  },
  {
    id: "d-005",
    name: "Client Handover Dossier — Cairo Metro Phase 3.pdf",
    type: "pdf",
    size: 15_300_000,
    projectId: "p-client",
    projectName: "Client Deliverables",
    uploadedAt: "2026-06-07T16:30:00Z",
    uploadedBy: "Project Director",
    status: "ready",
    pages: 120,
  },
  {
    id: "d-006",
    name: "Cost Estimate — CostOS Export (Ivory Coast).xlsx",
    type: "xlsx",
    size: 2_100_000,
    projectId: "p-infra",
    projectName: "Infrastructure Projects",
    uploadedAt: "2026-06-06T11:10:00Z",
    uploadedBy: "Cost Control",
    status: "ready",
    pages: 8,
  },
  {
    id: "d-007",
    name: "Risk Register — Q2 2026 Programme.docx",
    type: "docx",
    size: 740_000,
    projectId: "p-primavera",
    projectName: "Oracle Primavera",
    uploadedAt: "2026-06-05T13:55:00Z",
    uploadedBy: "PMO Risk",
    status: "ready",
    pages: 16,
  },
  {
    id: "d-008",
    name: "Vendor Registration Policy.txt",
    type: "txt",
    size: 38_000,
    projectId: "p-client",
    projectName: "Client Deliverables",
    uploadedAt: "2026-06-04T10:00:00Z",
    uploadedBy: "Procurement",
    status: "ready",
  },
];

export const activity: ActivityEvent[] = [
  {
    id: "a-1",
    type: "upload",
    actor: "Engineering PMO",
    summary: "uploaded Infrastructure BOQ — Damietta Port Access.xlsx",
    at: "2026-06-10T06:15:00Z",
  },
  {
    id: "a-2",
    type: "chat",
    actor: "QA Department",
    summary: "asked the assistant about ITP acceptance criteria",
    at: "2026-06-10T07:50:00Z",
  },
  {
    id: "a-3",
    type: "project",
    actor: "Mahmoud Elwalid",
    summary: "created project workspace QualiSense",
    at: "2026-06-09T18:02:00Z",
  },
  {
    id: "a-4",
    type: "member",
    actor: "Admin",
    summary: "added 3 engineers to Infrastructure Projects",
    at: "2026-06-09T15:40:00Z",
  },
  {
    id: "a-5",
    type: "upload",
    actor: "Mahmoud Elwalid",
    summary: "uploaded Alamein Towers — Master Schedule (P6 Baseline).pdf",
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
