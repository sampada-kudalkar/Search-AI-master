import React, { Suspense } from 'react'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import AgentBuilderRaw from '../workflow/AgentBuilder/AgentBuilder'

// Cast to accept any props so TypeScript doesn't complain about JSX prop types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AgentBuilder = AgentBuilderRaw as unknown as React.ComponentType<any>

// Pre-populated FAQ agent workflow — same as Content Hub 2.0
const FAQ_NODES = [
  { id: 'n1', flowType: 'trigger', data: { title: '', subtype: 'Schedule-based', headerLabel: 'Schedule-based trigger', hasToggle: true, toggleEnabled: true, titlePlaceholder: 'Enter trigger name', descriptionPlaceholder: 'Enter description', hasAiIcon: false } },
  { id: 'n2', flowType: 'task',    data: { title: 'Collect web pages content for analysis',    subtype: 'Custom', hasToggle: true, toggleEnabled: true, titlePlaceholder: 'Enter task name', descriptionPlaceholder: 'Enter description', hasAiIcon: false } },
  { id: 'n3', flowType: 'task',    data: { title: 'Determine core search queries',             subtype: 'Custom', hasToggle: true, toggleEnabled: true, titlePlaceholder: 'Enter task name', descriptionPlaceholder: 'Enter description', hasAiIcon: true  } },
  { id: 'n4', flowType: 'task',    data: { title: 'Perplexity site search',                    subtype: 'Custom', hasToggle: true, toggleEnabled: true, titlePlaceholder: 'Enter task name', descriptionPlaceholder: 'Enter description', hasAiIcon: true  } },
  { id: 'n5', flowType: 'task',    data: { title: 'Extract PAA (People Also Ask) Questions',  subtype: 'Custom', hasToggle: true, toggleEnabled: true, titlePlaceholder: 'Enter task name', descriptionPlaceholder: 'Enter description', hasAiIcon: true  } },
  { id: 'n6', flowType: 'task',    data: { title: 'Analyze query fanouts',                     subtype: 'Custom', hasToggle: true, toggleEnabled: true, titlePlaceholder: 'Enter task name', descriptionPlaceholder: 'Enter description', hasAiIcon: true  } },
  { id: 'n7', flowType: 'task',    data: { title: 'Select FAQs from question pool',            subtype: 'Custom', hasToggle: true, toggleEnabled: true, titlePlaceholder: 'Enter task name', descriptionPlaceholder: 'Enter description', hasAiIcon: true  } },
  { id: 'n8', flowType: 'task',    data: { title: 'Generate AEO optimised FAQs',               subtype: 'Custom', hasToggle: true, toggleEnabled: true, titlePlaceholder: 'Enter task name', descriptionPlaceholder: 'Enter description', hasAiIcon: true  } },
]

const FAQ_NODE_DETAILS: Record<string, unknown> = {
  '__start__': { agentName: '', goals: '', outcomes: '', locations: [] },
  n1: { triggerName: 'Check for Search AI score', description: 'Runs automatically to generate FAQ recommendations whenever Search AI recommendations are generated. Best for improving Search AI score.', frequency: 'Daily', day: '7 days', time: '9:00 AM', conditions: [] },
  n2: { taskName: 'Collect web pages content for analysis',    description: 'Scrape selected business webpages to extract content and context.' },
  n3: { taskName: 'Determine core search queries',             description: 'Analyse scraped content to determine 3-5 primary search queries that define business.' },
  n4: { taskName: 'Perplexity site search',                    description: 'Query Perplexity using the core search queries to retrieve AI-generated answers and related FAQ structures.' },
  n5: { taskName: 'Extract PAA (People Also Ask) Questions',   description: 'Extract People Also Ask questions from Google for each of the core search queries.' },
  n6: { taskName: 'Analyze query fanouts',                     description: 'Expand core queries into long-tail and voice search variations.' },
  n7: { taskName: 'Select FAQs from question pool',            description: 'Cluster and score questions from all sources to pick the strongest 8–15.' },
  n8: { taskName: 'Generate AEO optimised FAQs',               description: 'Write final FAQ answers grounded in page facts and brand kit, optimised for AI citation.' },
}

interface WorkflowEditorScreenProps {
  agentName: string
  onClose: () => void
}

export function WorkflowEditorScreen({ agentName, onClose }: WorkflowEditorScreenProps) {
  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      <Suspense fallback={<div className="flex items-center justify-center h-full text-sm text-gray-400">Loading…</div>}>
        <AgentBuilder
          pageTitle={agentName}
          appTitle={agentName}
          onClose={onClose}
          moduleSlug="myna"
          moduleContext="myna"
          sectionContext="workflow"
          navItems={[]}
          initialNodes={FAQ_NODES}
          initialNodeDetails={FAQ_NODE_DETAILS}
        />
      </Suspense>
    </div>
  )
}
