/**
 * WorkflowViewerTab
 * View-only workflow canvas on the Workflow tab of AgentInstanceScreen.
 * - No LHS drawer, no yellow banner, no editing
 * - Edit pencil lives inside the existing floating zoom toolbar (via onEdit prop)
 * - Canvas has left/right padding and rounded corners
 */
import React, { Suspense } from 'react'
import { AGENT_WORKFLOWS } from '../data/agentWorkflows'

// @ts-ignore
import AgentBuilderRaw from '../workflow/AgentBuilder/AgentBuilder'
const AgentBuilder = AgentBuilderRaw as unknown as React.ComponentType<any>

const EMPTY_WORKFLOW = {
  nodes: [],
  nodeDetails: { '__start__': { agentName: '', goals: '', outcomes: '', locations: [] } },
}

interface WorkflowViewerTabProps {
  instanceName: string
  onEdit: () => void
}

export function WorkflowViewerTab({ instanceName, onEdit }: WorkflowViewerTabProps) {
  // instanceName is e.g. "Frontdesk agent - North region"; extract the agent name prefix
  const agentName = instanceName.replace(/ - .+$/, '')
  const workflow = AGENT_WORKFLOWS[agentName] ?? EMPTY_WORKFLOW

  return (
    <div className="relative flex-1 overflow-hidden" style={{ height: '100%' }}>
      {/* Scoped CSS overrides */}
      <style>{`
        .wf-viewer .agent-builder__lhs    { display: none !important; }
        .wf-viewer .faq-ab-header         { display: none !important; }
        .wf-viewer .ab-view-banner        { display: none !important; }
        .wf-viewer .faq-ab-embedded       { height: 100% !important; }
        .wf-viewer .agent-builder-wrapper { background-color: #f8f9fb !important; background-image: radial-gradient(circle, #c8cdd8 1px, transparent 1px) !important; background-size: 28px 28px !important; margin: 0 20px 20px !important; border-radius: 12px !important; overflow: hidden !important; }
        /* Viewer: canvas rounded, no extra containers */
        .wf-viewer .agent-builder         { border-radius: 12px !important; overflow: hidden !important; }
        .wf-viewer .flow-canvas           { border-radius: 12px !important; }
        /* Hide orientation toggle (↓ →) in view-only mode only */
        .wf-viewer .graph-controls__toggle { display: none !important; }
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
            initialNodes={workflow.nodes}
            initialNodeDetails={workflow.nodeDetails}
          />
        </Suspense>
      </div>
    </div>
  )
}
