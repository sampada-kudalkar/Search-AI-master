export interface AgentWorkflow {
  nodes: any[]
  nodeDetails: Record<string, any>
}

// Helper — all triggers use Conversation trigger subtype
const CONV_TRIGGER = {
  flowType: 'trigger' as const,
  data: {
    subtype: 'Conversation trigger',
    headerLabel: 'Conversation trigger',
    hasToggle: true,
    toggleEnabled: true,
    titlePlaceholder: 'Enter trigger name',
    descriptionPlaceholder: 'Enter description',
    hasAiIcon: false,
  },
}

// ─── Frontdesk Agent ─────────────────────────────────────────────────────────
// Workflow: Conversation trigger → Procedures (greet, detect intent, route)

const FRONTDESK_NODES = [
  { id: 'fd-1', ...CONV_TRIGGER, data: { ...CONV_TRIGGER.data, title: 'Inbound call, chat, or text' } },
  {
    id: 'fd-2',
    flowType: 'procedures',
    data: { title: 'Route to Procedure', subtype: 'Procedures', hasToggle: true, toggleEnabled: true, hasAiIcon: false, titlePlaceholder: 'Enter task name', descriptionPlaceholder: 'Enter description' },
  },
]

const FRONTDESK_NODE_DETAILS: Record<string, any> = {
  '__start__': {
    agentName: 'Frontdesk agent',
    goals: "Handle all inbound customer interactions via voice, webchat, and text. Serve as the dealership's intelligent receptionist, routing calls, answering questions, and scheduling appointments.",
    outcomes: 'Callers are greeted with a branded message, intent is detected and confirmed, and each caller is routed to the appropriate procedure — all within the first 30 seconds.',
    locations: ['1001 - Mountain View, CA', '1002 - Seattle, WA', '1004 - Chicago, IL', '1006 - Las Vegas, NV'],
  },
  'fd-1': {
    triggerName: 'Inbound call, chat, or text',
    description: 'Fires when any inbound customer interaction is received — voice call, webchat message, or SMS text.',
    voiceConditions: [{ field: 'channel', operator: 'is', value: 'Inbound voice call' }],
    webchatConditions: [{ field: 'channel', operator: 'is', value: 'Web chat or SMS message' }],
  },
  'fd-2': {
    procedureIds: [
      'Greeting & Intent Detection',
      'Talk to Human',
      'General Inquiry',
      'Handle Unclear Message',
      'Emergency / Urgent Handling',
      'Spanish Language Handling',
    ],
  },
}

// ─── Reminder Agent ──────────────────────────────────────────────────────────
// Workflow: Conversation trigger → Send confirmation → Delay 24h → SMS reminder
//           → Branch (Confirmed | Reschedule | No response → Delay 22h → Voice call)

const REMINDER_NODES = [
  { id: 'rem-1', ...CONV_TRIGGER, data: { ...CONV_TRIGGER.data, title: 'Appointment Scheduled' } },
  {
    id: 'rem-2',
    flowType: 'task',
    data: { title: 'Send Appointment Confirmation', subtype: 'Integration', hasToggle: true, toggleEnabled: true, hasAiIcon: false, titlePlaceholder: 'Enter task name', descriptionPlaceholder: 'Enter description' },
  },
  {
    id: 'rem-3',
    flowType: 'delay',
    data: { title: 'Wait until T-24h', subtype: 'Delay', hasToggle: true, toggleEnabled: true, hasAiIcon: false, titlePlaceholder: 'Enter delay name', descriptionPlaceholder: 'Enter description' },
  },
  {
    id: 'rem-4',
    flowType: 'task',
    data: { title: 'T-24h SMS Reminder', subtype: 'Integration', hasToggle: true, toggleEnabled: true, hasAiIcon: false, titlePlaceholder: 'Enter task name', descriptionPlaceholder: 'Enter description' },
  },
  {
    id: 'rem-5',
    flowType: 'branch',
    data: { title: 'Customer Response', subtype: 'Branch', hasToggle: true, toggleEnabled: true, hasAiIcon: false, titlePlaceholder: 'Enter branch name', descriptionPlaceholder: 'Enter description' },
  },
]

