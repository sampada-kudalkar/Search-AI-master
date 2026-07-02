// Seed data for the Visibility report screen, transcribed from the
// user-provided My-Family-Dental_SearchAIVisibility.md export (Jun 2026).
// Summary growth deltas are transcribed from the live Visibility page DOM.

export type VisibilityPlatform = 'ChatGPT' | 'Gemini' | 'Perplexity' | 'All'

export interface VisibilitySummaryMetric {
  value: number
  growth: number
}
export const VISIBILITY_SUMMARY: Record<'overall' | 'chatgpt' | 'gemini' | 'perplexity', VisibilitySummaryMetric> = {
  overall: { value: 61.9, growth: -1.4 },
  chatgpt: { value: 51.3, growth: 10.8 },
  gemini: { value: 66.8, growth: 1.1 },
  perplexity: { value: 67.7, growth: -11 },
}

export interface VisibilityTrendPoint extends Record<string, number | string | undefined> {
  label: string
  overallVisibility: number
  chatgpt: number
  gemini: number
  perplexity: number
}
export const VISIBILITY_TREND: VisibilityTrendPoint[] = [
  { label: 'Apr', overallVisibility: 61.0, chatgpt: 46.1, gemini: 60.7, perplexity: 76.3 },
  { label: 'May', overallVisibility: 62.8, chatgpt: 46.3, gemini: 66.1, perplexity: 76.1 },
  { label: 'Jun', overallVisibility: 61.9, chatgpt: 51.3, gemini: 66.8, perplexity: 67.7 },
]

export interface VisibilityLocationRow extends Record<string, unknown> {
  timeRange: string
  competitor: string
  avgVisibility: number
  isYou: boolean
}
export const VISIBILITY_BY_LOCATION: Record<VisibilityPlatform, VisibilityLocationRow[]> = {
  ChatGPT: [
    { timeRange: 'Apr', competitor: 'My Family Dental (You)', avgVisibility: 46.1, isYou: true },
    { timeRange: 'Apr', competitor: 'National Dental Care Townsville', avgVisibility: 6.3, isYou: false },
    { timeRange: 'Apr', competitor: 'Riverside Family Dental Innisfail', avgVisibility: 6.3, isYou: false },
    { timeRange: 'Apr', competitor: 'Absolutely Dental @ Kirwan Plaza, Townsville', avgVisibility: 5.6, isYou: false },
    { timeRange: 'Apr', competitor: 'Bowen Dental Pty Ltd', avgVisibility: 5.0, isYou: false },
    { timeRange: 'May', competitor: 'My Family Dental (You)', avgVisibility: 46.3, isYou: true },
    { timeRange: 'May', competitor: 'Bowen Dental Pty Ltd', avgVisibility: 12.2, isYou: false },
    { timeRange: 'May', competitor: 'Absolutely Dental @ Kirwan Plaza, Townsville', avgVisibility: 10.9, isYou: false },
    { timeRange: 'May', competitor: 'Riverside Family Dental Innisfail', avgVisibility: 10.2, isYou: false },
    { timeRange: 'May', competitor: 'National Dental Care Townsville', avgVisibility: 8.7, isYou: false },
    { timeRange: 'Jun', competitor: 'My Family Dental (You)', avgVisibility: 51.3, isYou: true },
    { timeRange: 'Jun', competitor: 'Bowen Dental Pty Ltd', avgVisibility: 10.0, isYou: false },
    { timeRange: 'Jun', competitor: 'Absolutely Dental @ Kirwan Plaza, Townsville', avgVisibility: 9.8, isYou: false },
    { timeRange: 'Jun', competitor: 'National Dental Care Townsville', avgVisibility: 9.4, isYou: false },
    { timeRange: 'Jun', competitor: 'Riverside Family Dental Innisfail', avgVisibility: 8.9, isYou: false },
  ],
  Gemini: [
    { timeRange: 'Apr', competitor: 'My Family Dental (You)', avgVisibility: 60.7, isYou: true },
    { timeRange: 'Apr', competitor: 'Bowen Dental', avgVisibility: 14.8, isYou: false },
    { timeRange: 'Apr', competitor: 'Dental Balance NQ', avgVisibility: 8.3, isYou: false },
    { timeRange: 'Apr', competitor: 'Deeragun Dental', avgVisibility: 7.8, isYou: false },
    { timeRange: 'Apr', competitor: 'Serenity Dental CQ', avgVisibility: 7.8, isYou: false },
    { timeRange: 'May', competitor: 'My Family Dental (You)', avgVisibility: 66.1, isYou: true },
    { timeRange: 'May', competitor: 'Bowen Dental', avgVisibility: 14.4, isYou: false },
    { timeRange: 'May', competitor: 'Deeragun Dental', avgVisibility: 8.1, isYou: false },
    { timeRange: 'May', competitor: 'Serenity Dental CQ', avgVisibility: 7.6, isYou: false },
    { timeRange: 'May', competitor: 'Dental Balance NQ', avgVisibility: 1.1, isYou: false },
    { timeRange: 'Jun', competitor: 'My Family Dental (You)', avgVisibility: 66.8, isYou: true },
    { timeRange: 'Jun', competitor: 'Bowen Dental', avgVisibility: 15.6, isYou: false },
    { timeRange: 'Jun', competitor: 'Deeragun Dental', avgVisibility: 10.7, isYou: false },
    { timeRange: 'Jun', competitor: 'Serenity Dental CQ', avgVisibility: 8.7, isYou: false },
    { timeRange: 'Jun', competitor: 'Dental Balance NQ', avgVisibility: 8.0, isYou: false },
  ],
  Perplexity: [
    { timeRange: 'Apr', competitor: 'My Family Dental (You)', avgVisibility: 76.3, isYou: true },
    { timeRange: 'Apr', competitor: 'Bowen Dental', avgVisibility: 12.8, isYou: false },
    { timeRange: 'Apr', competitor: 'Deeragun Dental', avgVisibility: 8.0, isYou: false },
    { timeRange: 'Apr', competitor: 'Absolutely Dental @ Kirwan Plaza', avgVisibility: 3.1, isYou: false },
    { timeRange: 'Apr', competitor: 'Dental On Bowen', avgVisibility: 2.9, isYou: false },
    { timeRange: 'May', competitor: 'My Family Dental (You)', avgVisibility: 76.1, isYou: true },
    { timeRange: 'May', competitor: 'Bowen Dental', avgVisibility: 10.9, isYou: false },
    { timeRange: 'May', competitor: 'Deeragun Dental', avgVisibility: 6.9, isYou: false },
    { timeRange: 'May', competitor: 'Dental On Bowen', avgVisibility: 6.3, isYou: false },
    { timeRange: 'May', competitor: 'Absolutely Dental @ Kirwan Plaza', avgVisibility: 3.4, isYou: false },
    { timeRange: 'Jun', competitor: 'My Family Dental (You)', avgVisibility: 67.7, isYou: true },
    { timeRange: 'Jun', competitor: 'Bowen Dental', avgVisibility: 9.3, isYou: false },
    { timeRange: 'Jun', competitor: 'Absolutely Dental @ Kirwan Plaza', avgVisibility: 8.0, isYou: false },
    { timeRange: 'Jun', competitor: 'Deeragun Dental', avgVisibility: 5.8, isYou: false },
    { timeRange: 'Jun', competitor: 'Dental On Bowen', avgVisibility: 5.3, isYou: false },
  ],
  All: [
    { timeRange: 'Apr', competitor: 'My Family Dental (You)', avgVisibility: 61.0, isYou: true },
    { timeRange: 'Apr', competitor: 'Bowen Dental', avgVisibility: 10.7, isYou: false },
    { timeRange: 'Apr', competitor: 'CP Dental Emerald', avgVisibility: 6.9, isYou: false },
    { timeRange: 'Apr', competitor: 'Innisfail Dentists', avgVisibility: 6.7, isYou: false },
    { timeRange: 'Apr', competitor: 'Deeragun Dental', avgVisibility: 6.2, isYou: false },
    { timeRange: 'May', competitor: 'My Family Dental (You)', avgVisibility: 62.8, isYou: true },
    { timeRange: 'May', competitor: 'Bowen Dental', avgVisibility: 9.8, isYou: false },
    { timeRange: 'May', competitor: 'Innisfail Dentists', avgVisibility: 6.6, isYou: false },
    { timeRange: 'May', competitor: 'Deeragun Dental', avgVisibility: 6.3, isYou: false },
    { timeRange: 'May', competitor: 'CP Dental Emerald', avgVisibility: 5.7, isYou: false },
    { timeRange: 'Jun', competitor: 'My Family Dental (You)', avgVisibility: 61.9, isYou: true },
    { timeRange: 'Jun', competitor: 'Bowen Dental', avgVisibility: 9.9, isYou: false },
    { timeRange: 'Jun', competitor: 'Innisfail Dentists', avgVisibility: 6.0, isYou: false },
    { timeRange: 'Jun', competitor: 'CP Dental Emerald', avgVisibility: 5.8, isYou: false },
    { timeRange: 'Jun', competitor: 'Deeragun Dental', avgVisibility: 5.6, isYou: false },
  ],
}

