// Mock data for the UI. Replace with API calls once the backend is ready.

export type Channel =
  | "instagram"
  | "facebook"
  | "whatsapp"
  | "google"
  | "youtube"
  | "website"
  | "linkedin"
  | "csv"
  | "referral"
  | "email"
  | "sms";

export type Stage = "new" | "contacted" | "demo" | "trial" | "paid" | "churned";

export const STAGES: { id: Stage; label: string }[] = [
  { id: "new", label: "New" },
  { id: "contacted", label: "Contacted" },
  { id: "demo", label: "Demo Booked" },
  { id: "trial", label: "Trial" },
  { id: "paid", label: "Paid" },
  { id: "churned", label: "Churned" },
];

export const CHANNEL_LABEL: Record<Channel, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  whatsapp: "WhatsApp",
  google: "Google Ads",
  youtube: "YouTube",
  website: "Website",
  linkedin: "LinkedIn",
  csv: "CSV import",
  referral: "Referral",
  email: "Email",
  sms: "SMS",
};

export type Rep = {
  id: string;
  name: string;
  initials: string;
  region: string;
  languages: string[];
  avgResponseMin: number;
  conversions: number;
  assigned: number;
  mrr: number;
};

export const REPS: Rep[] = [
  { id: "r1", name: "Ananya Iyer", initials: "AI", region: "South", languages: ["Tamil", "English"], avgResponseMin: 3.2, conversions: 38, assigned: 142, mrr: 412000 },
  { id: "r2", name: "Rohan Mehta", initials: "RM", region: "West", languages: ["Hindi", "Gujarati", "English"], avgResponseMin: 4.8, conversions: 31, assigned: 128, mrr: 356000 },
  { id: "r3", name: "Fatima Shaikh", initials: "FS", region: "North", languages: ["Hindi", "Urdu", "English"], avgResponseMin: 6.1, conversions: 24, assigned: 117, mrr: 268000 },
  { id: "r4", name: "Karthik Rao", initials: "KR", region: "South", languages: ["Kannada", "Telugu", "English"], avgResponseMin: 9.4, conversions: 17, assigned: 109, mrr: 189000 },
];

export type Lead = {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  city: string;
  language: string;
  source: Channel;
  stage: Stage;
  score: number;
  ownerId: string;
  platform: "Shopify" | "WooCommerce" | "Magento" | "Custom" | "None";
  gmv: number; // monthly, INR
  storeSize: "Solo" | "2–10" | "11–50" | "50+";
  category: string;
  tags: string[];
  utm: { source: string; campaign: string; adset: string; ad: string };
  created: string;
  lastActivity: string;
  firstReplyMin: number | null;
  trial?: { day: number };
  mrr: number;
  duplicates?: Channel[];
};

