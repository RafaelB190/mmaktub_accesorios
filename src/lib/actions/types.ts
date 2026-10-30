export type FormState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export type CheckoutState = FormState & {
  url?: string;
};
