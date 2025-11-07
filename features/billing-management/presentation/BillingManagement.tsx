import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CreditCard,
  Download,
  CheckCircle,
  AlertCircle,
  Crown,
  Zap,
  Users,
  Database,
  TrendingUp,
  Plus,
  Star,
} from "lucide-react";
import { useBilling } from "../context";
import { BillingPlan } from "../types";
import { Separator } from "@radix-ui/react-select";

export function BillingManagement() {
  const { state, actions } = useBilling();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl border border-indigo-500/20">
              <CreditCard className="w-8 h-8 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Billing & Subscription
              </h1>
              <p className="text-slate-400 mt-2">
                Manage your plan, payments, and billing history
              </p>
            </div>
          </div>
        </div>

        {/* Current Plan & Usage Overview */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <CurrentPlanCard />
          <UsageCard
            title="Team Members"
            current={state.usage?.metrics.users.current || 0}
            limit={state.usage?.metrics.users.limit || 0}
            icon={Users}
            color="indigo"
          />
          <UsageCard
            title="API Calls"
            current={state.usage?.metrics.apiCalls.current || 0}
            limit={state.usage?.metrics.apiCalls.limit || 0}
            icon={Zap}
            color="purple"
          />
          <UsageCard
            title="Storage"
            current={state.usage?.metrics.storage.current || 0}
            limit={state.usage?.metrics.storage.limit || 0}
            icon={Database}
            color="cyan"
            unit="GB"
          />
        </div>

        {/* Pricing Plans */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-white">
              Choose Your Plan
            </h2>
            <p className="text-slate-400 mt-2">
              Upgrade or downgrade your plan at any time
            </p>
          </div>
          <PricingPlansGrid />
        </div>

        {/* Billing History & Payment Methods */}
        <div className="grid gap-6 lg:grid-cols-2">
          <BillingHistoryCard />
          <PaymentMethodsCard />
        </div>

        {/* Modals */}
        <PaymentMethodModal />
        <CancelSubscriptionModal />
        <UpgradePlanModal />
      </div>
    </div>
  );
}

function CurrentPlanCard() {
  const { state, actions } = useBilling();

  if (!state.subscription) return null;

  const { subscription } = state;
  const isCanceled = subscription.cancelAtPeriodEnd;

  return (
    <Card className="bg-slate-800/50 border-slate-700 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-white">
            Current Plan
          </CardTitle>
          <Badge
            variant={isCanceled ? "destructive" : "default"}
            className={
              isCanceled
                ? "bg-red-500/10 text-red-400"
                : "bg-green-500/10 text-green-400"
            }
          >
            {isCanceled ? "Canceling" : "Active"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 rounded-lg">
            <Crown className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white">
              {subscription.plan.name}
            </h3>
            <p className="text-sm text-slate-400">
              ${subscription.amount}/{subscription.billingInterval}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">
              Next billing
            </span>
            <span className="text-white font-medium">
              {subscription.nextBillingDate.toLocaleDateString()}
            </span>
          </div>
          {isCanceled && (
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">
                Access until
              </span>
              <span className="text-white font-medium">
                {subscription.currentPeriodEnd.toLocaleDateString()}
              </span>
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            size="sm"
            onClick={actions.toggleUpgradeModal}
            className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Upgrade
          </Button>
          {!isCanceled && (
            <Button
              size="sm"
              variant="outline"
              onClick={actions.toggleCancelModal}
              className="border-red-800 text-red-400 hover:bg-red-950"
            >
              Cancel
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function UsageCard({
  title,
  current,
  limit,
  icon: Icon,
  color,
  unit = "",
}: {
  title: string;
  current: number;
  limit: number;
  icon: React.ElementType;
  color: "indigo" | "purple" | "cyan";
  unit?: string;
}) {
  const percentage = limit > 0 ? (current / limit) * 100 : 0;
  const colorClasses = {
    indigo: "text-indigo-400",
    purple: "text-purple-400",
    cyan: "text-cyan-400",
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 bg-${color}-500/10 rounded-lg`}>
              <Icon className={`w-5 h-5 ${colorClasses[color]}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400">
                {title}
              </p>
              <p className="text-2xl font-bold text-white">
                {current.toLocaleString()}
                {unit && ` ${unit}`}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <Progress value={percentage} className="h-2" />
          <p className="text-xs text-slate-400 text-right">
            {limit === -1
              ? "Unlimited"
              : `${current.toLocaleString()} / ${limit.toLocaleString()}${unit}`}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function PricingPlansGrid() {
  const { state, actions } = useBilling();

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {state.plans.map((plan) => (
        <PricingPlanCard key={plan.id} plan={plan} />
      ))}
    </div>
  );
}

function PricingPlanCard({ plan }: { plan: BillingPlan }) {
  const { state, actions } = useBilling();
  const isCurrentPlan = state.subscription?.planId === plan.id;
  const isPopular = plan.popular;
  const isRecommended = plan.recommended;

  return (
    <Card
      className={`relative bg-slate-800/50 border-2 transition-all hover:shadow-lg ${
        isCurrentPlan
          ? "border-indigo-400 shadow-lg shadow-indigo-500/10"
          : "border-slate-700 hover:border-slate-600"
      }`}
    >
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1">
            <Star className="w-3 h-3 mr-1" />
            Popular
          </Badge>
        </div>
      )}

      {isRecommended && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-3 py-1">
            <Crown className="w-3 h-3 mr-1" />
            Recommended
          </Badge>
        </div>
      )}

      <CardHeader className="text-center pb-4">
        <CardTitle className="text-xl text-white">
          {plan.name}
        </CardTitle>
        <CardDescription className="text-slate-400">
          {plan.description}
        </CardDescription>
        <div className="mt-4">
          <div className="text-3xl font-bold text-white">
            ${plan.price.monthly}
            <span className="text-lg font-normal text-slate-400">
              /month
            </span>
          </div>
          <div className="text-sm text-slate-400 mt-1">
            or ${plan.price.yearly}/year (save $
            {plan.price.monthly * 12 - plan.price.yearly})
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-3">
          {plan.features.map((feature: string, index: number) => (
            <div key={index} className="flex items-center gap-3">
              <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
              <span className="text-sm text-slate-300">
                {feature}
              </span>
            </div>
          ))}
        </div>

        <Separator />

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Users</span>
            <span className="text-white font-medium">
              {plan.limits.users === -1 ? "Unlimited" : plan.limits.users}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">
              API Calls
            </span>
            <span className="text-white font-medium">
              {plan.limits.apiCalls.toLocaleString()}/mo
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Storage</span>
            <span className="text-white font-medium">
              {plan.limits.storage}GB
            </span>
          </div>
        </div>

        <Button
          className={`w-full ${
            isCurrentPlan
              ? "bg-slate-700 text-slate-300 cursor-not-allowed"
              : "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white"
          }`}
          disabled={isCurrentPlan}
          onClick={() => {
            actions.setSelectedPlan(plan);
            actions.toggleUpgradeModal();
          }}
        >
          {isCurrentPlan ? "Current Plan" : "Choose Plan"}
        </Button>
      </CardContent>
    </Card>
  );
}

function BillingHistoryCard() {
  const { state, actions } = useBilling();

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-xl text-white">
          Billing History
        </CardTitle>
        <CardDescription className="text-slate-400">
          View and download your past invoices
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {state.invoices.slice(0, 5).map((invoice) => (
            <div
              key={invoice.id}
              className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg ${
                    invoice.status === "paid"
                      ? "bg-green-500/10"
                      : invoice.status === "open"
                      ? "bg-yellow-500/10"
                      : "bg-slate-500/10"
                  }`}
                >
                  {invoice.status === "paid" ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : invoice.status === "open" ? (
                    <AlertCircle className="w-4 h-4 text-yellow-400" />
                  ) : (
                    <CreditCard className="w-4 h-4 text-slate-400" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-white">
                    {invoice.description}
                  </p>
                  <p className="text-sm text-slate-400">
                    {invoice.date.toLocaleDateString()} • {invoice.number}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="font-semibold text-white">
                    ${invoice.amount.toFixed(2)}
                  </p>
                  <Badge
                    variant={
                      invoice.status === "paid" ? "default" : "secondary"
                    }
                    className={`text-xs ${
                      invoice.status === "paid"
                        ? "bg-green-500/10 text-green-400"
                        : "bg-yellow-500/10 text-yellow-400"
                    }`}
                  >
                    {invoice.status}
                  </Badge>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => actions.downloadInvoice(invoice.id)}
                  className="text-slate-400 hover:text-white"
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function PaymentMethodsCard() {
  const { state, actions } = useBilling();

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl text-white">
            Payment Methods
          </CardTitle>
          <CardDescription className="text-slate-400">
            Manage your payment methods and billing information
          </CardDescription>
        </div>
        <Button
          onClick={actions.togglePaymentModal}
          className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Method
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {state.paymentMethods.map((method) => (
            <div
              key={method.id}
              className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-700 rounded-lg">
                  <CreditCard className="w-4 h-4 text-slate-400" />
                </div>
                <div>
                  <p className="font-medium text-white">
                    •••• •••• •••• {method.last4}
                  </p>
                  <p className="text-sm text-slate-400">
                    Expires {method.expiryMonth}/{method.expiryYear}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {method.isDefault && (
                  <Badge className="bg-green-500/10 text-green-400 text-xs">
                    Default
                  </Badge>
                )}
                {!method.isDefault && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => actions.setDefaultPaymentMethod(method.id)}
                    className="text-slate-400 hover:text-white text-xs"
                  >
                    Set Default
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function PaymentMethodModal() {
  const { state, actions } = useBilling();
  const [formData, setFormData] = React.useState({
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvc: "",
    name: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await actions.addPaymentMethod({
      type: "card",
      last4: formData.cardNumber.slice(-4),
      brand: "visa", // In real implementation, detect from card number
      expiryMonth: parseInt(formData.expiryMonth),
      expiryYear: parseInt(formData.expiryYear),
    });
    setFormData({
      cardNumber: "",
      expiryMonth: "",
      expiryYear: "",
      cvc: "",
      name: "",
    });
  };

  return (
    <Dialog
      open={state.showPaymentModal}
      onOpenChange={actions.togglePaymentModal}
    >
      <DialogContent className="bg-slate-800 border-slate-700 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">
            Add Payment Method
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Add a new credit or debit card to your account
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="name"
              className="text-slate-300"
            >
              Cardholder Name
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="John Doe"
              className="bg-slate-900 border-slate-700 text-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="cardNumber"
              className="text-slate-300"
            >
              Card Number
            </Label>
            <Input
              id="cardNumber"
              value={formData.cardNumber}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, cardNumber: e.target.value }))
              }
              placeholder="1234 5678 9012 3456"
              className="bg-slate-900 border-slate-700 text-white"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="expiryMonth"
                className="text-slate-300"
              >
                Month
              </Label>
              <Select
                value={formData.expiryMonth}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, expiryMonth: value }))
                }
              >
                <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                  <SelectValue placeholder="MM" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {Array.from({ length: 12 }, (_, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                      {(i + 1).toString().padStart(2, "0")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="expiryYear"
                className="text-slate-300"
              >
                Year
              </Label>
              <Select
                value={formData.expiryYear}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, expiryYear: value }))
                }
              >
                <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                  <SelectValue placeholder="YY" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {Array.from({ length: 10 }, (_, i) => (
                    <SelectItem key={2024 + i} value={(2024 + i).toString()}>
                      {(2024 + i).toString().slice(-2)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="cvc"
                className="text-slate-300"
              >
                CVC
              </Label>
              <Input
                id="cvc"
                value={formData.cvc}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, cvc: e.target.value }))
                }
                placeholder="123"
                className="bg-slate-900 border-slate-700 text-white"
                required
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={actions.togglePaymentModal}
              className="border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white"
              disabled={state.loading}
            >
              {state.loading ? "Adding..." : "Add Card"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function CancelSubscriptionModal() {
  const { state, actions } = useBilling();

  return (
    <Dialog
      open={state.showCancelModal}
      onOpenChange={actions.toggleCancelModal}
    >
      <DialogContent className="bg-slate-800 border-slate-700 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">
            Cancel Subscription
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Are you sure you want to cancel your subscription? You&apos;ll lose
            access at the end of your current billing period.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-red-950/20 border border-red-800 rounded-lg">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <div>
                <p className="font-medium text-red-100">
                  What happens when you cancel?
                </p>
                <ul className="text-sm text-red-300 mt-1 space-y-1">
                  <li>
                    • Access continues until{" "}
                    {state.subscription?.currentPeriodEnd.toLocaleDateString()}
                  </li>
                  <li>• No more charges will be made</li>
                  <li>• You can reactivate anytime before the period ends</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={actions.toggleCancelModal}
            className="border-slate-700 text-slate-300 hover:bg-slate-800"
          >
            Keep Subscription
          </Button>
          <Button
            onClick={actions.cancelSubscription}
            className="bg-red-500 hover:bg-red-600 text-white"
            disabled={state.loading}
          >
            {state.loading ? "Canceling..." : "Cancel Subscription"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function UpgradePlanModal() {
  const { state, actions } = useBilling();
  const [selectedInterval, setSelectedInterval] = React.useState<
    "month" | "year"
  >("month");

  const handleUpgrade = async () => {
    if (state.selectedPlan) {
      await actions.changePlan(state.selectedPlan.id, selectedInterval);
    }
  };

  const selectedPlan = state.selectedPlan || state.subscription?.plan;
  const price = selectedPlan
    ? selectedInterval === "year"
      ? selectedPlan.price.yearly
      : selectedPlan.price.monthly
    : 0;

  return (
    <Dialog
      open={state.showUpgradeModal}
      onOpenChange={actions.toggleUpgradeModal}
    >
      <DialogContent className="bg-slate-800 border-slate-700 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">
            {state.selectedPlan ? "Change Plan" : "Upgrade Plan"}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Choose your billing interval and confirm the change
          </DialogDescription>
        </DialogHeader>

        {selectedPlan && (
          <div className="space-y-6">
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-white">
                    {selectedPlan.name}
                  </h3>
                  <p className="text-sm text-slate-400">
                    {selectedPlan.description}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">
                    ${price}
                  </div>
                  <div className="text-sm text-slate-400">
                    per {selectedInterval}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-slate-300">
                Billing Interval
              </Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setSelectedInterval("month")}
                  className={`p-3 rounded-lg border-2 text-center transition-all ${
                    selectedInterval === "month"
                      ? "border-indigo-500 bg-indigo-950/20"
                      : "border-slate-700 hover:border-slate-600"
                  }`}
                >
                  <div className="font-semibold text-white">
                    Monthly
                  </div>
                  <div className="text-sm text-slate-400">
                    ${selectedPlan.price.monthly}/mo
                  </div>
                </button>
                <button
                  onClick={() => setSelectedInterval("year")}
                  className={`p-3 rounded-lg border-2 text-center transition-all ${
                    selectedInterval === "year"
                      ? "border-indigo-500 bg-indigo-950/20"
                      : "border-slate-700 hover:border-slate-600"
                  }`}
                >
                  <div className="font-semibold text-white">
                    Yearly
                  </div>
                  <div className="text-sm text-slate-400">
                    ${selectedPlan.price.yearly}/yr
                    <span className="text-green-400 text-xs block">
                      Save $
                      {selectedPlan.price.monthly * 12 -
                        selectedPlan.price.yearly}
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={actions.toggleUpgradeModal}
            className="border-slate-700 text-slate-300 hover:bg-slate-800"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpgrade}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white"
            disabled={state.loading}
          >
            {state.loading ? "Updating..." : "Confirm Change"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