export interface VisibilityRankingRow {
  theme: string
  prompt: string
  ranks: string[]
}
export const VISIBILITY_RANKING: Record<VisibilityPlatform, VisibilityRankingRow[]> = {
  ChatGPT: [
    { theme: 'dental implants', prompt: '(aggregate)', ranks: ['My Family Dental', 'Innisfail Dentists', 'Absolutely Dental @ Kirwan Plaza, Townsville', 'CP Dental Emerald', 'Riverside Family Dental Innisfail', 'Serenity Dental CQ', 'Dental Balance NQ', 'Bowen Dental Pty Ltd', 'Hello My Dental', 'Hinchinbrook Dental Group'] },
    { theme: 'dental implants', prompt: 'Best clinics for all on 4 dental implants in my area', ranks: ['My Family Dental', 'Absolutely Dental @ Kirwan Plaza, Townsville', 'Innisfail Dentists', 'Serenity Dental CQ', 'All On 4 Plus® Townsville', 'All-On-4 Plus® Townsville', 'Bowen Dental', '—', '—', '—'] },
    { theme: 'dental implants', prompt: 'Find dental implant specialists near me', ranks: ['My Family Dental', 'Bowen Dental Pty Ltd', 'CP Dental Emerald', 'Innisfail Dentists', 'The Hinchinbrook Dental Group', 'Absolutely Dental @ Kirwan Plaza, Townsville', 'Dr. Mohamad Aziz', 'Serenity Dental CQ Emerald', 'Whitsunday Family Dental', 'Aspire Dental'] },
    { theme: 'dental implants', prompt: 'Locate affordable dental implant services nearby', ranks: ['My Family Dental', 'Dental Balance NQ', 'Hello My Dental', 'Hinchinbrook Dental Group', "Kylie's Family Dental", 'Riverside Family Dental Innisfail', 'CP Dental Emerald', 'Dental 99 Implant Institute', 'National Dental Care Townsville', 'Dentures Direct'] },
    { theme: 'teeth cleaning', prompt: '(aggregate)', ranks: ['My Family Dental', 'Bowen Dental Pty Ltd', 'Absolutely Dental @ Kirwan Plaza, Townsville', 'National Dental Care Townsville', 'The Hinchinbrook Dental Group', 'Riverside Family Dental Innisfail', 'CP Dental - Dentist Emerald', "Kylie's Family Dental", 'Sundown Family Dental', 'CP Dental Emerald'] },
    { theme: 'teeth cleaning', prompt: 'Best dental clinics for ultrasound teeth cleaning in my area', ranks: ['My Family Dental', 'Absolutely Dental @ Kirwan Plaza, Townsville', 'Bowen Dental Pty Ltd', 'Serenity Dental CQ Emerald', 'The Hinchinbrook Dental Group', 'CP Dental - Dentist Emerald', 'Dr. Eleri J Hunter', "Kylie's Family Dental", 'National Dental Care Townsville', 'Riverside Family Dental Innisfail'] },
    { theme: 'teeth cleaning', prompt: 'Find teeth cleaning services near me', ranks: ['My Family Dental', 'Bowen Dental Pty Ltd', 'CP Dental Emerald', 'National Dental Care Townsville', 'The Hinchinbrook Dental Group', '1300SMILES North Shore (Burdell)', 'Serenity Dental CQ', 'Sundown Family Dental', 'Absolutely Dental @ Kirwan Plaza, Townsville', 'Deeragun Dental'] },
    { theme: 'teeth cleaning', prompt: 'Top rated dentists for plaque removal and teeth cleaning nearby', ranks: ['My Family Dental', 'Absolutely Dental @ Kirwan Plaza, Townsville', 'Bowen Dental Pty Ltd', 'CP Dental - Dentist Emerald', 'Hinchinbrook Dental Group', 'Riverside Family Dental Innisfail', 'Aspire Dental', "Kylie's Family Dental", 'National Dental Care Townsville', 'Dental Balance NQ'] },
    { theme: 'teeth whitening', prompt: '(aggregate)', ranks: ['My Family Dental', 'Hinchinbrook Dental Group', 'Sundown Family Dental', 'Absolutely Dental @ Kirwan Plaza, Townsville', 'CP Dental Emerald', 'Bowen Dental', 'National Dental Care Townsville', 'Innisfail Dentists', 'Serenity Dental CQ Emerald', 'Riverside Family Dental Innisfail'] },
    { theme: 'teeth whitening', prompt: 'Best teeth whitening clinics in my area', ranks: ['My Family Dental', 'Absolutely Dental @ Kirwan Plaza, Townsville', 'Bowen Dental', 'CP Dental Emerald', 'Hinchinbrook Dental Group', 'Sundown Family Dental', 'Central Highlands Dental', 'Innisfail Dentists', 'National Dental Care Townsville', 'Riverside Family Dental Innisfail'] },
    { theme: 'teeth whitening', prompt: 'Find professional teeth whitening services near me', ranks: ['My Family Dental', 'Bowen Dental Pty Ltd', 'CP Dental Emerald', 'Hinchinbrook Dental Group', 'National Dental Care Townsville', 'Sundown Family Dental', 'Absolutely Dental @ Kirwan Plaza, Townsville', 'Innisfail Dentists', 'Serenity Dental CQ', 'Aspire Dental'] },
    { theme: 'teeth whitening', prompt: 'Top rated laser teeth whitening providers nearby', ranks: ['My Family Dental', 'Absolutely Dental @ Kirwan Plaza, Townsville', 'Bowen Dental', 'Hinchinbrook Dental Group', 'Serenity Dental CQ Emerald', 'Sundown Family Dental', 'CP Dental Emerald', 'National Dental Care Townsville', 'Riverside Family Dental Innisfail', 'Smartbleach®'] },
    { theme: 'tooth extraction', prompt: '(aggregate)', ranks: ['My Family Dental', 'Innisfail Dentists', 'Bowen Dental Pty Ltd', 'Absolutely Dental @ Kirwan Plaza, Townsville', 'Serenity Dental CQ Emerald', 'Riverside Family Dental Innisfail', 'Sundown Family Dental', '1300SMILES Dentists Townsville City', 'Bowen Dental', 'CP Dental Emerald'] },
    { theme: 'tooth extraction', prompt: 'Find affordable wisdom tooth extraction specialists near me', ranks: ['My Family Dental', '1300SMILES Dentists Townsville City', 'Bowen Dental', 'Innisfail Dentists', 'SEAFORD DENTAL', 'The Dental Standard - Taringa', 'Empire Dental Care', 'My Wisdom Tooth Dentist Brisbane', 'Bespoke Dental Studio', 'Lotus Dental'] },
    { theme: 'tooth extraction', prompt: 'Search for local dental offices offering tooth extraction services', ranks: ['My Family Dental', 'Absolutely Dental @ Kirwan Plaza, Townsville', 'Bowen Dental Pty Ltd', 'CP Dental Emerald', 'Innisfail Dentists', 'The Hinchinbrook Dental Group', "Kylie's Family Dental", 'Serenity Dental CQ Emerald', 'Bella Dental', 'National Dental Care Townsville'] },
    { theme: 'tooth extraction', prompt: 'Top rated tooth extraction clinics in my area', ranks: ['My Family Dental', 'Bowen Dental Pty Ltd', 'Riverside Family Dental Innisfail', 'Serenity Dental CQ Emerald', 'Absolutely Dental @ Kirwan Plaza, Townsville', 'Hinchinbrook Dental Group', 'Innisfail Dentists', "Kylie's Family Dental", 'CP Dental - Dentist Emerald', 'National Dental Care Townsville'] },
    { theme: 'wisdom teeth removal', prompt: '(aggregate)', ranks: ['My Family Dental', 'National Dental Care Townsville', 'Riverside Family Dental Innisfail', 'Bowen Dental Pty Ltd', 'CP Dental Emerald', 'Serenity Dental CQ', 'Absolutely Dental @ Kirwan Plaza, Townsville', 'Bowen Dental', 'Dr. Eleri J Hunter', 'Innisfail Dentists'] },
    { theme: 'wisdom teeth removal', prompt: 'Best clinics for wisdom teeth removal in my area', ranks: ['My Family Dental', 'Bowen Dental Pty Ltd', 'CP Dental Emerald', 'National Dental Care Townsville', 'Absolutely Dental @ Kirwan Plaza, Townsville', 'Dr. Eleri J Hunter', 'Hinchinbrook Dental Group', 'Innisfail Dentists', 'Serenity Dental CQ', 'Riverside Family Dental Innisfail'] },
    { theme: 'wisdom teeth removal', prompt: 'Find wisdom teeth removal specialists near me', ranks: ['My Family Dental', 'Bowen Dental Pty Ltd', 'CP Dental Emerald', 'National Dental Care Townsville', 'Riverside Family Dental Innisfail', 'Absolutely Dental @ Kirwan Plaza, Townsville', 'Dr. Eleri J Hunter', 'Innisfail Dentists', 'The Hinchinbrook Dental Group', 'NQ Surgical Dentistry'] },
    { theme: 'wisdom teeth removal', prompt: 'Top rated oral surgeons for wisdom teeth extraction nearby', ranks: ['My Family Dental', 'Bowen Dental', 'National Dental Care Townsville', 'Riverside Family Dental Innisfail', 'Serenity Dental CQ', 'A2Z Dental - Dentist Emerald', 'Dental Balance NQ', 'Intraface Oral and Maxillofacial Surgeons', 'NQ Surgical Dentistry', 'Cairns Oral Surgery'] },
  ],
  Gemini: [
    { theme: 'dental implants', prompt: '(aggregate)', ranks: ['My Family Dental', 'Bowen Dental', 'Meta Dental Haus', 'Dental Balance NQ', 'Serenity Dental CQ', 'Absolutely Dental @ Kirwan Plaza', 'Hinchinbrook Dental Group', 'Innisfail Dentists', 'Riverside Family Dental', 'Deeragun Dental'] },
    { theme: 'dental implants', prompt: 'Best clinics for all on 4 dental implants in my area', ranks: ['My Family Dental', 'Bowen Dental', 'Innisfail Dentists', 'Serenity Dental CQ', 'Dental Balance NQ', '1300 Smiles - Ingham', 'Absolutely Dental @ Kirwan Plaza', 'Deeragun Dental', 'Ingham Health Services Dental Clinic', "Kylie's Family Dental"] },
    { theme: 'dental implants', prompt: 'Find dental implant specialists near me', ranks: ['My Family Dental', 'Absolutely Dental @ Kirwan Plaza', 'Bowen Dental', 'Hinchinbrook Dental Group', 'Meta Dental Haus', 'Deeragun Dental', 'Emerald Family Dental Care', 'Innisfail Dentists', 'Kirwan Dentist Dental Implants', 'Aspire Dental'] },
    { theme: 'dental implants', prompt: 'Locate affordable dental implant services nearby', ranks: ['My Family Dental', 'Bowen Dental', 'Dental Balance NQ', 'Meta Dental Haus', 'Riverside Family Dental', 'CP Dental Emerald', 'Deeragun Dental', 'Hinchinbrook Dental Group', 'Kirwan Dentist', 'Serenity Dental CQ'] },
    { theme: 'teeth cleaning', prompt: '(aggregate)', ranks: ['My Family Dental', 'Deeragun Dental', 'Bowen Dental', 'Dental Balance NQ', 'Aspire Dental', 'CP Dental Emerald', 'Riverside Family Dental', 'Innisfail Dentists', 'Tropical Coast Dental', "Kylie's Family Dental"] },
    { theme: 'teeth cleaning', prompt: 'Best dental clinics for ultrasound teeth cleaning in my area', ranks: ['My Family Dental', 'Dental Balance NQ', 'Riverside Family Dental', 'Aspire Dental', 'Bolsover Dental Practice', 'Bowen Dental', 'Deeragun Dental', 'Hinchinbrook Dental Group', '1300SMILES Dentists Ingham', 'CP Dental Emerald'] },
    { theme: 'teeth cleaning', prompt: 'Find teeth cleaning services near me', ranks: ['My Family Dental', 'Deeragun Dental', 'Aspire Dental', 'Bowen Dental', 'CP Dental Emerald', 'Innisfail Dentists', 'Absolutely Dental @ Kirwan Plaza', 'Dental On Bowen', 'Emerald Family Dental Care', 'Hinchinbrook Dental Group'] },
    { theme: 'teeth cleaning', prompt: 'Top rated dentists for plaque removal and teeth cleaning nearby', ranks: ['My Family Dental', 'Dental Balance NQ', 'Tropical Coast Dental', 'Bowen Dental', 'Central Highlands Dental', 'Deeragun Dental', 'The Hinchinbrook Dental Group', 'Aspire Dental', 'CP Dental Emerald', 'Ingham Hospital Dental Clinic'] },
    { theme: 'teeth whitening', prompt: '(aggregate)', ranks: ['My Family Dental', 'Bowen Dental', 'Serenity Dental CQ', 'Dental Balance NQ', 'Sundown Family Dental', 'Deeragun Dental', 'Hinchinbrook Dental Group', 'Innisfail Family Dental', 'Absolutely Dental @ Kirwan Plaza', "Kylie's Family Dental"] },
    { theme: 'teeth whitening', prompt: 'Best teeth whitening clinics in my area', ranks: ['My Family Dental', 'Dental Balance NQ', 'Bowen Dental', 'Serenity Dental CQ', 'Sundown Family Dental', 'Aspire Dental', 'Deeragun Dental', 'Hello My Dental', 'Hinchinbrook Dental Group', 'Innisfail Family Dental'] },
    { theme: 'teeth whitening', prompt: 'Find professional teeth whitening services near me', ranks: ['My Family Dental', 'Deeragun Dental', 'Absolutely Dental @ Kirwan Plaza', 'Bowen Dental', 'Serenity Dental CQ', 'Sundown Family Dental', 'Dental Balance NQ', 'Dental On Bowen', 'Hinchinbrook Dental Group', 'Emerald Family Dental Care'] },
    { theme: 'teeth whitening', prompt: 'Top rated laser teeth whitening providers nearby', ranks: ['My Family Dental', 'Absolutely Dental', 'Bowen Dental', 'Innisfail Family Dental', 'Serenity Dental CQ', 'Dental Balance NQ', 'Central Highlands Dental', 'Deeragun Dental', 'Hinchinbrook Dental Group', 'Bolsover Dental Practice'] },
    { theme: 'tooth extraction', prompt: '(aggregate)', ranks: ['My Family Dental', 'Bowen Dental', 'Deeragun Dental', 'Riverside Family Dental', 'Serenity Dental CQ', 'Hello My Dental', 'Hinchinbrook Dental Group', 'Meta Dental Haus', 'National Dental Care (NDC) Townsville', 'Aspire Dental'] },
    { theme: 'tooth extraction', prompt: 'Find affordable wisdom tooth extraction specialists near me', ranks: ['My Family Dental', 'Bowen Dental', 'Deeragun Dental', 'Meta Dental Haus', 'CP Dental Emerald', 'Dental On Bowen', 'Ingham Hospital Dental Clinic', 'Riverside Family Dental', 'Absolutely Dental', 'Dental Precinct'] },
    { theme: 'tooth extraction', prompt: 'Search for local dental offices offering tooth extraction services', ranks: ['My Family Dental', 'Bowen Dental', 'Hello My Dental', 'Riverside Family Dental', 'Deeragun Dental', 'Aspire Dental', 'Hinchinbrook Dental Group', '1300 Smiles', 'Central Highlands Dental', 'Dental On Bowen'] },
    { theme: 'tooth extraction', prompt: 'Top rated tooth extraction clinics in my area', ranks: ['My Family Dental', 'Bowen Dental', 'National Dental Care (NDC) Townsville', 'Serenity Dental CQ', 'Central Highlands Dental', 'Deeragun Dental', 'Hinchinbrook Dental Group', 'Riverside Family Dental', 'Bolsover Dental Practice', 'Bowen Dental Clinic'] },
    { theme: 'wisdom teeth removal', prompt: '(aggregate)', ranks: ['My Family Dental', 'Bowen Dental', 'CP Dental Emerald', 'Serenity Dental CQ', 'Deeragun Dental', 'Dental On Bowen', 'Tropical Coast Dental', 'Edward Nguyen', 'Riverside Family Dental', 'Ingham Health Services Dental Clinic'] },
    { theme: 'wisdom teeth removal', prompt: 'Best clinics for wisdom teeth removal in my area', ranks: ['My Family Dental', 'Bowen Dental', 'Deeragun Dental', 'Serenity Dental CQ', 'Ingham Health Services Dental Clinic', "Kylie's Family Dental Bowen", 'Riverside Family Dental', 'CP Dental Emerald', 'Dental On Bowen', 'Dental Precinct'] },
    { theme: 'wisdom teeth removal', prompt: 'Find wisdom teeth removal specialists near me', ranks: ['My Family Dental', 'Bowen Dental', 'CP Dental Emerald', 'Serenity Dental CQ', 'Deeragun Dental', 'Dental Balance NQ', 'Dental On Bowen', 'Hinchinbrook Dental Group', 'Tropical Coast Dental', 'Absolutely Dental'] },
    { theme: 'wisdom teeth removal', prompt: 'Top rated oral surgeons for wisdom teeth extraction nearby', ranks: ['My Family Dental', 'Bowen Dental', 'CP Dental Emerald', 'Edward Nguyen', 'Cairns Oral Surgery', 'Dr. Edward Nguyen', 'Townsville Oral & Maxillofacial Surgery', 'Brian Finn', 'Integrated Oral Surgery', "Kylie's Family Dental Practice"] },
  ],
  Perplexity: [
    { theme: 'dental implants', prompt: '(aggregate)', ranks: ['My Family Dental', 'Bowen Dental', 'Dental Balance NQ', 'Hello My Dental (Emerald)', 'Deeragun Dental', 'Kirwan Dentist Dental Implants Clinic', 'Innisfail Dentists', 'Hello My Dental', 'Kirwan Dentist / Dental Implants Clinic', 'NQ Surgical Dentistry'] },
    { theme: 'dental implants', prompt: 'Best clinics for all on 4 dental implants in my area', ranks: ['My Family Dental', 'Bowen Dental', 'Hello My Dental', 'Kirwan Dentist Dental Implants Clinic', 'All-On-4 Clinic Australia', 'Deeragun Dental', 'Innisfail Dentists', 'Serenity Dental CQ', 'Townsville', 'All-On-4 Clinic'] },
    { theme: 'dental implants', prompt: 'Find dental implant specialists near me', ranks: ['My Family Dental', 'Bowen Dental', 'Kirwan Dentist / Dental Implants Clinic', 'NQ Surgical Dentistry', 'Deeragun Dental', 'Dental Balance NQ', 'Hello My Dental (Emerald)', 'Riverside Family Dental', 'Absolutely Dental @ Kirwan Plaza', 'Dental Precinct'] },
    { theme: 'dental implants', prompt: 'Locate affordable dental implant services nearby', ranks: ['My Family Dental', 'Bowen Dental', 'Dental Balance NQ', 'Hello My Dental (Emerald)', 'Parramatta', 'Charlestown', 'Emerald Dental Care', 'Sundown Family Dental – Innisfail', 'Affordable Dental', 'Aspire Dental (Kirwan)'] },
    { theme: 'teeth cleaning', prompt: '(aggregate)', ranks: ['My Family Dental', 'Absolutely Dental @ Kirwan Plaza', 'Sundown Family Dental', 'Deeragun Dental', 'Aspire Dental', 'Riverside Family Dental', 'Bowen Dental Pty Ltd', 'Townsville Dental Clinic', 'Bowen Dental', 'Dental On Bowen'] },
    { theme: 'teeth cleaning', prompt: 'Best dental clinics for ultrasound teeth cleaning in my area', ranks: ['My Family Dental', 'Townsville Dental Clinic', 'Absolutely Dental @ Kirwan Plaza', 'Dental On Bowen', 'Sundown Family Dental', 'Bupa Dental', 'Deeragun Dental', 'Kirwan Dentist', 'Riverside Family Dental', 'WhatClinic'] },
    { theme: 'teeth cleaning', prompt: 'Find teeth cleaning services near me', ranks: ['My Family Dental', 'Aspire Dental', 'Bowen Dental Pty Ltd', 'Sundown Family Dental', 'Absolutely Dental @ Kirwan Plaza', 'Deeragun Dental', 'Serenity Dental CQ', 'Bowen Dental', 'Casey Dentists', 'Central Highlands Dental'] },
    { theme: 'teeth cleaning', prompt: 'Top rated dentists for plaque removal and teeth cleaning nearby', ranks: ['My Family Dental', 'Absolutely Dental @ Kirwan Plaza', 'Bowen Dental', 'CP Dental Emerald', 'Deeragun Dental', 'Riverside Family Dental', 'Dental On Bowen', 'Dr Hoai Nguyen', 'Kirwan Dentist', 'Sundown Family Dental'] },
    { theme: 'teeth whitening', prompt: '(aggregate)', ranks: ['My Family Dental', 'Bowen Dental', 'Absolutely Dental @ Kirwan Plaza', 'Sundown Family Dental', 'Aspire Dental', 'PureSmile', 'Serenity Dental', 'Tropical Coast Dental (Innisfail)', 'Central Highlands Dental', 'CP Dental Emerald'] },
    { theme: 'teeth whitening', prompt: 'Best teeth whitening clinics in my area', ranks: ['My Family Dental', 'Absolutely Dental @ Kirwan Plaza', 'Bowen Dental', 'Hello My Dental', 'CP Dental Emerald', 'Deeragun Dental', 'PureSmile', 'Sundown Family Dental', 'Aspire Dental', 'Dental On Bowen'] },
    { theme: 'teeth whitening', prompt: 'Find professional teeth whitening services near me', ranks: ['My Family Dental', 'Aspire Dental', 'Bowen Dental', 'Hello My Dental / Smile Dentistry', 'Sundown Family Dental', 'CP Dental Emerald', 'Innisfail Dentists', 'Absolutely Dental @ Kirwan Plaza', 'Central Highlands Dental', 'Deeragun Dental'] },
    { theme: 'teeth whitening', prompt: 'Top rated laser teeth whitening providers nearby', ranks: ['My Family Dental', 'Absolutely Dental @ Kirwan Plaza', 'PureSmile', 'Serenity Dental', 'Tropical Coast Dental (Innisfail)', 'Bowen Dental', 'Central Highlands Dental', 'Kirwan Dentist', 'RealSelf', 'Dental On Bowen'] },
    { theme: 'tooth extraction', prompt: '(aggregate)', ranks: ['My Family Dental', 'Wisdom Teeth Clinics Brisbane', 'Bowen Dental', 'Innisfail Dentists', 'Deeragun Dental', 'Absolutely Dental @ Kirwan Plaza', 'Absolutely Dental Townsville', 'Choice Dental, Browns Plains', 'Dental On Bowen', 'Hello My Dental'] },
    { theme: 'tooth extraction', prompt: 'Find affordable wisdom tooth extraction specialists near me', ranks: ['My Family Dental', 'Wisdom Teeth Clinics Brisbane', 'Absolutely Dental Townsville', 'Choice Dental, Browns Plains', 'Dental On Bowen', 'Innisfail Dentists', 'Park Ridge Dental', 'Wisdom Teeth Clinics, Brisbane', 'Wisdom Teeth Removal Sydney', 'Bespoke Dental Studio'] },
    { theme: 'tooth extraction', prompt: 'Search for local dental offices offering tooth extraction services', ranks: ['My Family Dental', 'Bowen Dental', 'Hello My Dental', 'Kirwan Health Campus Dental Clinic', 'Deeragun Dental', 'Absolutely Dental @ Kirwan Plaza', 'Central Highlands Dental', 'Innisfail Dentists', 'Aspire Dental', "Kylie's Family Dental Bowen"] },
    { theme: 'tooth extraction', prompt: 'Top rated tooth extraction clinics in my area', ranks: ['My Family Dental', 'Absolutely Dental @ Kirwan Plaza', 'Bowen Dental', 'Deeragun Dental', 'Hello My Dental Emerald', 'Riverside Family Dental', 'Choice Dental (Browns Plains)', 'CP Dental Emerald', 'Dental Balance', 'Sundown Family Dental'] },
    { theme: 'wisdom teeth removal', prompt: '(aggregate)', ranks: ['My Family Dental', 'Dental On Bowen', 'Absolutely Dental @ Kirwan Plaza', 'Central Queensland Oral Surgery', 'Max Oral Surgery', 'Cairns Oral Surgery', 'oral surgeons in Bohle Plains, Queensland', 'Serenity Dental CQ', "St Vincent's Private Hospitals", 'Deeragun Dental'] },
    { theme: 'wisdom teeth removal', prompt: 'Best clinics for wisdom teeth removal in my area', ranks: ['My Family Dental', 'Absolutely Dental @ Kirwan Plaza', 'Dental On Bowen', 'Serenity Dental CQ', 'Cairns Oral Surgery', 'Deeragun Dental', 'oral and maxillofacial surgeon', 'Bupa Dental clinics', 'Integrated Oral Surgery', 'NQ Surgical Dentistry'] },
    { theme: 'wisdom teeth removal', prompt: 'Find wisdom teeth removal specialists near me', ranks: ['My Family Dental', 'Absolutely Dental @ Kirwan Plaza', 'Bowen Dental', 'NQ Surgical Dentistry Townsville', 'Riverside Family Dental', 'Serenity Dental CQ – Emerald', 'Central Queensland Oral Surgery', 'Innisfail Dentists', 'Townsville Oral and Maxillofacial Surgery', 'Deeragun Dental'] },
    { theme: 'wisdom teeth removal', prompt: 'Top rated oral surgeons for wisdom teeth extraction nearby', ranks: ['Max Oral Surgery', 'Central Queensland Oral Surgery', 'Dental On Bowen', 'My Family Dental', 'oral surgeons in Bohle Plains, Queensland', "St Vincent's Private Hospitals", 'Cairns Oral Surgery', 'Dr Justus Pienaar', 'general dental clinic in Browns Plains', "St Vincent's Private Hospitals oral and maxillofacial surgery"] },
  ],
  All: [
    { theme: 'dental implants', prompt: '(aggregate)', ranks: ['My Family Dental', 'Bowen Dental', 'Innisfail Dentists', 'Dental Balance NQ', 'Serenity Dental CQ', 'Deeragun Dental', 'Hello My Dental', 'Hinchinbrook Dental Group', 'CP Dental Emerald', 'Meta Dental Haus'] },
    { theme: 'dental implants', prompt: 'Best clinics for all on 4 dental implants in my area', ranks: ['My Family Dental', 'Bowen Dental', 'Innisfail Dentists', 'Serenity Dental CQ', 'Absolutely Dental @ Kirwan Plaza, Townsville', 'Hello My Dental', 'Kirwan Dentist Dental Implants Clinic', 'Deeragun Dental', 'All On 4 Plus® Townsville', 'All-On-4 Clinic Australia'] },
    { theme: 'dental implants', prompt: 'Find dental implant specialists near me', ranks: ['My Family Dental', 'Bowen Dental', 'Innisfail Dentists', 'Absolutely Dental @ Kirwan Plaza', 'CP Dental Emerald', 'Deeragun Dental', 'Bowen Dental Pty Ltd', 'Hinchinbrook Dental Group', 'Kirwan Dentist / Dental Implants Clinic', 'Meta Dental Haus'] },
    { theme: 'dental implants', prompt: 'Locate affordable dental implant services nearby', ranks: ['My Family Dental', 'Dental Balance NQ', 'Bowen Dental', 'Hinchinbrook Dental Group', 'Hello My Dental', 'CP Dental Emerald', 'Hello My Dental (Emerald)', "Kylie's Family Dental", 'Meta Dental Haus', 'Parramatta'] },
    { theme: 'teeth cleaning', prompt: '(aggregate)', ranks: ['My Family Dental', 'Deeragun Dental', 'Bowen Dental Pty Ltd', 'Aspire Dental', 'Sundown Family Dental', 'CP Dental Emerald', 'Bowen Dental', 'Innisfail Dentists', 'Riverside Family Dental', 'Absolutely Dental @ Kirwan Plaza'] },
    { theme: 'teeth cleaning', prompt: 'Best dental clinics for ultrasound teeth cleaning in my area', ranks: ['My Family Dental', 'Riverside Family Dental', 'Absolutely Dental @ Kirwan Plaza, Townsville', 'Bowen Dental Pty Ltd', 'Dental Balance NQ', 'Serenity Dental CQ Emerald', 'The Hinchinbrook Dental Group', 'Townsville Dental Clinic', 'Sundown Family Dental', 'Innisfail Dentists'] },
    { theme: 'teeth cleaning', prompt: 'Find teeth cleaning services near me', ranks: ['My Family Dental', 'Aspire Dental', 'Deeragun Dental', 'Bowen Dental Pty Ltd', 'CP Dental Emerald', 'Sundown Family Dental', 'Bowen Dental', 'Innisfail Dentists', 'Absolutely Dental @ Kirwan Plaza', 'National Dental Care Townsville'] },
    { theme: 'teeth cleaning', prompt: 'Top rated dentists for plaque removal and teeth cleaning nearby', ranks: ['My Family Dental', 'Dental Balance NQ', 'Absolutely Dental @ Kirwan Plaza', 'Absolutely Dental @ Kirwan Plaza, Townsville', 'Bowen Dental', 'Bowen Dental Pty Ltd', 'CP Dental - Dentist Emerald', 'Deeragun Dental', 'Hinchinbrook Dental Group', 'Riverside Family Dental Innisfail'] },
    { theme: 'teeth whitening', prompt: '(aggregate)', ranks: ['My Family Dental', 'Bowen Dental', 'Sundown Family Dental', 'Hinchinbrook Dental Group', 'CP Dental Emerald', 'Absolutely Dental @ Kirwan Plaza', 'Serenity Dental CQ', 'Central Highlands Dental', 'Deeragun Dental', 'Aspire Dental'] },
    { theme: 'teeth whitening', prompt: 'Best teeth whitening clinics in my area', ranks: ['My Family Dental', 'Bowen Dental', 'Sundown Family Dental', 'CP Dental Emerald', 'Hello My Dental', 'Hinchinbrook Dental Group', 'Absolutely Dental @ Kirwan Plaza', 'Dental Balance NQ', 'Central Highlands Dental', 'Innisfail Dentists'] },
    { theme: 'teeth whitening', prompt: 'Find professional teeth whitening services near me', ranks: ['My Family Dental', 'Sundown Family Dental', 'Bowen Dental', 'Aspire Dental', 'CP Dental Emerald', 'Deeragun Dental', 'Hinchinbrook Dental Group', 'Serenity Dental CQ', 'Absolutely Dental @ Kirwan Plaza', 'Bowen Dental Pty Ltd'] },
    { theme: 'teeth whitening', prompt: 'Top rated laser teeth whitening providers nearby', ranks: ['My Family Dental', 'Bowen Dental', 'Sundown Family Dental', 'Hinchinbrook Dental Group', 'Central Highlands Dental', 'Absolutely Dental', 'Absolutely Dental @ Kirwan Plaza', 'Absolutely Dental @ Kirwan Plaza, Townsville', 'Innisfail Family Dental', 'PureSmile'] },
    { theme: 'tooth extraction', prompt: '(aggregate)', ranks: ['My Family Dental', 'Bowen Dental', 'Innisfail Dentists', 'Deeragun Dental', 'Riverside Family Dental', 'CP Dental Emerald', 'Bowen Dental Pty Ltd', 'Hello My Dental', 'Dental On Bowen', 'Serenity Dental CQ'] },
    { theme: 'tooth extraction', prompt: 'Find affordable wisdom tooth extraction specialists near me', ranks: ['My Family Dental', 'Bowen Dental', 'Wisdom Teeth Clinics Brisbane', 'Dental On Bowen', 'Innisfail Dentists', '1300SMILES Dentists Townsville City', 'Absolutely Dental Townsville', 'Choice Dental, Browns Plains', 'Deeragun Dental', 'Meta Dental Haus'] },
    { theme: 'tooth extraction', prompt: 'Search for local dental offices offering tooth extraction services', ranks: ['My Family Dental', 'Bowen Dental', 'Hello My Dental', 'Innisfail Dentists', 'Deeragun Dental', 'Riverside Family Dental', 'CP Dental Emerald', 'Kirwan Health Campus Dental Clinic', 'Absolutely Dental @ Kirwan Plaza, Townsville', 'Bowen Dental Pty Ltd'] },
    { theme: 'tooth extraction', prompt: 'Top rated tooth extraction clinics in my area', ranks: ['My Family Dental', 'Bowen Dental', 'Serenity Dental CQ', 'Sundown Family Dental', 'Bowen Dental Pty Ltd', 'Deeragun Dental', 'Hinchinbrook Dental Group', 'Innisfail Dentists', 'National Dental Care (NDC) Townsville', 'Riverside Family Dental'] },
    { theme: 'wisdom teeth removal', prompt: '(aggregate)', ranks: ['My Family Dental', 'Serenity Dental CQ', 'Bowen Dental', 'CP Dental Emerald', 'Dental On Bowen', 'National Dental Care Townsville', 'Riverside Family Dental Innisfail', 'Deeragun Dental', 'Bowen Dental Pty Ltd', 'Cairns Oral Surgery'] },
    { theme: 'wisdom teeth removal', prompt: 'Best clinics for wisdom teeth removal in my area', ranks: ['My Family Dental', 'Serenity Dental CQ', 'Deeragun Dental', 'CP Dental Emerald', 'Dental On Bowen', 'Absolutely Dental @ Kirwan Plaza', 'Bowen Dental', 'Bowen Dental Pty Ltd', 'National Dental Care Townsville', 'Absolutely Dental @ Kirwan Plaza, Townsville'] },
    { theme: 'wisdom teeth removal', prompt: 'Find wisdom teeth removal specialists near me', ranks: ['My Family Dental', 'CP Dental Emerald', 'Bowen Dental', 'Innisfail Dentists', 'Bowen Dental Pty Ltd', 'National Dental Care Townsville', 'Riverside Family Dental Innisfail', 'Serenity Dental CQ', 'NQ Surgical Dentistry Townsville', 'Deeragun Dental'] },
    { theme: 'wisdom teeth removal', prompt: 'Top rated oral surgeons for wisdom teeth extraction nearby', ranks: ['My Family Dental', 'Bowen Dental', 'Cairns Oral Surgery', 'Max Oral Surgery', 'Serenity Dental CQ', 'Dental On Bowen', 'Central Queensland Oral Surgery', 'CP Dental Emerald', 'Edward Nguyen', 'National Dental Care Townsville'] },
  ],
}

