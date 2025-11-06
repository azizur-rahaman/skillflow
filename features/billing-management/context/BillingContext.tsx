import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useCallback,
} from "react";
import {
  BillingState,
  BillingContextType,
  BillingPlan,
  Subscription,
  PaymentMethod,
  Invoice,
  BillingUsage,
  BillingInterval,
} from "../types";

const initialState: BillingState = {
  subscription: null,
  plans: [],
  invoices: [],
  paymentMethods: [],
  usage: null,
  loading: false,
  error: null,
  showPaymentModal: false,
  showCancelModal: false,
  showUpgradeModal: false,
  selectedPlan: null,
};

type BillingAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_SUBSCRIPTION"; payload: Subscription | null }
  | { type: "SET_PLANS"; payload: BillingPlan[] }
  | { type: "SET_INVOICES"; payload: Invoice[] }
  | { type: "SET_PAYMENT_METHODS"; payload: PaymentMethod[] }
  | { type: "SET_USAGE"; payload: BillingUsage | null }
  | { type: "ADD_PAYMENT_METHOD"; payload: PaymentMethod }
  | {
      type: "UPDATE_PAYMENT_METHOD";
      payload: { id: string; updates: Partial<PaymentMethod> };
    }
  | { type: "REMOVE_PAYMENT_METHOD"; payload: string }
  | { type: "SET_SELECTED_PLAN"; payload: BillingPlan | null }
  | { type: "TOGGLE_PAYMENT_MODAL" }
  | { type: "TOGGLE_CANCEL_MODAL" }
  | { type: "TOGGLE_UPGRADE_MODAL" };

function billingReducer(
  state: BillingState,
  action: BillingAction
): BillingState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_SUBSCRIPTION":
      return { ...state, subscription: action.payload };
    case "SET_PLANS":
      return { ...state, plans: action.payload };
    case "SET_INVOICES":
      return { ...state, invoices: action.payload };
    case "SET_PAYMENT_METHODS":
      return { ...state, paymentMethods: action.payload };
    case "SET_USAGE":
      return { ...state, usage: action.payload };
    case "ADD_PAYMENT_METHOD":
      return {
        ...state,
        paymentMethods: [...state.paymentMethods, action.payload],
      };
    case "UPDATE_PAYMENT_METHOD":
      return {
        ...state,
        paymentMethods: state.paymentMethods.map((method) =>
          method.id === action.payload.id
            ? { ...method, ...action.payload.updates }
            : method
        ),
      };
    case "REMOVE_PAYMENT_METHOD":
      return {
        ...state,
        paymentMethods: state.paymentMethods.filter(
          (method) => method.id !== action.payload
        ),
      };
    case "SET_SELECTED_PLAN":
      return { ...state, selectedPlan: action.payload };
    case "TOGGLE_PAYMENT_MODAL":
      return { ...state, showPaymentModal: !state.showPaymentModal };
    case "TOGGLE_CANCEL_MODAL":
      return { ...state, showCancelModal: !state.showCancelModal };
    case "TOGGLE_UPGRADE_MODAL":
      return { ...state, showUpgradeModal: !state.showUpgradeModal };
    default:
      return state;
  }
}

// Mock data generators
const generateMockPlans = (): BillingPlan[] => [
  {
    id: "starter",
    name: "Starter",
    type: "starter",
    description:
      "Perfect for small teams getting started with skill management",
    price: {
      monthly: 29,
      yearly: 290,
    },
    features: [
      "Up to 10 users",
      "Basic skill tracking",
      "Standard analytics",
      "Email support",
      "API access (1K calls/month)",
    ],
    limits: {
      users: 10,
      apiCalls: 1000,
      storage: 5,
    },
  },
  {
    id: "professional",
    name: "Professional",
    type: "professional",
    description: "Advanced features for growing organizations",
    price: {
      monthly: 99,
      yearly: 990,
    },
    features: [
      "Up to 50 users",
      "Advanced skill analytics",
      "Custom integrations",
      "Priority support",
      "API access (10K calls/month)",
      "Advanced reporting",
      "Team collaboration tools",
    ],
    limits: {
      users: 50,
      apiCalls: 10000,
      storage: 25,
    },
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    type: "enterprise",
    description: "Full-featured solution for large organizations",
    price: {
      monthly: 299,
      yearly: 2990,
    },
    features: [
      "Unlimited users",
      "Enterprise analytics",
      "Custom integrations",
      "Dedicated support",
      "API access (100K calls/month)",
      "Advanced security",
      "Custom branding",
      "SLA guarantee",
    ],
    limits: {
      users: -1, // unlimited
      apiCalls: 100000,
      storage: 100,
    },
    recommended: true,
  },
];

