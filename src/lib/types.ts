export type Role = "Admin" | "Manager" | "Engineer" | "Viewer";

export type FileType = "pdf" | "docx" | "xlsx" | "pptx" | "txt";

export type DocStatus = "uploading" | "processing" | "ready" | "failed";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: Role;
  department: string;
  avatarColor: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  documentCount: number;
  updatedAt: string;
  members: number;
}

export interface DocumentItem {
  id: string;
  name: string;
  type: FileType;
  size: number;
  projectId: string;
  projectName: string;
  uploadedAt: string;
  uploadedBy: string;
  status: DocStatus;
  pages?: number;
}

export interface Citation {
  documentId: string;
  documentName: string;
  page?: number;
  snippet: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
  confidence?: number;
  createdAt: string;
}

export interface ActivityEvent {
  id: string;
  type: "upload" | "chat" | "project" | "member";
  actor: string;
  summary: string;
  at: string;
}
