/**
 * WorkflowViewerTab
 * View-only workflow canvas on the Workflow tab of AgentInstanceScreen.
 * - No LHS drawer, no yellow banner, no editing
 * - Edit pencil lives inside the existing floating zoom toolbar (via onEdit prop)
 * - Canvas has left/right padding and rounded corners
 */
import React, { Suspense } from 'react'

// @ts-ignore
import AgentBuilderRaw from '../workflow/AgentBuilder/AgentBuilder'
const AgentBuilder = AgentBuilderRaw as unknown as React.ComponentType<any>

const FAQ_NODES = [
  { id: 'n1', flowType: 'trigger', data: { title: '', subtype: 'Schedule-based', headerLabel: 'Schedule-based trigger', hasToggle: true, toggleEnabled: true, titlePlaceholder: 'Enter trigger name', descriptionPlaceholder: 'Enter description', hasAiIcon: false } },
  { id: 'n2', flowType: 'task', data: { title: 'Collect web pages content for analysis',   subtype: 'Custom', hasToggle: true, toggleEnabled: true, titlePlaceholder: 'Enter task name', descriptionPlaceholder: 'Enter description', hasAiIcon: false } },
  { id: 'n3', flowType: 'task', data: { title: 'Determine core search queries',             subtype: 'Custom', hasToggle: true, toggleEnabled: true, titlePlaceholder: 'Enter task name', descriptionPlaceholder: 'Enter description', hasAiIcon: true  } },
  { id: 'n4', flowType: 'task', data: { title: 'Perplexity site search',                    subtype: 'Custom', hasToggle: true, toggleEnabled: true, titlePlaceholder: 'Enter task name', descriptionPlaceholder: 'Enter description', hasAiIcon: true  } },
  { id: 'n5', flowType: 'task', data: { title: 'Extract PAA (People Also Ask) Questions',  subtype: 'Custom', hasToggle: true, toggleEnabled: true, titlePlaceholder: 'Enter task name', descriptionPlaceholder: 'Enter description', hasAiIcon: true  } },
  { id: 'n6', flowType: 'task', data: { title: 'Analyze query fanouts',                     subtype: 'Custom', hasToggle: true, toggleEnabled: true, titlePlaceholder: 'Enter task name', descriptionPlaceholder: 'Enter description', hasAiIcon: true  } },
  { id: 'n7', flowType: 'task', data: { title: 'Select FAQs from question pool',            subtype: 'Custom', hasToggle: true, toggleEnabled: true, titlePlaceholder: 'Enter task name', descriptionPlaceholder: 'Enter description', hasAiIcon: true  } },
  { id: 'n8', flowType: 'task', data: { title: 'Generate AEO optimised FAQs',               subtype: 'Custom', hasToggle: true, toggleEnabled: true, titlePlaceholder: 'Enter task name', descriptionPlaceholder: 'Enter description', hasAiIcon: true  } },
]

const FAQ_NODE_DETAILS: Record<string, unknown> = {
  '__start__': { agentName: '', goals: 'Handles customer conversations using your configured skills, procedures, and tools.', outcomes: 'Executes rule-based logic to route through qualifying templates and publish them automatically.', locations: ['1001 - Mountain View, CA', '1002 - Seattle, WA', '1004 - Chicago, IL', '1006 - Las Vegas, NV'] },
  n1: { triggerName: 'Check for Search AI score', description: 'Runs automatically to generate FAQ recommendations whenever Search AI recommendations are generated.', frequency: 'Daily', day: '7 days', time: '9:00 AM', conditions: [] },
  n2: { taskName: 'Collect web pages content for analysis',   description: 'Scrape selected business webpages to extract content and context.' },
  n3: { taskName: 'Determine core search queries',            description: 'Analyse scraped content to determine 3-5 primary search queries.' },
  n4: { taskName: 'Perplexity site search',                   description: 'Query Perplexity using the core search queries to retrieve AI-generated answers.' },
  n5: { taskName: 'Extract PAA (People Also Ask) Questions',  description: 'Extract People Also Ask questions from Google for each core search query.' },
  n6: { taskName: 'Analyze query fanouts',                    description: 'Expand core queries into long-tail and voice search variations.' },
  n7: { taskName: 'Select FAQs from question pool',           description: 'Cluster and score questions from all sources to pick the strongest 8–15.' },
  n8: { taskName: 'Generate AEO optimised FAQs',              description: 'Write final FAQ answers grounded in page facts and brand kit.' },
}

interface WorkflowViewerTabProps {
  instanceName: string
  onEdit: () => void
}

export function WorkflowViewerTab({ instanceName, onEdit }: WorkflowViewerTabProps) {
  return (
    <div className="relative flex-1 overflow-hidden" style={{ height: '100%' }}>
      {/* Scoped CSS overrides */}
      <style>{`
        .wf-viewer .agent-builder__lhs    { display: none !important; }
        .wf-viewer .faq-ab-header         { display: none !important; }
        .wf-viewer .ab-view-banner        { display: none !important; }
        .wf-viewer .faq-ab-embedded       { height: 100% !important; }
        .wf-viewer .agent-builder-wrapper { background: transparent !important; padding: 0 16px 16px !important; }
        .wf-viewer .agent-builder         { border-radius: 12px !important; overflow: hidden !important; }
        .wf-viewer .flow-canvas           { border-radius: 12px !important; }
      `}</style>

      <div className="wf-viewer" style={{ height: '100%' }}>
        <Suspense fallback={
          <div className="flex h-full items-center justify-center text-sm" style={{ color: '#9e9e9e' }}>
            Loading workflow…
          </div>
        }>
          <AgentBuilder
            pageTitle={instanceName}
            appTitle={instanceName}
            viewOnly={true}
            onEdit={onEdit}
            moduleSlug="myna"
            moduleContext="myna"
            sectionContext="workflow"
            navItems={[]}
            initialNodes={FAQ_NODES}
            initialNodeDetails={FAQ_NODE_DETAILS}
          />
        </Suspense>
      </div>
    </div>
  )
}
