import { FileText, FileSpreadsheet, Presentation, FileType2, File } from "lucide-react";
import type { FileType } from "@/lib/types";
import { cn } from "@/lib/utils";

const map: Record<
  FileType,
  { Icon: typeof FileText; color: string; bg: string; label: string }
> = {
  pdf: { Icon: FileType2, color: "#c8472b", bg: "#f6e4df", label: "PDF" },
  docx: { Icon: FileText, color: "#243a6b", bg: "#eef1f6", label: "DOC" },
  xlsx: { Icon: FileSpreadsheet, color: "#1f7a52", bg: "#e3f3eb", label: "XLS" },
  pptx: { Icon: Presentation, color: "#b5651d", bg: "#f6ecdf", label: "PPT" },
  txt: { Icon: File, color: "#576070", bg: "#eef0f3", label: "TXT" },
};

export function FileIcon({
  type,
  size = 40,
  className,
}: {
  type: FileType;
  size?: number;
  className?: string;
}) {
  const { Icon, color, bg } = map[type] ?? map.txt;
  return (
    <div
      className={cn("flex shrink-0 items-center justify-center rounded-lg", className)}
      style={{ width: size, height: size, backgroundColor: bg }}
    >
      <Icon style={{ color }} size={size * 0.5} strokeWidth={1.8} />
    </div>
  );
}

export function fileTypeLabel(type: FileType) {
  return (map[type] ?? map.txt).label;
}