const REMINDER_NODE_DETAILS: Record<string, any> = {
  '__start__': {
    agentName: 'Reminder agent',
    goals: 'Manage appointment confirmation and reminder journeys through multi-channel touchpoints — SMS, voice, and email — to reduce no-shows and improve service lane throughput.',
    outcomes: 'Appointment confirmation rates improve, no-shows decrease, and customers receive timely reminders with one-click reschedule options.',
    locations: ['1001 - Mountain View, CA', '1002 - Seattle, WA', '1004 - Chicago, IL'],
  },
  'rem-1': {
    triggerName: 'Appointment Scheduled',
    description: 'Fires when a new appointment is created or confirmed in the DMS for any configured location.',
    voiceConditions: [{ field: 'event', operator: 'is', value: 'Appointment created in DMS' }],
    webchatConditions: [{ field: 'event', operator: 'is', value: 'SMS opt-in received' }],
  },
  'rem-2': {
    taskName: 'Send Appointment Confirmation',
    description: 'Send immediate SMS confirmation with appointment details, date, time, and service advisor name.',
    selectedTools: ['dms-integration', 'send-confirmation'],
  },
  'rem-3': { name: 'Wait until T-24h', duration: '24', unit: 'hours' },
  'rem-4': {
    taskName: 'T-24h SMS Reminder',
    description: 'Send SMS reminder with confirm/reschedule quick-reply options 24 hours before the appointment.',
    selectedTools: ['send-confirmation', 'schedule-appointment'],
  },
  'rem-5': {
    basedOn: 'conditions',
    branches: [
      { id: 'rem-5-path-1', name: 'Confirmed' },
      { id: 'rem-5-path-2', name: 'Reschedule Requested' },
      { id: 'rem-5-path-fallback', name: 'No response', isFallback: true },
    ],
  },
  'rem-5-path-1': {
    branchName: 'Confirmed',
    description: 'Customer confirmed appointment via quick-reply or voice',
    conditions: [],
    parentId: 'rem-5',
    isBranchPath: true,
    nodes: [
      { id: 'rem-6', flowType: 'task', data: { title: 'Mark Confirmed & Close Journey', subtype: 'Integration', hasToggle: true, toggleEnabled: true, hasAiIcon: false, titlePlaceholder: 'Enter task name', descriptionPlaceholder: 'Enter description' } },
    ],
  },
  'rem-5-path-2': {
    branchName: 'Reschedule Requested',
    description: 'Customer requested to reschedule or cancel',
    conditions: [],
    parentId: 'rem-5',
    isBranchPath: true,
    nodes: [
      { id: 'rem-7', flowType: 'procedures', data: { title: 'Process Reschedule', subtype: 'Procedures', hasToggle: true, toggleEnabled: true, hasAiIcon: false, titlePlaceholder: 'Enter task name', descriptionPlaceholder: 'Enter description' } },
    ],
  },
  'rem-5-path-fallback': {
    branchName: 'No response',
    description: 'No response received — escalate to T-2h voice call',
    conditions: [],
    parentId: 'rem-5',
    isBranchPath: true,
    isFallback: true,
    nodes: [
      { id: 'rem-8', flowType: 'delay', data: { title: 'Wait until T-2h', subtype: 'Delay', hasToggle: true, toggleEnabled: true, hasAiIcon: false, titlePlaceholder: 'Enter delay name', descriptionPlaceholder: 'Enter description' } },
      { id: 'rem-9', flowType: 'task', data: { title: 'T-2h Voice Confirmation Call', subtype: 'Integration', hasToggle: true, toggleEnabled: true, hasAiIcon: false, titlePlaceholder: 'Enter task name', descriptionPlaceholder: 'Enter description' } },
    ],
  },
  'rem-6': {
    taskName: 'Mark Confirmed & Close Journey',
    description: 'Mark appointment as confirmed in DMS and end the reminder journey.',
    selectedTools: ['dms-integration', 'crm-update'],
  },
  'rem-7': { procedureIds: ['Reschedule / Cancel Appointment'] },
  'rem-8': { name: 'Wait until T-2h', duration: '22', unit: 'hours' },
  'rem-9': {
    taskName: 'T-2h Voice Confirmation Call',
    description: 'Place outbound voice call for final confirmation 2 hours before the appointment.',
    selectedTools: ['voice-call', 'dms-integration', 'send-confirmation'],
  },
}

// ─── Outreach Agent ──────────────────────────────────────────────────────────
// Workflow: Conversation trigger → LLM outreach call → Branch (Interested | No Answer | Objection)

const OUTREACH_NODES = [
  { id: 'out-1', ...CONV_TRIGGER, data: { ...CONV_TRIGGER.data, title: 'Internet Lead Received' } },
  {
    id: 'out-2',
    flowType: 'task',
    data: { title: 'Initial Outreach Call', subtype: 'Custom', hasToggle: true, toggleEnabled: true, hasAiIcon: true, titlePlaceholder: 'Enter task name', descriptionPlaceholder: 'Enter description' },
  },
  {
    id: 'out-3',
    flowType: 'branch',
    data: { title: 'Lead Response', subtype: 'Branch', hasToggle: true, toggleEnabled: true, hasAiIcon: false, titlePlaceholder: 'Enter branch name', descriptionPlaceholder: 'Enter description' },
  },
]