export const LEADS: Lead[] = [
  { id: "L-2041", name: "Meera Krishnan", company: "Kanjeevaram House", email: "meera@kanjeevaramhouse.in", phone: "+91 98400 21873", city: "Chennai", language: "Tamil", source: "instagram", stage: "trial", score: 92, ownerId: "r1", platform: "Shopify", gmv: 1850000, storeSize: "11–50", category: "Sarees & ethnicwear", tags: ["Festive rush", "Migrating"], utm: { source: "meta", campaign: "Diwali_Merchants_25", adset: "TN_Fashion_25-45", ad: "Reel_SareeStore_v3" }, created: "12 min ago", lastActivity: "Booked onboarding call", firstReplyMin: 2, trial: { day: 4 }, mrr: 0, duplicates: ["website"] },
  { id: "L-2040", name: "Arjun Malhotra", company: "Brew Theory Coffee", email: "arjun@brewtheory.co", phone: "+91 99100 44521", city: "Delhi", language: "Hindi", source: "google", stage: "demo", score: 84, ownerId: "r3", platform: "WooCommerce", gmv: 920000, storeSize: "2–10", category: "Food & beverage", tags: ["D2C", "Subscriptions"], utm: { source: "google", campaign: "Search_Ecom_Platform", adset: "Exact_Shopify_Alt", ad: "RSA_Cheaper_Than_Shopify" }, created: "48 min ago", lastActivity: "Demo Thu 4:30 PM", firstReplyMin: 4, mrr: 0 },
  { id: "L-2039", name: "Priya Nair", company: "Moss & Clay Ceramics", email: "priya@mossandclay.in", phone: "+91 97450 11902", city: "Kochi", language: "English", source: "whatsapp", stage: "contacted", score: 71, ownerId: "r1", platform: "None", gmv: 240000, storeSize: "Solo", category: "Home décor", tags: ["First store"], utm: { source: "meta", campaign: "CTWA_Launch_Store", adset: "Kerala_Crafts", ad: "Carousel_3Steps" }, created: "2 h ago", lastActivity: "Asked about COD", firstReplyMin: 1, mrr: 0 },
  { id: "L-2038", name: "Siddharth Jain", company: "Urban Kurta Co.", email: "sid@urbankurta.com", phone: "+91 98201 77340", city: "Mumbai", language: "Hindi", source: "facebook", stage: "paid", score: 88, ownerId: "r2", platform: "Shopify", gmv: 3400000, storeSize: "50+", category: "Menswear", tags: ["Enterprise", "Annual plan"], utm: { source: "meta", campaign: "Diwali_Merchants_25", adset: "MH_Fashion_Lookalike", ad: "Static_Testimonial_02" }, created: "3 d ago", lastActivity: "Paid ₹24,999 / mo", firstReplyMin: 3, mrr: 24999 },
  { id: "L-2037", name: "Lakshmi Venkat", company: "Thali & Co.", email: "lakshmi@thaliandco.in", phone: "+91 90030 66218", city: "Bengaluru", language: "Kannada", source: "youtube", stage: "trial", score: 58, ownerId: "r4", platform: "None", gmv: 180000, storeSize: "Solo", category: "Kitchenware", tags: ["Needs help"], utm: { source: "youtube", campaign: "YT_Howto_StartStore", adset: "KA_Small_Biz", ad: "Video_15s_Founder" }, created: "5 d ago", lastActivity: "No login in 3 days", firstReplyMin: 22, trial: { day: 5 }, mrr: 0 },
  { id: "L-2036", name: "Neha Kapoor", company: "Glow Ritual", email: "neha@glowritual.in", phone: "+91 98110 90215", city: "Gurugram", language: "English", source: "linkedin", stage: "demo", score: 79, ownerId: "r3", platform: "Magento", gmv: 2600000, storeSize: "11–50", category: "Beauty & skincare", tags: ["Migrating", "B2B"], utm: { source: "linkedin", campaign: "LI_D2C_Founders", adset: "Founders_Beauty", ad: "LeadGen_Whitepaper" }, created: "1 d ago", lastActivity: "Demo tomorrow 11 AM", firstReplyMin: 6, mrr: 0 },
  { id: "L-2035", name: "Rahul Desai", company: "Kite Toys", email: "rahul@kitetoys.in", phone: "+91 97240 55871", city: "Ahmedabad", language: "Gujarati", source: "website", stage: "new", score: 64, ownerId: "r2", platform: "Custom", gmv: 610000, storeSize: "2–10", category: "Toys & kids", tags: [], utm: { source: "organic", campaign: "—", adset: "—", ad: "Pricing page" }, created: "6 min ago", lastActivity: "Free-trial signup", firstReplyMin: null, mrr: 0 },
  { id: "L-2034", name: "Ishita Banerjee", company: "Jamdani Loom", email: "ishita@jamdaniloom.com", phone: "+91 98300 41267", city: "Kolkata", language: "Bengali", source: "instagram", stage: "new", score: 76, ownerId: "r3", platform: "None", gmv: 420000, storeSize: "2–10", category: "Handloom", tags: ["Commented “price?”"], utm: { source: "meta", campaign: "IG_Organic_Comments", adset: "—", ad: "Post_Feature_Launch" }, created: "18 min ago", lastActivity: "Commented “price?”", firstReplyMin: null, mrr: 0 },
  { id: "L-2033", name: "Vikram Singh", company: "Rajputana Leather", email: "vikram@rajputanaleather.in", phone: "+91 94140 22983", city: "Jaipur", language: "Hindi", source: "referral", stage: "paid", score: 81, ownerId: "r2", platform: "WooCommerce", gmv: 1450000, storeSize: "11–50", category: "Leather goods", tags: ["Referred by Urban Kurta"], utm: { source: "referral", campaign: "Partner_Referral", adset: "—", ad: "—" }, created: "9 d ago", lastActivity: "Paid ₹9,999 / mo", firstReplyMin: 5, mrr: 9999 },
  { id: "L-2032", name: "Divya Reddy", company: "Pickle Patch", email: "divya@picklepatch.in", phone: "+91 99490 31750", city: "Hyderabad", language: "Telugu", source: "whatsapp", stage: "trial", score: 69, ownerId: "r4", platform: "None", gmv: 150000, storeSize: "Solo", category: "Food & beverage", tags: ["Home business"], utm: { source: "meta", campaign: "CTWA_Launch_Store", adset: "TS_HomeBiz", ad: "Reel_PickleStory" }, created: "3 d ago", lastActivity: "Completed store setup", firstReplyMin: 2, trial: { day: 3 }, mrr: 0 },
  { id: "L-2031", name: "Aman Gupta", company: "Stride Sneakers", email: "aman@stridesneakers.in", phone: "+91 98730 66104", city: "Noida", language: "Hindi", source: "google", stage: "contacted", score: 62, ownerId: "r3", platform: "Shopify", gmv: 780000, storeSize: "2–10", category: "Footwear", tags: [], utm: { source: "google", campaign: "PMax_Ecom_Q4", adset: "Asset_Group_Fashion", ad: "PMax_Asset_07" }, created: "1 d ago", lastActivity: "Opened case study", firstReplyMin: 11, mrr: 0 },
  { id: "L-2030", name: "Sneha Pillai", company: "Coastal Spice Co.", email: "sneha@coastalspice.in", phone: "+91 94470 88213", city: "Thiruvananthapuram", language: "Malayalam", source: "facebook", stage: "churned", score: 31, ownerId: "r1", platform: "None", gmv: 90000, storeSize: "Solo", category: "Spices", tags: ["Price sensitive"], utm: { source: "meta", campaign: "FB_LeadAds_Broad", adset: "Kerala_Broad", ad: "Form_InstantQuote" }, created: "21 d ago", lastActivity: "Cancelled trial", firstReplyMin: 38, mrr: 0 },
  { id: "L-2029", name: "Farhan Qureshi", company: "Attar Mahal", email: "farhan@attarmahal.com", phone: "+91 98390 12456", city: "Lucknow", language: "Urdu", source: "instagram", stage: "demo", score: 73, ownerId: "r3", platform: "None", gmv: 510000, storeSize: "2–10", category: "Fragrance", tags: ["DM: “how much?”"], utm: { source: "meta", campaign: "Diwali_Merchants_25", adset: "UP_Luxury_Interest", ad: "Reel_SareeStore_v3" }, created: "2 d ago", lastActivity: "Demo Fri 3 PM", firstReplyMin: 3, mrr: 0 },
  { id: "L-2028", name: "Tanvi Shah", company: "Little Loom Kids", email: "tanvi@littleloom.in", phone: "+91 98250 73019", city: "Surat", language: "Gujarati", source: "csv", stage: "contacted", score: 47, ownerId: "r2", platform: "WooCommerce", gmv: 330000, storeSize: "2–10", category: "Kidswear", tags: ["Expo Mumbai"], utm: { source: "event", campaign: "D2C_Expo_Mumbai", adset: "—", ad: "Business card" }, created: "4 d ago", lastActivity: "Call: no answer", firstReplyMin: 64, mrr: 0 },
  { id: "L-2027", name: "Gautam Rao", company: "Deccan Silver", email: "gautam@deccansilver.in", phone: "+91 98450 22870", city: "Mysuru", language: "Kannada", source: "website", stage: "paid", score: 86, ownerId: "r4", platform: "Shopify", gmv: 2100000, storeSize: "11–50", category: "Jewellery", tags: ["Migrated from Shopify"], utm: { source: "google", campaign: "Search_Ecom_Platform", adset: "Exact_Shopify_Alt", ad: "RSA_Cheaper_Than_Shopify" }, created: "12 d ago", lastActivity: "Paid ₹14,999 / mo", firstReplyMin: 4, mrr: 14999 },
  { id: "L-2026", name: "Ritika Sen", company: "Bloom Botanics", email: "ritika@bloombotanics.in", phone: "+91 98310 55402", city: "Kolkata", language: "Bengali", source: "linkedin", stage: "new", score: 55, ownerId: "r3", platform: "Custom", gmv: 470000, storeSize: "2–10", category: "Plants & gardening", tags: [], utm: { source: "linkedin", campaign: "LI_D2C_Founders", adset: "Founders_Home", ad: "LeadGen_Whitepaper" }, created: "1 h ago", lastActivity: "Downloaded guide", firstReplyMin: null, mrr: 0 },
];

