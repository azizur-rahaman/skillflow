import { DataExportProvider } from "@/features/data-export/context";
import { DataExportDashboard } from "@/features/data-export/presentation";

export default function DataExportPage() {
  return (
    <DataExportProvider>
      <DataExportDashboard />
    </DataExportProvider>
  );
}
