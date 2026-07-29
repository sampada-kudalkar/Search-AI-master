import type { ReactNode } from 'react'
import { Icon } from '../components'
import { REC_LOCATIONS, type DomainHealthRecommendation } from '../data/domainHealthData'

const AI_SITES = ['ChatGPT', 'Gemini', 'Perplexity']

function card(children: ReactNode, className = '') {
  return <div className={`min-h-[400px] overflow-y-auto rounded-md border border-border bg-surface p-2xl ${className}`}>{children}</div>
}

export function DomainHealthRecommendationScreen({
  recommendation,
  onBack,
}: {
  recommendation: DomainHealthRecommendation
  onBack: () => void
}) {
  const r = recommendation
  const score = Math.min(99, 30 + r.impact * 7) + (r.impact % 3) * 0.7
  const scoreLabel = `${score.toFixed(1)}%`

  const whyMatters = `Inconsistent ${r.metric.toLowerCase()} signals across AI platforms can create confusion for potential customers, who may draw the wrong conclusion about ${r.domain}. This can result in missed opportunities, lost trust, and reduced visibility in AI-generated answers.`
  const whatFixingDoes = `Fixing "${r.title}" will improve how ChatGPT, Gemini, and Perplexity represent ${r.domain} for related queries, closing the gap between what's published and what AI assistants currently surface.`

  const steps = [
    `Fix the source data referenced by AI assistants — they are currently citing outdated or incomplete information related to "${r.title}".`,
    `After 30–60 days, verify that AI assistants return the corrected information when customers search for ${r.domain}.`,
  ]

  const citationCounts = AI_SITES.map((_, i) => 3 + ((r.impact + i) % 4))

  return (
    <div className="flex flex-1 min-h-0 min-w-0 flex-col">
      <div className="flex shrink-0 items-start justify-between gap-lg bg-surface px-2xl py-lg">
        <div className="flex items-start gap-sm">
          <button
            type="button"
            onClick={onBack}
            className="mt-[1px] flex size-9 items-center justify-center rounded-sm text-text-icon hover:bg-surface-hover"
          >
            <Icon name="arrow_back" size={20} />
          </button>
          <div>
            <div className="flex items-center gap-sm">
              <p className="text-[18px] leading-[26px] tracking-[-0.36px] text-text-primary">{r.title}</p>
              <a href={`https://${r.domain}`} target="_blank" rel="noopener noreferrer" className="flex items-center text-text-action">
                <Icon name="open_in_new" size={18} />
              </a>
            </div>
            <div className="mt-xs flex items-center gap-xs text-small text-text-tertiary">
              <Icon name="location_on" size={14} />
              {REC_LOCATIONS[r.domain] || r.domain}
            </div>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-sm">
          <button type="button" className="h-9 rounded-sm border border-border-selected bg-surface px-lg text-body text-text-primary hover:bg-surface-l2">
            Reject
          </button>
          <button type="button" className="h-9 rounded-sm bg-primary px-lg text-body text-white hover:bg-primary-hover">
            Accept
          </button>
          <button type="button" aria-label="More options" className="flex size-9 items-center justify-center rounded-sm border border-border-selected bg-surface text-text-icon hover:bg-surface-l2">
            <Icon name="more_vert" size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 min-w-0 overflow-y-auto bg-white">
        <div className="flex flex-col gap-lg px-2xl py-xl">
          <div className="grid grid-cols-2 gap-md">
            {card(
              <>
                <div className="mb-md text-small text-text-tertiary">What is your {r.metric} score</div>
                <div className="text-[32px] text-text-primary">{scoreLabel}</div>
              </>
            )}
            {card(
              <>
                <div className="mb-md text-small text-text-tertiary">Why does this recommendation matter</div>
                <div className="text-body leading-relaxed text-text-primary">{whyMatters}</div>
              </>
            )}
          </div>

          {card(
            <>
              <div className="mb-md text-small text-text-tertiary">What will fixing this do</div>
              <div className="text-body leading-relaxed text-text-primary">{whatFixingDoes}</div>
            </>
          )}

          {card(
            <>
              <div className="text-small text-text-tertiary">What to do next</div>
              <div className="mb-lg mt-xs text-xs text-text-tertiary">Step by step guide on what you need to do next</div>
              <div className="flex flex-col">
                {steps.map((step, i) => (
                  <div key={step} className={`flex gap-md ${i === steps.length - 1 ? '' : 'pb-lg'}`}>
                    <div className="flex shrink-0 flex-col items-center">
                      <div className="flex size-[22px] items-center justify-center rounded-full border border-border-strong text-xs text-text-secondary">
                        {i + 1}
                      </div>
                      {i !== steps.length - 1 && <div className="mt-xs w-px flex-1 bg-border" />}
                    </div>
                    <div className="pt-[2px] text-body leading-relaxed text-text-primary">{step}</div>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="min-h-[400px] overflow-hidden rounded-md border border-border bg-surface">
            <div className="px-2xl pb-xs pt-2xl">
              <div className="text-small text-text-tertiary">What AI sites show compared to your Birdeye profile</div>
              <div className="mt-xs text-xs text-text-tertiary">See how AI platforms are reporting your business information</div>
            </div>
            <table className="mt-md w-full border-collapse">
              <thead>
                <tr>
                  <th className="border-b border-border px-2xl py-md text-left text-small font-normal text-text-tertiary">Fields</th>
                  <th className="border-b border-border px-lg py-md text-left text-small font-normal text-text-tertiary">On Birdeye</th>
                  {AI_SITES.map((site) => (
                    <th key={site} className="border-b border-border px-lg py-md text-left text-small font-normal text-text-tertiary">
                      {site}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border-b border-[#f3f4f6] px-2xl py-lg text-body text-text-primary">Citations</td>
                  <td className="border-b border-[#f3f4f6] px-lg py-lg text-body text-text-action">Business profile</td>
                  {citationCounts.map((count, i) => (
                    <td key={i} className="border-b border-[#f3f4f6] px-lg py-lg text-body text-text-action">
                      {count} Citations
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-2xl py-lg align-top text-body text-text-primary">{r.metric}</td>
                  <td className="px-lg py-lg align-top text-body text-text-primary">Up to date</td>
                  {AI_SITES.map((site) => (
                    <td key={site} className="px-lg py-lg align-top text-body text-chip-danger-text">
                      Out of date
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
