import { EnterpriseSetupProvider } from "@/features/enterprise-setup/context";
import { EnterpriseSetupWizard } from "@/features/enterprise-setup/presentation";

export default function EnterpriseSetupPage() {
  return (
    <EnterpriseSetupProvider>
      <EnterpriseSetupWizard />
    </EnterpriseSetupProvider>
  );
}
