import { DataExportProvider } from "@/features/data-export/context";
import { DataExportDashboard } from "@/features/data-export/presentation";

export default function DataExportPage() {
  return (
    <DataExportProvider>
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <DataExportDashboard />
      </div>
    </DataExportProvider>
  );
}