export interface VisibilityShareRow extends Record<string, unknown> {
  timeRange: string
  competitor: string
  rank: number | null
  shareOfVoice: number
  isYou: boolean
}
export const VISIBILITY_SHARE: Record<VisibilityPlatform, VisibilityShareRow[]> = {
  ChatGPT: [
    { timeRange: 'Apr', competitor: 'My Family Dental', rank: null, shareOfVoice: 22.1, isYou: true },
    { timeRange: 'Apr', competitor: 'Innisfail Dentists', rank: null, shareOfVoice: 4.3, isYou: false },
    { timeRange: 'Apr', competitor: 'National Dental Care Townsville', rank: null, shareOfVoice: 3.3, isYou: false },
    { timeRange: 'Apr', competitor: 'Riverside Family Dental Innisfail', rank: null, shareOfVoice: 2.5, isYou: false },
    { timeRange: 'Apr', competitor: 'Absolutely Dental @ Kirwan Plaza, Townsville', rank: null, shareOfVoice: 1.8, isYou: false },
    { timeRange: 'Apr', competitor: 'Sundown Family Dental', rank: null, shareOfVoice: 2.5, isYou: false },
    { timeRange: 'Apr', competitor: 'Bowen Dental Pty Ltd', rank: null, shareOfVoice: 1.8, isYou: false },
    { timeRange: 'Apr', competitor: 'CP Dental Emerald', rank: null, shareOfVoice: 0.0, isYou: false },
    { timeRange: 'Apr', competitor: 'Central Highlands Dental', rank: null, shareOfVoice: 1.8, isYou: false },
    { timeRange: 'Apr', competitor: 'Serenity Dental CQ', rank: null, shareOfVoice: 0.7, isYou: false },
    { timeRange: 'May', competitor: 'My Family Dental', rank: null, shareOfVoice: 24.1, isYou: true },
    { timeRange: 'May', competitor: 'Innisfail Dentists', rank: null, shareOfVoice: 4.4, isYou: false },
    { timeRange: 'May', competitor: 'National Dental Care Townsville', rank: null, shareOfVoice: 3.8, isYou: false },
    { timeRange: 'May', competitor: 'Riverside Family Dental Innisfail', rank: null, shareOfVoice: 4.4, isYou: false },
    { timeRange: 'May', competitor: 'Absolutely Dental @ Kirwan Plaza, Townsville', rank: null, shareOfVoice: 3.5, isYou: false },
    { timeRange: 'May', competitor: 'Sundown Family Dental', rank: null, shareOfVoice: 3.5, isYou: false },
    { timeRange: 'May', competitor: 'Bowen Dental Pty Ltd', rank: null, shareOfVoice: 3.5, isYou: false },
    { timeRange: 'May', competitor: 'CP Dental Emerald', rank: null, shareOfVoice: 1.3, isYou: false },
    { timeRange: 'May', competitor: 'Central Highlands Dental', rank: null, shareOfVoice: 1.9, isYou: false },
    { timeRange: 'May', competitor: 'Serenity Dental CQ', rank: null, shareOfVoice: 2.5, isYou: false },
    { timeRange: 'Jun', competitor: 'My Family Dental', rank: 1, shareOfVoice: 26.1, isYou: true },
    { timeRange: 'Jun', competitor: 'Innisfail Dentists', rank: 2, shareOfVoice: 4.9, isYou: false },
    { timeRange: 'Jun', competitor: 'National Dental Care Townsville', rank: 3, shareOfVoice: 4.5, isYou: false },
    { timeRange: 'Jun', competitor: 'Riverside Family Dental Innisfail', rank: 4, shareOfVoice: 4.5, isYou: false },
    { timeRange: 'Jun', competitor: 'Absolutely Dental @ Kirwan Plaza, Townsville', rank: 5, shareOfVoice: 4.2, isYou: false },
    { timeRange: 'Jun', competitor: 'Sundown Family Dental', rank: 6, shareOfVoice: 4.2, isYou: false },
    { timeRange: 'Jun', competitor: 'Bowen Dental Pty Ltd', rank: 7, shareOfVoice: 3.1, isYou: false },
    { timeRange: 'Jun', competitor: 'CP Dental Emerald', rank: 8, shareOfVoice: 3.1, isYou: false },
    { timeRange: 'Jun', competitor: 'Central Highlands Dental', rank: 9, shareOfVoice: 2.8, isYou: false },
    { timeRange: 'Jun', competitor: 'Serenity Dental CQ', rank: 10, shareOfVoice: 2.8, isYou: false },
  ],
  Gemini: [
    { timeRange: 'Apr', competitor: 'My Family Dental', rank: null, shareOfVoice: 18.5, isYou: true },
    { timeRange: 'Apr', competitor: 'Deeragun Dental', rank: null, shareOfVoice: 2.8, isYou: false },
    { timeRange: 'Apr', competitor: 'Bowen Dental', rank: null, shareOfVoice: 3.5, isYou: false },
    { timeRange: 'Apr', competitor: 'Dental Balance NQ', rank: null, shareOfVoice: 3.5, isYou: false },
    { timeRange: 'Apr', competitor: 'Serenity Dental CQ', rank: null, shareOfVoice: 3.3, isYou: false },
    { timeRange: 'Apr', competitor: 'CP Dental Emerald', rank: null, shareOfVoice: 2.6, isYou: false },
    { timeRange: 'Apr', competitor: 'Riverside Family Dental', rank: null, shareOfVoice: 2.6, isYou: false },
    { timeRange: 'Apr', competitor: 'Aspire Dental', rank: null, shareOfVoice: 4.7, isYou: false },
    { timeRange: 'Apr', competitor: 'Dental On Bowen', rank: null, shareOfVoice: 1.9, isYou: false },
    { timeRange: 'Apr', competitor: 'Hinchinbrook Dental Group', rank: null, shareOfVoice: 2.8, isYou: false },
    { timeRange: 'May', competitor: 'My Family Dental', rank: null, shareOfVoice: 21.1, isYou: true },
    { timeRange: 'May', competitor: 'Deeragun Dental', rank: null, shareOfVoice: 3.1, isYou: false },
    { timeRange: 'May', competitor: 'Bowen Dental', rank: null, shareOfVoice: 3.8, isYou: false },
    { timeRange: 'May', competitor: 'Dental Balance NQ', rank: null, shareOfVoice: 0.8, isYou: false },
    { timeRange: 'May', competitor: 'Serenity Dental CQ', rank: null, shareOfVoice: 2.5, isYou: false },
    { timeRange: 'May', competitor: 'CP Dental Emerald', rank: null, shareOfVoice: 2.3, isYou: false },
    { timeRange: 'May', competitor: 'Riverside Family Dental', rank: null, shareOfVoice: 2.8, isYou: false },
    { timeRange: 'May', competitor: 'Aspire Dental', rank: null, shareOfVoice: 1.8, isYou: false },
    { timeRange: 'May', competitor: 'Dental On Bowen', rank: null, shareOfVoice: 1.8, isYou: false },
    { timeRange: 'May', competitor: 'Hinchinbrook Dental Group', rank: null, shareOfVoice: 3.6, isYou: false },
    { timeRange: 'Jun', competitor: 'My Family Dental', rank: 1, shareOfVoice: 22.2, isYou: true },
    { timeRange: 'Jun', competitor: 'Deeragun Dental', rank: 2, shareOfVoice: 4.9, isYou: false },
    { timeRange: 'Jun', competitor: 'Bowen Dental', rank: 3, shareOfVoice: 3.9, isYou: false },
    { timeRange: 'Jun', competitor: 'Dental Balance NQ', rank: 4, shareOfVoice: 3.6, isYou: false },
    { timeRange: 'Jun', competitor: 'Serenity Dental CQ', rank: 5, shareOfVoice: 3.4, isYou: false },
    { timeRange: 'Jun', competitor: 'CP Dental Emerald', rank: 6, shareOfVoice: 2.8, isYou: false },
    { timeRange: 'Jun', competitor: 'Riverside Family Dental', rank: 7, shareOfVoice: 2.8, isYou: false },
    { timeRange: 'Jun', competitor: 'Aspire Dental', rank: 8, shareOfVoice: 2.6, isYou: false },
    { timeRange: 'Jun', competitor: 'Dental On Bowen', rank: 9, shareOfVoice: 2.6, isYou: false },
    { timeRange: 'Jun', competitor: 'Hinchinbrook Dental Group', rank: 10, shareOfVoice: 2.6, isYou: false },
  ],
  Perplexity: [
    { timeRange: 'Apr', competitor: 'My Family Dental', rank: null, shareOfVoice: 17.3, isYou: true },
    { timeRange: 'Apr', competitor: 'Deeragun Dental', rank: null, shareOfVoice: 3.7, isYou: false },
    { timeRange: 'Apr', competitor: 'Absolutely Dental @ Kirwan Plaza', rank: null, shareOfVoice: 2.3, isYou: false },
    { timeRange: 'Apr', competitor: 'Bowen Dental', rank: null, shareOfVoice: 3.1, isYou: false },
    { timeRange: 'Apr', competitor: 'Innisfail Dentists', rank: null, shareOfVoice: 2.9, isYou: false },
    { timeRange: 'Apr', competitor: 'Riverside Family Dental', rank: null, shareOfVoice: 2.5, isYou: false },
    { timeRange: 'Apr', competitor: 'Dental On Bowen', rank: null, shareOfVoice: 1.7, isYou: false },
    { timeRange: 'Apr', competitor: 'Sundown Family Dental', rank: null, shareOfVoice: 2.5, isYou: false },
    { timeRange: 'Apr', competitor: 'Aspire Dental', rank: null, shareOfVoice: 3.1, isYou: false },
    { timeRange: 'Apr', competitor: 'Central Highlands Dental', rank: null, shareOfVoice: 2.1, isYou: false },
    { timeRange: 'May', competitor: 'My Family Dental', rank: null, shareOfVoice: 17.5, isYou: true },
    { timeRange: 'May', competitor: 'Deeragun Dental', rank: null, shareOfVoice: 3.5, isYou: false },
    { timeRange: 'May', competitor: 'Absolutely Dental @ Kirwan Plaza', rank: null, shareOfVoice: 1.6, isYou: false },
    { timeRange: 'May', competitor: 'Bowen Dental', rank: null, shareOfVoice: 3.0, isYou: false },
    { timeRange: 'May', competitor: 'Innisfail Dentists', rank: null, shareOfVoice: 2.2, isYou: false },
    { timeRange: 'May', competitor: 'Riverside Family Dental', rank: null, shareOfVoice: 3.0, isYou: false },
    { timeRange: 'May', competitor: 'Dental On Bowen', rank: null, shareOfVoice: 1.8, isYou: false },
    { timeRange: 'May', competitor: 'Sundown Family Dental', rank: null, shareOfVoice: 2.8, isYou: false },
    { timeRange: 'May', competitor: 'Aspire Dental', rank: null, shareOfVoice: 1.8, isYou: false },
    { timeRange: 'May', competitor: 'Central Highlands Dental', rank: null, shareOfVoice: 1.4, isYou: false },
    { timeRange: 'Jun', competitor: 'My Family Dental', rank: 1, shareOfVoice: 24.0, isYou: true },
    { timeRange: 'Jun', competitor: 'Deeragun Dental', rank: 2, shareOfVoice: 4.4, isYou: false },
    { timeRange: 'Jun', competitor: 'Absolutely Dental @ Kirwan Plaza', rank: 3, shareOfVoice: 3.5, isYou: false },
    { timeRange: 'Jun', competitor: 'Bowen Dental', rank: 4, shareOfVoice: 3.5, isYou: false },
    { timeRange: 'Jun', competitor: 'Innisfail Dentists', rank: 5, shareOfVoice: 3.5, isYou: false },
    { timeRange: 'Jun', competitor: 'Riverside Family Dental', rank: 6, shareOfVoice: 2.8, isYou: false },
    { timeRange: 'Jun', competitor: 'Dental On Bowen', rank: 7, shareOfVoice: 2.5, isYou: false },
    { timeRange: 'Jun', competitor: 'Sundown Family Dental', rank: 8, shareOfVoice: 2.5, isYou: false },
    { timeRange: 'Jun', competitor: 'Aspire Dental', rank: 9, shareOfVoice: 1.9, isYou: false },
    { timeRange: 'Jun', competitor: 'Central Highlands Dental', rank: 10, shareOfVoice: 1.9, isYou: false },
  ],
  All: [
    { timeRange: 'Apr', competitor: 'My Family Dental', rank: null, shareOfVoice: 18.8, isYou: true },
    { timeRange: 'Apr', competitor: 'Deeragun Dental', rank: null, shareOfVoice: 3.0, isYou: false },
    { timeRange: 'Apr', competitor: 'Innisfail Dentists', rank: null, shareOfVoice: 3.3, isYou: false },
    { timeRange: 'Apr', competitor: 'Bowen Dental', rank: null, shareOfVoice: 2.9, isYou: false },
    { timeRange: 'Apr', competitor: 'Sundown Family Dental', rank: null, shareOfVoice: 2.4, isYou: false },
    { timeRange: 'Apr', competitor: 'Serenity Dental CQ', rank: null, shareOfVoice: 2.1, isYou: false },
    { timeRange: 'Apr', competitor: 'CP Dental Emerald', rank: null, shareOfVoice: 1.9, isYou: false },
    { timeRange: 'Apr', competitor: 'Dental Balance NQ', rank: null, shareOfVoice: 2.7, isYou: false },
    { timeRange: 'Apr', competitor: 'Central Highlands Dental', rank: null, shareOfVoice: 2.4, isYou: false },
    { timeRange: 'Apr', competitor: 'Aspire Dental', rank: null, shareOfVoice: 3.7, isYou: false },
    { timeRange: 'May', competitor: 'My Family Dental', rank: null, shareOfVoice: 20.4, isYou: true },
    { timeRange: 'May', competitor: 'Deeragun Dental', rank: null, shareOfVoice: 3.0, isYou: false },
    { timeRange: 'May', competitor: 'Innisfail Dentists', rank: null, shareOfVoice: 3.0, isYou: false },
    { timeRange: 'May', competitor: 'Bowen Dental', rank: null, shareOfVoice: 2.8, isYou: false },
    { timeRange: 'May', competitor: 'Sundown Family Dental', rank: null, shareOfVoice: 2.8, isYou: false },
    { timeRange: 'May', competitor: 'Serenity Dental CQ', rank: null, shareOfVoice: 2.3, isYou: false },
    { timeRange: 'May', competitor: 'CP Dental Emerald', rank: null, shareOfVoice: 2.1, isYou: false },
    { timeRange: 'May', competitor: 'Dental Balance NQ', rank: null, shareOfVoice: 1.6, isYou: false },
    { timeRange: 'May', competitor: 'Central Highlands Dental', rank: null, shareOfVoice: 1.9, isYou: false },
    { timeRange: 'May', competitor: 'Aspire Dental', rank: null, shareOfVoice: 1.8, isYou: false },
    { timeRange: 'Jun', competitor: 'My Family Dental', rank: 1, shareOfVoice: 23.9, isYou: true },
    { timeRange: 'Jun', competitor: 'Deeragun Dental', rank: 2, shareOfVoice: 3.4, isYou: false },
    { timeRange: 'Jun', competitor: 'Innisfail Dentists', rank: 3, shareOfVoice: 3.4, isYou: false },
    { timeRange: 'Jun', competitor: 'Bowen Dental', rank: 4, shareOfVoice: 3.1, isYou: false },
    { timeRange: 'Jun', competitor: 'Sundown Family Dental', rank: 5, shareOfVoice: 2.9, isYou: false },
    { timeRange: 'Jun', competitor: 'Serenity Dental CQ', rank: 6, shareOfVoice: 2.6, isYou: false },
    { timeRange: 'Jun', competitor: 'CP Dental Emerald', rank: 7, shareOfVoice: 2.5, isYou: false },
    { timeRange: 'Jun', competitor: 'Dental Balance NQ', rank: 8, shareOfVoice: 2.4, isYou: false },
    { timeRange: 'Jun', competitor: 'Central Highlands Dental', rank: 9, shareOfVoice: 2.3, isYou: false },
    { timeRange: 'Jun', competitor: 'Aspire Dental', rank: 10, shareOfVoice: 2.1, isYou: false },
  ],
}

