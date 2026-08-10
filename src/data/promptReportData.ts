export type PromptReportPlatform = 'ChatGPT' | 'Gemini' | 'Perplexity' | 'All'

export interface PromptSubRow {
  id: string
  prompt: string
  visibilityRank: number
  visibilityScore: string
  avgPosition: number
  citationShare: string
  citationRank: number
  executions: number
}

export interface PromptThemeRow {
  id: string
  theme: string
  visibilityRank: number
  visibilityScore: string
  avgPosition: number
  citationShare: string
  citationRank: number
  executions: number
  prompts: PromptSubRow[]
}

const makeTheme = (
  id: string,
  theme: string,
  vr: number, vs: string, ap: number, cs: string, cr: number, ex: number,
  prompts: PromptSubRow[]
): PromptThemeRow => ({ id, theme, visibilityRank: vr, visibilityScore: vs, avgPosition: ap, citationShare: cs, citationRank: cr, executions: ex, prompts })

const makePrompt = (id: string, prompt: string, vr: number, vs: string, ap: number, cs: string, cr: number, ex: number): PromptSubRow =>
  ({ id, prompt, visibilityRank: vr, visibilityScore: vs, avgPosition: ap, citationShare: cs, citationRank: cr, executions: ex })

export const PROMPT_REPORT_DATA: Record<PromptReportPlatform, PromptThemeRow[]> = {
  ChatGPT: [
    makeTheme('t1', 'Tax Return Amendments', 5, '37.83%', 2.83, '12.9%', 2, 6, [
      makePrompt('t1p1', 'Find professional services that can help me file an amended tax return…', 5, '37.83%', 2.83, '12.9%', 2, 6),
    ]),
    makeTheme('t2', 'Online Tax Filing', 1, '50%', 1.5, '9.09%', 4, 3, [
      makePrompt('t2p1', 'What is the best online platform for filing taxes this year?', 1, '52%', 1.3, '9.5%', 3, 3),
      makePrompt('t2p2', 'Find a trusted service for filing my tax return online', 2, '48%', 1.7, '8.7%', 5, 3),
    ]),
    makeTheme('t3', 'Small Business Tax Services', 2, '46.43%', 4, '10.53%', 3, 3, [
      makePrompt('t3p1', 'Find small business tax advisors near me', 2, '48%', 3.8, '11%', 3, 3),
      makePrompt('t3p2', 'Best accountants for small business tax planning', 3, '44%', 4.2, '10%', 4, 2),
    ]),
    makeTheme('t4', 'Tax Education and Resources', 1, '100%', 1, '13.04%', 1, 3, [
      makePrompt('t4p1', 'Where can I find free tax education resources online?', 1, '100%', 1, '13%', 1, 3),
    ]),
    makeTheme('t5', 'Tax Preparation Services', 4, '27.5%', 5, '13.64%', 1, 3, [
      makePrompt('t5p1', 'Find top-rated tax preparation services in my area', 4, '28%', 4.9, '14%', 1, 3),
      makePrompt('t5p2', 'Best tax prep services for individuals', 5, '27%', 5.1, '13.3%', 2, 2),
    ]),
  ],
  Gemini: [
    makeTheme('t1', 'Tax Return Amendments', 4, '41.2%', 2.5, '11.8%', 2, 5, [
      makePrompt('t1p1', 'Find professional services that can help me file an amended tax return…', 4, '41.2%', 2.5, '11.8%', 2, 5),
    ]),
    makeTheme('t2', 'Online Tax Filing', 2, '44%', 2.1, '8.5%', 3, 4, [
      makePrompt('t2p1', 'What is the best online platform for filing taxes this year?', 2, '46%', 2.0, '9%', 3, 4),
      makePrompt('t2p2', 'Find a trusted service for filing my tax return online', 3, '42%', 2.2, '8%', 4, 3),
    ]),
    makeTheme('t3', 'Small Business Tax Services', 3, '40%', 3.5, '9.8%', 3, 3, [
      makePrompt('t3p1', 'Find small business tax advisors near me', 3, '42%', 3.3, '10.1%', 3, 3),
      makePrompt('t3p2', 'Best accountants for small business tax planning', 4, '38%', 3.7, '9.5%', 4, 2),
    ]),
    makeTheme('t4', 'Tax Education and Resources', 1, '90%', 1.2, '12%', 1, 3, [
      makePrompt('t4p1', 'Where can I find free tax education resources online?', 1, '90%', 1.2, '12%', 1, 3),
    ]),
    makeTheme('t5', 'Tax Preparation Services', 3, '32%', 4.2, '12.5%', 2, 3, [
      makePrompt('t5p1', 'Find top-rated tax preparation services in my area', 3, '33%', 4.1, '13%', 2, 3),
      makePrompt('t5p2', 'Best tax prep services for individuals', 4, '31%', 4.3, '12%', 3, 2),
    ]),
  ],
  Perplexity: [
    makeTheme('t1', 'Tax Return Amendments', 6, '33%', 3.1, '10.5%', 3, 4, [
      makePrompt('t1p1', 'Find professional services that can help me file an amended tax return…', 6, '33%', 3.1, '10.5%', 3, 4),
    ]),
    makeTheme('t2', 'Online Tax Filing', 2, '47%', 1.8, '8%', 4, 3, [
      makePrompt('t2p1', 'What is the best online platform for filing taxes this year?', 2, '49%', 1.6, '8.5%', 4, 3),
      makePrompt('t2p2', 'Find a trusted service for filing my tax return online', 3, '45%', 2, '7.5%', 5, 2),
    ]),
    makeTheme('t3', 'Small Business Tax Services', 2, '48%', 3.8, '11%', 3, 3, [
      makePrompt('t3p1', 'Find small business tax advisors near me', 2, '50%', 3.6, '11.5%', 3, 3),
      makePrompt('t3p2', 'Best accountants for small business tax planning', 3, '46%', 4, '10.5%', 4, 2),
    ]),
    makeTheme('t4', 'Tax Education and Resources', 1, '95%', 1.1, '14%', 1, 3, [
      makePrompt('t4p1', 'Where can I find free tax education resources online?', 1, '95%', 1.1, '14%', 1, 3),
    ]),
    makeTheme('t5', 'Tax Preparation Services', 5, '24%', 5.2, '11.8%', 2, 2, [
      makePrompt('t5p1', 'Find top-rated tax preparation services in my area', 5, '25%', 5.1, '12%', 2, 2),
      makePrompt('t5p2', 'Best tax prep services for individuals', 6, '23%', 5.3, '11.6%', 3, 2),
    ]),
  ],
  All: [
    makeTheme('t1', 'Tax Return Amendments', 5, '37.34%', 2.8, '11.7%', 2, 5, [
      makePrompt('t1p1', 'Find professional services that can help me file an amended tax return…', 5, '37.34%', 2.8, '11.7%', 2, 5),
    ]),
    makeTheme('t2', 'Online Tax Filing', 1, '47%', 1.8, '8.5%', 4, 3, [
      makePrompt('t2p1', 'What is the best online platform for filing taxes this year?', 1, '49%', 1.6, '9%', 3, 3),
      makePrompt('t2p2', 'Find a trusted service for filing my tax return online', 3, '45%', 2, '8%', 5, 3),
    ]),
    makeTheme('t3', 'Small Business Tax Services', 2, '44.81%', 3.8, '10.5%', 3, 3, [
      makePrompt('t3p1', 'Find small business tax advisors near me', 2, '46%', 3.6, '10.9%', 3, 3),
      makePrompt('t3p2', 'Best accountants for small business tax planning', 3, '43%', 4, '10.1%', 4, 2),
    ]),
    makeTheme('t4', 'Tax Education and Resources', 1, '95%', 1.1, '13%', 1, 3, [
      makePrompt('t4p1', 'Where can I find free tax education resources online?', 1, '95%', 1.1, '13%', 1, 3),
    ]),
    makeTheme('t5', 'Tax Preparation Services', 4, '27.83%', 4.8, '12.65%', 2, 3, [
      makePrompt('t5p1', 'Find top-rated tax preparation services in my area', 4, '28.7%', 4.7, '13%', 2, 3),
      makePrompt('t5p2', 'Best tax prep services for individuals', 5, '26.9%', 4.9, '12.3%', 3, 2),
    ]),
  ],
}
