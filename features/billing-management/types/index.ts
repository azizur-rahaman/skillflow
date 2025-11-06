/**
 * Billing Management Types
 * Payment methods, subscriptions, invoices, and pricing plans for SkillFlow
 */

export type BillingPlanType =
  | "starter"
  | "professional"
  | "enterprise"
  | "custom";

export type SubscriptionStatus =
  | "active"
  | "canceled"
  | "past_due"
  | "trialing"
  | "incomplete";

export type PaymentMethodType = "card" | "bank_account" | "paypal";

export type InvoiceStatus =
  | "draft"
  | "open"
  | "paid"
  | "void"
  | "uncollectible";

export type BillingInterval = "month" | "year";

export interface BillingPlan {
  id: string;
  name: string;
  type: BillingPlanType;
  description: string;
  price: {
    monthly: number;
    yearly: number;
  };
  features: string[];
  limits: {
    users: number;
    apiCalls: number;
    storage: number; // in GB
  };
  popular?: boolean;
  recommended?: boolean;
}

export interface Subscription {
  id: string;
  planId: string;
  plan: BillingPlan;
  status: SubscriptionStatus;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  trialEnd?: Date;
  billingInterval: BillingInterval;
  amount: number;
  currency: string;
  nextBillingDate: Date;
  autoRenew: boolean;
}

export interface PaymentMethod {
  id: string;
  type: PaymentMethodType;
  isDefault: boolean;
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  bankName?: string;
  accountType?: "checking" | "savings";
  paypalEmail?: string;
  createdAt: Date;
}

export interface Invoice {
  id: string;
  number: string;
  status: InvoiceStatus;
  amount: number;
  currency: string;
  date: Date;
  dueDate?: Date;
  paidAt?: Date;
  description: string;
  lineItems: InvoiceLineItem[];
  paymentMethod?: PaymentMethod;
  downloadUrl?: string;
  hostedUrl?: string;
}

export interface InvoiceLineItem {
  id: string;
  description: string;
  amount: number;
  quantity: number;
  period?: {
    start: Date;
    end: Date;
  };
}

export interface BillingUsage {
  currentPeriod: {
    start: Date;
    end: Date;
  };
  metrics: {
    users: {
      current: number;
      limit: number;
      percentage: number;
    };
    apiCalls: {
      current: number;
      limit: number;
      percentage: number;
    };
    storage: {
      current: number; // in GB
      limit: number;
      percentage: number;
    };
  };
}

export interface BillingState {
  subscription: Subscription | null;
  plans: BillingPlan[];
  invoices: Invoice[];
  paymentMethods: PaymentMethod[];
  usage: BillingUsage | null;
  loading: boolean;
  error: string | null;
  showPaymentModal: boolean;
  showCancelModal: boolean;
  showUpgradeModal: boolean;
  selectedPlan: BillingPlan | null;
}

export interface BillingContextType {
  state: BillingState;
  actions: {
    loadBillingData: () => Promise<void>;
    loadPlans: () => Promise<void>;
    loadInvoices: () => Promise<void>;
    loadPaymentMethods: () => Promise<void>;
    loadUsage: () => Promise<void>;
    updateSubscription: (updates: Partial<Subscription>) => Promise<void>;
    cancelSubscription: () => Promise<void>;
    reactivateSubscription: () => Promise<void>;
    changePlan: (planId: string, interval: BillingInterval) => Promise<void>;
    addPaymentMethod: (paymentData: Partial<PaymentMethod>) => Promise<void>;
    updatePaymentMethod: (
      id: string,
      updates: Partial<PaymentMethod>
    ) => Promise<void>;
    removePaymentMethod: (id: string) => Promise<void>;
    setDefaultPaymentMethod: (id: string) => Promise<void>;
    downloadInvoice: (invoiceId: string) => Promise<void>;
    setSelectedPlan: (plan: BillingPlan | null) => void;
    togglePaymentModal: () => void;
    toggleCancelModal: () => void;
    toggleUpgradeModal: () => void;
  };
}
