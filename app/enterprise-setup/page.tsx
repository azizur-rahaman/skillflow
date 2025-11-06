import { EnterpriseSetupProvider } from "@/features/enterprise-setup/context";
import { EnterpriseSetupWizard } from "@/features/enterprise-setup/presentation";

export const dynamic = "force-dynamic";

export default function EnterpriseSetupPage() {
  return (
    <EnterpriseSetupProvider>
      <EnterpriseSetupWizard />
    </EnterpriseSetupProvider>
  );
}