export interface VisibilityPositionRow extends Record<string, unknown> {
  timeRange: string
  competitor: string
  avgPosition: number
  isYou: boolean
}
export const AVG_VISIBILITY_POSITION: Record<VisibilityPlatform, VisibilityPositionRow[]> = {
  ChatGPT: [
    { timeRange: 'Apr', competitor: 'Absolutely Dental @ Kirwan Plaza, Townsville', avgPosition: 1.0, isYou: false },
    { timeRange: 'Apr', competitor: 'Bowen Dental Pty Ltd', avgPosition: 1.2, isYou: false },
    { timeRange: 'Apr', competitor: 'Riverside Family Dental Innisfail', avgPosition: 1.6, isYou: false },
    { timeRange: 'Apr', competitor: 'My Family Dental (You)', avgPosition: 1.8, isYou: true },
    { timeRange: 'Apr', competitor: 'National Dental Care Townsville', avgPosition: 1.9, isYou: false },
    { timeRange: 'May', competitor: 'Bowen Dental Pty Ltd', avgPosition: 1.0, isYou: false },
    { timeRange: 'May', competitor: 'Absolutely Dental @ Kirwan Plaza, Townsville', avgPosition: 1.3, isYou: false },
    { timeRange: 'May', competitor: 'National Dental Care Townsville', avgPosition: 1.8, isYou: false },
    { timeRange: 'May', competitor: 'Riverside Family Dental Innisfail', avgPosition: 1.9, isYou: false },
    { timeRange: 'May', competitor: 'My Family Dental (You)', avgPosition: 2.3, isYou: true },
    { timeRange: 'Jun', competitor: 'Bowen Dental Pty Ltd', avgPosition: 1.0, isYou: false },
    { timeRange: 'Jun', competitor: 'Absolutely Dental @ Kirwan Plaza, Townsville', avgPosition: 1.6, isYou: false },
    { timeRange: 'Jun', competitor: 'National Dental Care Townsville', avgPosition: 1.8, isYou: false },
    { timeRange: 'Jun', competitor: 'Riverside Family Dental Innisfail', avgPosition: 2.1, isYou: false },
    { timeRange: 'Jun', competitor: 'My Family Dental (You)', avgPosition: 2.1, isYou: true },
  ],
  Gemini: [
    { timeRange: 'Apr', competitor: 'Bowen Dental', avgPosition: 1.3, isYou: false },
    { timeRange: 'Apr', competitor: 'My Family Dental (You)', avgPosition: 2.0, isYou: true },
    { timeRange: 'Apr', competitor: 'Deeragun Dental', avgPosition: 2.1, isYou: false },
    { timeRange: 'Apr', competitor: 'Serenity Dental CQ', avgPosition: 3.1, isYou: false },
    { timeRange: 'Apr', competitor: 'Dental Balance NQ', avgPosition: 3.1, isYou: false },
    { timeRange: 'May', competitor: 'Bowen Dental', avgPosition: 1.3, isYou: false },
    { timeRange: 'May', competitor: 'Deeragun Dental', avgPosition: 1.8, isYou: false },
    { timeRange: 'May', competitor: 'My Family Dental (You)', avgPosition: 1.9, isYou: true },
    { timeRange: 'May', competitor: 'Serenity Dental CQ', avgPosition: 2.1, isYou: false },
    { timeRange: 'May', competitor: 'Dental Balance NQ', avgPosition: 3.3, isYou: false },
    { timeRange: 'Jun', competitor: 'Bowen Dental', avgPosition: 1.1, isYou: false },
    { timeRange: 'Jun', competitor: 'My Family Dental (You)', avgPosition: 1.9, isYou: true },
    { timeRange: 'Jun', competitor: 'Deeragun Dental', avgPosition: 2.3, isYou: false },
    { timeRange: 'Jun', competitor: 'Serenity Dental CQ', avgPosition: 2.6, isYou: false },
    { timeRange: 'Jun', competitor: 'Dental Balance NQ', avgPosition: 2.7, isYou: false },
  ],
  Perplexity: [
    { timeRange: 'Apr', competitor: 'Bowen Dental', avgPosition: 1.5, isYou: false },
    { timeRange: 'Apr', competitor: 'My Family Dental (You)', avgPosition: 1.5, isYou: true },
    { timeRange: 'Apr', competitor: 'Deeragun Dental', avgPosition: 3.2, isYou: false },
    { timeRange: 'Apr', competitor: 'Dental On Bowen', avgPosition: 3.3, isYou: false },
    { timeRange: 'Apr', competitor: 'Absolutely Dental @ Kirwan Plaza', avgPosition: 4.2, isYou: false },
    { timeRange: 'May', competitor: 'My Family Dental (You)', avgPosition: 1.6, isYou: true },
    { timeRange: 'May', competitor: 'Bowen Dental', avgPosition: 1.7, isYou: false },
    { timeRange: 'May', competitor: 'Dental On Bowen', avgPosition: 2.2, isYou: false },
    { timeRange: 'May', competitor: 'Deeragun Dental', avgPosition: 3.3, isYou: false },
    { timeRange: 'May', competitor: 'Absolutely Dental @ Kirwan Plaza', avgPosition: 3.8, isYou: false },
    { timeRange: 'Jun', competitor: 'Bowen Dental', avgPosition: 1.5, isYou: false },
    { timeRange: 'Jun', competitor: 'My Family Dental (You)', avgPosition: 1.5, isYou: true },
    { timeRange: 'Jun', competitor: 'Absolutely Dental @ Kirwan Plaza', avgPosition: 1.8, isYou: false },
    { timeRange: 'Jun', competitor: 'Dental On Bowen', avgPosition: 2.3, isYou: false },
    { timeRange: 'Jun', competitor: 'Deeragun Dental', avgPosition: 3.2, isYou: false },
  ],
  All: [
    { timeRange: 'Apr', competitor: 'Bowen Dental', avgPosition: 1.2, isYou: false },
    { timeRange: 'Apr', competitor: 'My Family Dental (You)', avgPosition: 1.8, isYou: true },
    { timeRange: 'Apr', competitor: 'CP Dental Emerald', avgPosition: 2.5, isYou: false },
    { timeRange: 'Apr', competitor: 'Deeragun Dental', avgPosition: 2.6, isYou: false },
    { timeRange: 'Apr', competitor: 'Innisfail Dentists', avgPosition: 2.8, isYou: false },
    { timeRange: 'May', competitor: 'Bowen Dental', avgPosition: 1.4, isYou: false },
    { timeRange: 'May', competitor: 'My Family Dental (You)', avgPosition: 2.0, isYou: true },
    { timeRange: 'May', competitor: 'CP Dental Emerald', avgPosition: 2.1, isYou: false },
    { timeRange: 'May', competitor: 'Deeragun Dental', avgPosition: 2.4, isYou: false },
    { timeRange: 'May', competitor: 'Innisfail Dentists', avgPosition: 2.7, isYou: false },
    { timeRange: 'Jun', competitor: 'Bowen Dental', avgPosition: 1.3, isYou: false },
    { timeRange: 'Jun', competitor: 'My Family Dental (You)', avgPosition: 1.8, isYou: true },
    { timeRange: 'Jun', competitor: 'CP Dental Emerald', avgPosition: 2.4, isYou: false },
    { timeRange: 'Jun', competitor: 'Innisfail Dentists', avgPosition: 2.8, isYou: false },
    { timeRange: 'Jun', competitor: 'Deeragun Dental', avgPosition: 2.8, isYou: false },
  ],
}

