// Shared by server pages and the admin editors, so no database imports here.

export type ContactInfo = {
  motto: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
};

export const DEFAULT_CONTACT: ContactInfo = {
  motto: "Powering your everyday, one gadget at a time.",
  address: "Guobadia Rd, Oka, Benin City 300001, Edo",
  phone: "0707 053 1239",
  whatsapp: "2347070531239",
  email: "",
};

export type StoreClaim = { text: string; enabled: boolean };
export type StoreClaims = { shipping: StoreClaim; warranty: StoreClaim; payOnDelivery: StoreClaim };

export const DEFAULT_CLAIMS: StoreClaims = {
  shipping: { text: "Free shipping on all orders", enabled: true },
  warranty: { text: "Manufacturer warranty included", enabled: true },
  payOnDelivery: { text: "Pay on delivery available in select areas", enabled: true },
};

export const CLAIM_LABELS: Record<keyof StoreClaims, string> = {
  shipping: "Shipping",
  warranty: "Warranty",
  payOnDelivery: "Pay on delivery",
};

function parseObject(raw: string | null | undefined): Record<string, unknown> {
  if (!raw) return {};
  try {
    const value = JSON.parse(raw);
    return value && typeof value === "object" ? value : {};
  } catch {
    return {};
  }
}

// Empty fields fall back to the defaults, except email, which has none.
export function parseContact(raw: string | null | undefined): ContactInfo {
  const saved = parseObject(raw);
  const out = { ...DEFAULT_CONTACT };
  for (const key of Object.keys(out) as (keyof ContactInfo)[]) {
    const v = saved[key];
    if (typeof v === "string" && v.trim()) out[key] = v.trim();
  }
  return out;
}

export function parseClaims(raw: string | null | undefined): StoreClaims {
  const saved = parseObject(raw);
  const out: StoreClaims = JSON.parse(JSON.stringify(DEFAULT_CLAIMS));
  for (const key of Object.keys(out) as (keyof StoreClaims)[]) {
    const v = saved[key] as Partial<StoreClaim> | undefined;
    if (!v || typeof v !== "object") continue;
    if (typeof v.text === "string" && v.text.trim()) out[key].text = v.text.trim();
    if (typeof v.enabled === "boolean") out[key].enabled = v.enabled;
  }
  return out;
}

export function activeClaims(claims: StoreClaims): string[] {
  return (Object.keys(claims) as (keyof StoreClaims)[]).filter((k) => claims[k].enabled).map((k) => claims[k].text);
}

const sentence = (text: string) => (/[.!?]$/.test(text) ? text : `${text}.`);

export type FaqItem = { q: string; a: string };

// Used when the admin has not saved their own FAQ list.
export function defaultFaqs(claims: StoreClaims): FaqItem[] {
  const pay = "Payments go through Flutterwave. You can pay by card, bank transfer or another method Flutterwave supports.";
  const items: FaqItem[] = [
    { q: "How do I pay for my order?", a: claims.payOnDelivery.enabled ? `${pay} ${sentence(claims.payOnDelivery.text)}` : pay },
  ];
  if (claims.shipping.enabled) items.push({ q: "Do you offer free shipping?", a: sentence(claims.shipping.text) });
  items.push({ q: "How do I track my order?", a: "After checkout, you'll receive a tracking ID. Use the Track Order page with your tracking ID and the email used at checkout, or view all your orders under your account." });
  if (claims.warranty.enabled) items.push({ q: "Are your products covered by warranty?", a: sentence(claims.warranty.text) });
  items.push(
    { q: "Do I need an account to shop?", a: "You can browse and add items to your cart without an account, but you'll need to sign in to complete checkout so we can keep your order history accessible to you." },
    { q: "How can I contact support?", a: "Visit the Contact page for our phone number, address, and a message form." },
  );
  return items;
}

// "2347070531239" -> "0707 053 1239". Anything else is shown as entered.
export function displayPhone(value: string): string {
  const digits = value.replace(/\D/g, "");
  const local = digits.startsWith("234") && digits.length === 13 ? "0" + digits.slice(3) : digits;
  if (local.length === 11 && local.startsWith("0")) return `${local.slice(0, 4)} ${local.slice(4, 7)} ${local.slice(7)}`;
  return value;
}

export function telHref(value: string): string {
  return "tel:" + value.replace(/[^\d+]/g, "");
}

export function whatsappHref(value: string): string {
  let digits = value.replace(/\D/g, "");
  if (digits.startsWith("0") && digits.length === 11) digits = "234" + digits.slice(1);
  return `https://wa.me/${digits}`;
}