export const repById = (id: string) => REPS.find((r) => r.id === id)!;
export const leadById = (id: string) => LEADS.find((l) => l.id === id);

export const TIMELINE = [
  { at: "Today, 10:42", kind: "trial", text: "Asked for a Growth plan quote · ₹2,499 / month" },
  { at: "Today, 09:15", kind: "trial", text: "Completed the onboarding checklist" },
  { at: "Yesterday, 18:02", kind: "message", text: "WhatsApp drip · Day 2 case study delivered and read" },
  { at: "Yesterday, 11:30", kind: "call", text: "Call with Ananya · 14 min · recording saved" },
  { at: "Mon, 16:20", kind: "merge", text: "Merged with website signup meera.k@gmail.com (same phone)" },
  { at: "Mon, 16:08", kind: "auto", text: "Instant auto-reply sent on Instagram in 38 seconds" },
  { at: "Mon, 16:07", kind: "capture", text: "Lead captured · Instagram Lead Ad · Reel_SareeStore_v3" },
];

export const SOURCES = [
  { channel: "instagram" as Channel, leads: 1284, spend: 412000, paid: 96, mrr: 318000 },
  { channel: "facebook" as Channel, leads: 962, spend: 336000, paid: 54, mrr: 172000 },
  { channel: "whatsapp" as Channel, leads: 811, spend: 198000, paid: 71, mrr: 214000 },
  { channel: "google" as Channel, leads: 644, spend: 389000, paid: 82, mrr: 401000 },
  { channel: "website" as Channel, leads: 527, spend: 0, paid: 49, mrr: 236000 },
  { channel: "linkedin" as Channel, leads: 188, spend: 142000, paid: 19, mrr: 138000 },
  { channel: "youtube" as Channel, leads: 233, spend: 96000, paid: 11, mrr: 41000 },
  { channel: "referral" as Channel, leads: 92, spend: 0, paid: 28, mrr: 152000 },
];