const generateMockSubscription = (): Subscription => {
  const plans = generateMockPlans();
  const professionalPlan = plans.find((p) => p.id === "professional")!;

  return {
    id: "sub_1234567890",
    planId: "professional",
    plan: professionalPlan,
    status: "active",
    currentPeriodStart: new Date("2024-11-01"),
    currentPeriodEnd: new Date("2024-12-01"),
    cancelAtPeriodEnd: false,
    billingInterval: "month",
    amount: 99,
    currency: "USD",
    nextBillingDate: new Date("2024-12-01"),
    autoRenew: true,
  };
};

const generateMockPaymentMethods = (): PaymentMethod[] => [
  {
    id: "pm_1234567890",
    type: "card",
    isDefault: true,
    last4: "4242",
    brand: "visa",
    expiryMonth: 12,
    expiryYear: 2026,
    createdAt: new Date("2024-10-01"),
  },
  {
    id: "pm_0987654321",
    type: "card",
    isDefault: false,
    last4: "5555",
    brand: "mastercard",
    expiryMonth: 8,
    expiryYear: 2025,
    createdAt: new Date("2024-09-15"),
  },
];

const generateMockInvoices = (): Invoice[] => [
  {
    id: "inv_001",
    number: "INV-2024-001",
    status: "paid",
    amount: 99,
    currency: "USD",
    date: new Date("2024-11-01"),
    paidAt: new Date("2024-11-01"),
    description: "Professional Plan - November 2024",
    lineItems: [
      {
        id: "li_001",
        description: "Professional Plan (Monthly)",
        amount: 99,
        quantity: 1,
        period: {
          start: new Date("2024-11-01"),
          end: new Date("2024-12-01"),
        },
      },
    ],
    downloadUrl: "#",
  },
  {
    id: "inv_002",
    number: "INV-2024-002",
    status: "paid",
    amount: 99,
    currency: "USD",
    date: new Date("2024-10-01"),
    paidAt: new Date("2024-10-01"),
    description: "Professional Plan - October 2024",
    lineItems: [
      {
        id: "li_002",
        description: "Professional Plan (Monthly)",
        amount: 99,
        quantity: 1,
        period: {
          start: new Date("2024-10-01"),
          end: new Date("2024-11-01"),
        },
      },
    ],
    downloadUrl: "#",
  },
  {
    id: "inv_003",
    number: "INV-2024-003",
    status: "open",
    amount: 99,
    currency: "USD",
    date: new Date("2024-09-01"),
    dueDate: new Date("2024-09-15"),
    description: "Professional Plan - September 2024",
    lineItems: [
      {
        id: "li_003",
        description: "Professional Plan (Monthly)",
        amount: 99,
        quantity: 1,
        period: {
          start: new Date("2024-09-01"),
          end: new Date("2024-10-01"),
        },
      },
    ],
    downloadUrl: "#",
  },
];

const generateMockUsage = (): BillingUsage => ({
  currentPeriod: {
    start: new Date("2024-11-01"),
    end: new Date("2024-12-01"),
  },
  metrics: {
    users: {
      current: 23,
      limit: 50,
      percentage: 46,
    },
    apiCalls: {
      current: 3456,
      limit: 10000,
      percentage: 34.56,
    },
    storage: {
      current: 8.5,
      limit: 25,
      percentage: 34,
    },
  },
});

const BillingContext = createContext<BillingContextType | undefined>(undefined);