export interface ThemeVisibilityRow extends Record<string, unknown> {
  theme: string
  avgVisibility: number
  chatgpt: number
  gemini: number
  perplexity: number
}
export const THEMES_VISIBILITY: ThemeVisibilityRow[] = [
  { theme: 'teeth cleaning', avgVisibility: 69.9, chatgpt: 54.2, gemini: 67.6, perplexity: 88.0 },
  { theme: 'wisdom teeth removal', avgVisibility: 63.6, chatgpt: 59.3, gemini: 73.3, perplexity: 58.3 },
  { theme: 'tooth extraction', avgVisibility: 62.2, chatgpt: 45.8, gemini: 74.3, perplexity: 66.4 },
  { theme: 'dental implants', avgVisibility: 61.4, chatgpt: 55.7, gemini: 64.1, perplexity: 64.4 },
  { theme: 'teeth whitening', avgVisibility: 52.6, chatgpt: 41.7, gemini: 54.5, perplexity: 61.6 },
]

export interface LocationVisibilityRow extends Record<string, unknown> {
  location: string
  avgVisibility: number
  chatgpt: number
  gemini: number
  perplexity: number
}
export const LOCATIONS_VISIBILITY: LocationVisibilityRow[] = [
  { location: 'Bohle Plains QLD', avgVisibility: 93.3, chatgpt: 100.0, gemini: 93.3, perplexity: 86.7 },
  { location: 'Ingham QLD', avgVisibility: 78.9, chatgpt: 63.3, gemini: 96.7, perplexity: 76.7 },
  { location: 'Innisfail QLD', avgVisibility: 69.0, chatgpt: 51.1, gemini: 66.9, perplexity: 88.9 },
  { location: 'Kirwan QLD', avgVisibility: 44.1, chatgpt: 32.2, gemini: 52.2, perplexity: 47.8 },
  { location: 'Bowen QLD', avgVisibility: 43.4, chatgpt: 27.8, gemini: 45.8, perplexity: 56.7 },
  { location: 'Emerald QLD', avgVisibility: 43.0, chatgpt: 33.6, gemini: 45.7, perplexity: 49.7 },
]
