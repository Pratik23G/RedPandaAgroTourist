/**
 * How customers pay. Nothing here is hard-coded: bank details come from env so the owner
 * (not the developer) supplies them, and unset fields simply don't render.
 *
 * Why manual: Stripe doesn't support Nepal-based accounts, and eSewa/Khalti/ConnectIPS merchant
 * accounts need a registered Nepali business. So v1 = customer sends a bank wire (or arranges
 * payment over WhatsApp), reports it on the /pay page, and the owner confirms it landed in /admin.
 */
export interface BankDetails {
  bankName?: string;
  accountName?: string;
  accountNumber?: string;
  branch?: string;
  swift?: string;
  notes?: string;
}

export function getBankDetails(): BankDetails {
  const e = process.env;
  return {
    bankName: e.BANK_NAME || undefined,
    accountName: e.BANK_ACCOUNT_NAME || undefined,
    accountNumber: e.BANK_ACCOUNT_NUMBER || undefined,
    branch: e.BANK_BRANCH || undefined,
    swift: e.BANK_SWIFT || undefined,
    notes: e.BANK_NOTES || undefined,
  };
}

export function hasBankDetails(b: BankDetails): boolean {
  return Boolean(b.bankName && b.accountNumber);
}

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  BANK_TRANSFER: "Bank wire transfer",
  WHATSAPP: "Arranged on WhatsApp",
  ESEWA: "eSewa",
  KHALTI: "Khalti",
  CASH: "Cash",
  OTHER: "Other",
};