const OUTREACH_NODE_DETAILS: Record<string, any> = {
  '__start__': {
    agentName: 'Outreach agent',
    goals: 'Execute proactive outbound journey workflows covering lead follow-up, customer re-engagement, recall notifications, and lifecycle marketing. Contact internet leads within 5 minutes of submission.',
    outcomes: 'Leads are contacted at speed-to-lead P0 targets, qualification notes are logged in CRM, and hot leads are immediately transferred to available sales consultants.',
    locations: ['1001 - Mountain View, CA', '1002 - Seattle, WA', '1004 - Chicago, IL', '1006 - Las Vegas, NV'],
  },
  'out-1': {
    triggerName: 'Internet Lead Received',
    description: 'Fires when a new internet lead is submitted from any configured lead source or website inquiry form.',
    voiceConditions: [{ field: 'event', operator: 'is', value: 'New internet lead submitted' }],
    webchatConditions: [{ field: 'event', operator: 'is', value: 'Website inquiry form submitted' }],
  },
  'out-2': {
    taskName: 'Initial Outreach Call',
    description: 'Introduce self, reference the specific inquiry, confirm interest and ask qualifying questions. Present matching inventory and offer test drive. Initiate within 5 minutes of lead receipt.',
    llmModel: 'Fast',
    systemPrompt: "You are calling on behalf of the dealership to follow up on an internet lead. Be professional, friendly, and reference the specific vehicle or inquiry. Your goal is to confirm interest, ask qualifying questions (budget, timeline, trade-in), and schedule a test drive or appointment.",
    userPrompt: 'Lead inquiry: {{Lead_inquiry}}\nVehicle interest: {{Vehicle_interest}}\nCustomer name: {{Customer_name}}',
  },
  'out-3': {
    basedOn: 'conditions',
    branches: [
      { id: 'out-3-path-1', name: 'Interested / Engaged' },
      { id: 'out-3-path-2', name: 'No Answer' },
      { id: 'out-3-path-fallback', name: 'Objection / Transfer', isFallback: true },
    ],
  },
  'out-3-path-1': {
    branchName: 'Interested / Engaged',
    description: 'Lead expressed interest — qualify and schedule',
    conditions: [],
    parentId: 'out-3',
    isBranchPath: true,
    nodes: [
      { id: 'out-4', flowType: 'procedures', data: { title: 'Qualify Lead & Schedule', subtype: 'Procedures', hasToggle: true, toggleEnabled: true, hasAiIcon: false, titlePlaceholder: 'Enter task name', descriptionPlaceholder: 'Enter description' } },
    ],
  },
  'out-3-path-2': {
    branchName: 'No Answer',
    description: 'Lead did not answer — leave voicemail and follow up via SMS',
    conditions: [],
    parentId: 'out-3',
    isBranchPath: true,
    nodes: [
      { id: 'out-5', flowType: 'task', data: { title: 'Voicemail + Follow-Up SMS', subtype: 'Integration', hasToggle: true, toggleEnabled: true, hasAiIcon: false, titlePlaceholder: 'Enter task name', descriptionPlaceholder: 'Enter description' } },
    ],
  },
  'out-3-path-fallback': {
    branchName: 'Objection / Transfer',
    description: 'Lead raised an objection or requested a manager',
    conditions: [],
    parentId: 'out-3',
    isBranchPath: true,
    isFallback: true,
    nodes: [
      { id: 'out-6', flowType: 'task', data: { title: 'Transfer to Sales Manager', subtype: 'Integration', hasToggle: true, toggleEnabled: true, hasAiIcon: false, titlePlaceholder: 'Enter task name', descriptionPlaceholder: 'Enter description' } },
    ],
  },
  'out-4': { procedureIds: ['Internet Lead Qualification', 'Test Drive Scheduling'] },
  'out-5': {
    taskName: 'Voicemail + Follow-Up SMS',
    description: 'Leave professional voicemail referencing the inquiry, then send follow-up SMS with callback link and top inventory match.',
    selectedTools: ['voice-call', 'send-confirmation', 'crm-update'],
  },
  'out-6': {
    taskName: 'Transfer to Sales Manager',
    description: 'Immediately transfer to available sales manager. Log objection or manager request in CRM with full conversation context.',
    selectedTools: ['trigger-escalation', 'crm-update', 'lead-routing'],
  },
}

// ─── Export ───────────────────────────────────────────────────────────────────

export const AGENT_WORKFLOWS: Record<string, AgentWorkflow> = {
  'Frontdesk agent': { nodes: FRONTDESK_NODES, nodeDetails: FRONTDESK_NODE_DETAILS },
  'Reminder agent':  { nodes: REMINDER_NODES,  nodeDetails: REMINDER_NODE_DETAILS  },
  'Outreach agent':  { nodes: OUTREACH_NODES,  nodeDetails: OUTREACH_NODE_DETAILS  },
}