export function BillingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(billingReducer, {
    ...initialState,
    subscription: generateMockSubscription(),
    plans: generateMockPlans(),
    invoices: generateMockInvoices(),
    paymentMethods: generateMockPaymentMethods(),
    usage: generateMockUsage(),
  });

  const loadBillingData = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      // Simulate API calls
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Data is already loaded in initial state
    } catch (error) {
      console.error("Failed to load billing data:", error);
      dispatch({ type: "SET_ERROR", payload: "Failed to load billing data" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  const loadPlans = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      dispatch({ type: "SET_PLANS", payload: generateMockPlans() });
    } catch (error) {
      console.error("Failed to load plans:", error);
      dispatch({ type: "SET_ERROR", payload: "Failed to load plans" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  const loadInvoices = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      dispatch({ type: "SET_INVOICES", payload: generateMockInvoices() });
    } catch (error) {
      console.error("Failed to load invoices:", error);
      dispatch({ type: "SET_ERROR", payload: "Failed to load invoices" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  const loadPaymentMethods = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      dispatch({
        type: "SET_PAYMENT_METHODS",
        payload: generateMockPaymentMethods(),
      });
    } catch (error) {
      console.error("Failed to load payment methods:", error);
      dispatch({
        type: "SET_ERROR",
        payload: "Failed to load payment methods",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  const loadUsage = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      dispatch({ type: "SET_USAGE", payload: generateMockUsage() });
    } catch (error) {
      console.error("Failed to load usage:", error);
      dispatch({ type: "SET_ERROR", payload: "Failed to load usage" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  const updateSubscription = useCallback(
    async (updates: Partial<Subscription>) => {
      dispatch({ type: "SET_LOADING", payload: true });
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        if (state.subscription) {
          dispatch({
            type: "SET_SUBSCRIPTION",
            payload: { ...state.subscription, ...updates },
          });
        }
      } catch (error) {
        console.error("Failed to update subscription:", error);
        dispatch({
          type: "SET_ERROR",
          payload: "Failed to update subscription",
        });
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    },
    [state.subscription]
  );

  const cancelSubscription = useCallback(async () => {
    await updateSubscription({ cancelAtPeriodEnd: true, status: "canceled" });
    dispatch({ type: "TOGGLE_CANCEL_MODAL" });
  }, [updateSubscription]);

  const reactivateSubscription = useCallback(async () => {
    await updateSubscription({ cancelAtPeriodEnd: false, status: "active" });
  }, [updateSubscription]);

  const changePlan = useCallback(
    async (planId: string, interval: BillingInterval) => {
      dispatch({ type: "SET_LOADING", payload: true });
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        const plan = state.plans.find((p) => p.id === planId);
        if (plan && state.subscription) {
          const newAmount =
            interval === "year" ? plan.price.yearly : plan.price.monthly;
          dispatch({
            type: "SET_SUBSCRIPTION",
            payload: {
              ...state.subscription,
              planId,
              plan,
              billingInterval: interval,
              amount: newAmount,
            },
          });
        }
        dispatch({ type: "TOGGLE_UPGRADE_MODAL" });
      } catch (error) {
        console.error("Failed to change plan:", error);
        dispatch({ type: "SET_ERROR", payload: "Failed to change plan" });
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    },
    [state.plans, state.subscription]
  );

  const addPaymentMethod = useCallback(
    async (paymentData: Partial<PaymentMethod>) => {
      dispatch({ type: "SET_LOADING", payload: true });
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const newMethod: PaymentMethod = {
          id: `pm_${Date.now()}`,
          type: paymentData.type || "card",
          isDefault: state.paymentMethods.length === 0,
          createdAt: new Date(),
          ...paymentData,
        };
        dispatch({ type: "ADD_PAYMENT_METHOD", payload: newMethod });
        dispatch({ type: "TOGGLE_PAYMENT_MODAL" });
      } catch (error) {
        console.error("Failed to add payment method:", error);
        dispatch({
          type: "SET_ERROR",
          payload: "Failed to add payment method",
        });
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    },
    [state.paymentMethods.length]
  );

  const updatePaymentMethod = useCallback(
    async (id: string, updates: Partial<PaymentMethod>) => {
      dispatch({ type: "UPDATE_PAYMENT_METHOD", payload: { id, updates } });
    },
    []
  );

  const removePaymentMethod = useCallback(async (id: string) => {
    dispatch({ type: "REMOVE_PAYMENT_METHOD", payload: id });
  }, []);

  const setDefaultPaymentMethod = useCallback(
    async (id: string) => {
      // First, set all methods to non-default
      state.paymentMethods.forEach((method) => {
        if (method.id !== id && method.isDefault) {
          dispatch({
            type: "UPDATE_PAYMENT_METHOD",
            payload: { id: method.id, updates: { isDefault: false } },
          });
        }
      });
      // Then set the selected one as default
      dispatch({
        type: "UPDATE_PAYMENT_METHOD",
        payload: { id, updates: { isDefault: true } },
      });
    },
    [state.paymentMethods]
  );

  const downloadInvoice = useCallback(async (invoiceId: string) => {
    try {
      // Simulate download
      console.log(`Downloading invoice ${invoiceId}`);
      // In real implementation, this would trigger a file download
    } catch (error) {
      console.error("Failed to download invoice:", error);
      dispatch({ type: "SET_ERROR", payload: "Failed to download invoice" });
    }
  }, []);

  const setSelectedPlan = useCallback((plan: BillingPlan | null) => {
    dispatch({ type: "SET_SELECTED_PLAN", payload: plan });
  }, []);

  const togglePaymentModal = useCallback(() => {
    dispatch({ type: "TOGGLE_PAYMENT_MODAL" });
  }, []);

  const toggleCancelModal = useCallback(() => {
    dispatch({ type: "TOGGLE_CANCEL_MODAL" });
  }, []);

  const toggleUpgradeModal = useCallback(() => {
    dispatch({ type: "TOGGLE_UPGRADE_MODAL" });
  }, []);

  const value: BillingContextType = {
    state,
    actions: {
      loadBillingData,
      loadPlans,
      loadInvoices,
      loadPaymentMethods,
      loadUsage,
      updateSubscription,
      cancelSubscription,
      reactivateSubscription,
      changePlan,
      addPaymentMethod,
      updatePaymentMethod,
      removePaymentMethod,
      setDefaultPaymentMethod,
      downloadInvoice,
      setSelectedPlan,
      togglePaymentModal,
      toggleCancelModal,
      toggleUpgradeModal,
    },
  };

  return (
    <BillingContext.Provider value={value}>{children}</BillingContext.Provider>
  );
}

export function useBilling(): BillingContextType {
  const context = useContext(BillingContext);
  if (context === undefined) {
    throw new Error("useBilling must be used within a BillingProvider");
  }
  return context;
}