export const FUNNEL = [
  { label: "New", value: 4741 },
  { label: "Contacted", value: 3912 },
  { label: "Demo Booked", value: 1488 },
  { label: "Trial", value: 1102 },
  { label: "Paid", value: 410 },
];

export const CAMPAIGNS = [
  { name: "Diwali_Merchants_25", channel: "instagram" as Channel, leads: 842, paid: 71, mrr: 268000, cpl: 312 },
  { name: "Search_Ecom_Platform", channel: "google" as Channel, leads: 391, paid: 58, mrr: 301000, cpl: 684 },
  { name: "CTWA_Launch_Store", channel: "whatsapp" as Channel, leads: 611, paid: 52, mrr: 156000, cpl: 244 },
  { name: "LI_D2C_Founders", channel: "linkedin" as Channel, leads: 188, paid: 19, mrr: 138000, cpl: 755 },
  { name: "FB_LeadAds_Broad", channel: "facebook" as Channel, leads: 704, paid: 31, mrr: 92000, cpl: 298 },
];

// 30 days of daily leads, deterministic
export const DAILY_LEADS = Array.from({ length: 30 }, (_, i) => {
  const base = 120 + i * 3.2;
  const wave = Math.sin(i / 2.4) * 18 + Math.cos(i / 5) * 12;
  return Math.round(base + wave + (i % 7 === 5 ? -28 : 0));
});
export const DAILY_PAID = DAILY_LEADS.map((v, i) => Math.round(v * (0.07 + (i / 30) * 0.035)));

export const inr = (n: number) =>
  "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 0 });

export const inrShort = (n: number) => {
  if (n >= 10000000) return "₹" + (n / 10000000).toFixed(2).replace(/\.?0+$/, "") + " Cr";
  if (n >= 100000) return "₹" + (n / 100000).toFixed(1).replace(/\.0$/, "") + " L";
  if (n >= 1000) return "₹" + (n / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  return "₹" + n;
};
