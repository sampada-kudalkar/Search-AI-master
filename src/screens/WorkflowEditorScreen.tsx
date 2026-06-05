import React, { Suspense } from 'react'
import { AGENT_WORKFLOWS } from '../data/agentWorkflows'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import AgentBuilderRaw from '../workflow/AgentBuilder/AgentBuilder'

// Cast to accept any props so TypeScript doesn't complain about JSX prop types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AgentBuilder = AgentBuilderRaw as unknown as React.ComponentType<any>

const EMPTY_WORKFLOW = {
  nodes: [],
  nodeDetails: { '__start__': { agentName: '', goals: '', outcomes: '', locations: [] } },
}

interface WorkflowEditorScreenProps {
  agentName: string
  onClose: () => void
}

export function WorkflowEditorScreen({ agentName, onClose }: WorkflowEditorScreenProps) {
  // agentName may be "Frontdesk agent - North region" — strip the regional suffix
  const agentBaseName = agentName.replace(/ - .+$/, '')
  const workflow = AGENT_WORKFLOWS[agentBaseName] ?? EMPTY_WORKFLOW

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      <Suspense fallback={<div className="flex items-center justify-center h-full text-sm text-gray-400">Loading…</div>}>
        <AgentBuilder
          pageTitle={agentBaseName}
          appTitle={agentBaseName}
          onClose={onClose}
          moduleSlug="myna"
          moduleContext="myna"
          sectionContext="workflow"
          navItems={[]}
          initialNodes={workflow.nodes}
          initialNodeDetails={workflow.nodeDetails}
        />
      </Suspense>
    </div>
  )
}
