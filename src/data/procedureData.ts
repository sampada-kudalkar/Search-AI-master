export type ProcedureCategory =
  | 'Inbound General'
  | 'Service'
  | 'Sales'
  | 'Parts'
  | 'After-Hours'
  | 'Outbound'

// ── Rich step model ─────────────────────────────────────────────
// A step has a title and a list of bullets. Each bullet is a sequence
// of inline tokens — plain strings interleaved with reference chips
// (tools, context variables, sub-agents, procedures) so the steps
// editor can render inline chips exactly like Figma.

export type RefKind = 'tool' | 'context' | 'subagent' | 'procedure' | 'file' | 'link'

export interface Ref {
  kind: RefKind
  label: string
}

export type Token = string | Ref

export interface Bullet {
  tokens: Token[]
}

export interface ProcedureStep {
  title: string
  bullets: Bullet[]
}

export interface ContextItem {
  kind: 'context' | 'file' | 'link'
  label: string
}

export interface Procedure {
  id: string
  name: string
  category: ProcedureCategory
  /** Short, one-or-two line summary shown on the library card. */
  description: string
  /** Last edited label shown in the card footer. */
  lastEdited: string
  /** Trigger description shown in the "When to use this procedure?" field. */
  whenToUse: string
  steps: ProcedureStep[]
  tools: string[]
  context: ContextItem[]
}

// Helper to build a chip token quickly inside step bullets.
const ref = (kind: RefKind, label: string): Ref => ({ kind, label })

// ── Raw source data (automotive frontdesk procedures) ───────────
interface RawProcedure {
  id: string
  name: string
  category: ProcedureCategory
  description: string
  whenToUse: string
  steps: string[]
  tools: string[]
}

const RAW: RawProcedure[] = [
  {
    id: 'p-001',
    name: 'Greet and open conversation',
    category: 'Inbound General',
    description: 'Identifies the caller, screens for urgency, and routes them to the right procedure.',
    whenToUse: 'Every inbound call, chat, or text session begins.',
    steps: [
      'Answer with the dealership-branded greeting including the agent name.',
      'Ask how the caller can be helped today.',
      'Use the intent classifier to detect department and purpose.',
      'Confirm the detected intent with the caller.',
      'Route to the appropriate procedure based on intent.',
    ],
    tools: ['Intent classifier', 'Knowledge base'],
  },
  {
    id: 'p-002',
    name: 'Handle general inquiry',
    category: 'Inbound General',
    description: 'Answers informational questions like hours, location, financing, and services.',
    whenToUse: 'Caller has a question that does not match a specific procedure.',
    steps: [
      'Listen to the full question before responding.',
      'Search the knowledge base for a matching answer.',
      'Provide a concise answer with source attribution.',
      'Ask if the caller has additional questions.',
      'Log the inquiry topic in CRM for analytics.',
    ],
    tools: ['Knowledge base', 'CRM update'],
  },
  {
    id: 'p-003',
    name: 'Department transfer',
    category: 'Inbound General',
    description: 'Routes the caller to the right department with a warm, context-rich handoff.',
    whenToUse: 'Caller requests a specific department or intent maps to another department.',
    steps: [
      'Confirm the department the caller wants to reach.',
      'Check business hours for the target department.',
      'If open, perform a warm transfer with a context summary.',
      'If closed, offer voicemail or callback scheduling.',
      'Log the transfer in CRM with a reason code.',
    ],
    tools: ['Check business hours', 'CRM update', 'Trigger escalation'],
  },
  {
    id: 'p-004',
    name: 'Handle unclear message',
    category: 'Inbound General',
    description: "Clarifies vague or out-of-scope messages to recover the caller's intent.",
    whenToUse: 'Speech-to-text confidence is low or caller intent is ambiguous.',
    steps: [
      'Apologize and ask the caller to rephrase.',
      'Offer 2–3 common intent options as suggestions.',
      'If still unclear, attempt one more rephrasing request.',
      'If unresolved, transfer to a human agent.',
    ],
    tools: ['ElevenLabs STT', 'Intent classifier', 'Trigger escalation'],
  },
  {
    id: 'p-006',
    name: 'Talk to human',
    category: 'Inbound General',
    description: 'Hands off to a live agent when the caller asks for a person or shows frustration.',
    whenToUse: 'Caller explicitly requests a human agent.',
    steps: [
      'Acknowledge the request without resistance.',
      'Ask if there is a specific person or department they need.',
      'Attempt a warm transfer with conversation context.',
      'If no one is available, offer a callback with an estimated wait time.',
      'Log the request and outcome in CRM.',
    ],
    tools: ['Trigger escalation', 'CRM update', 'Check business hours'],
  },
  {
    id: 'p-007',
    name: 'Identify caller',
    category: 'Inbound General',
    description: 'Confirms caller identity before any account or appointment action is taken.',
    whenToUse: 'Before performing any account-specific or appointment action.',
    steps: [
      'Ask for the name and phone number on the account.',
      'Match the details against the CRM record.',
      'Confirm the vehicle on file if relevant.',
      'Proceed only once identity is verified.',
    ],
    tools: ['Voice identity', 'CRM update'],
  },
  {
    id: 'p-008',
    name: 'Schedule service appointment',
    category: 'Service',
    description: 'Finds availability and schedules a new service visit for the customer.',
    whenToUse: 'Caller wants to book a service appointment.',
    steps: [
      'Collect vehicle year, make, model, and mileage.',
      'Ask for the type of service needed.',
      'Look up the VIN if available for service-history context.',
      'Check available appointment slots in the DMS.',
      'Confirm date, time, and service advisor.',
      'Send confirmation via SMS or email.',
      'Create the appointment record in the DMS.',
    ],
    tools: ['DMS integration', 'Schedule appointment', 'VIN decode', 'Send confirmation', 'CRM update'],
  },
  {
    id: 'p-012',
    name: 'Reschedule appointment',
    category: 'Service',
    description: 'Moves an existing upcoming appointment to a new time.',
    whenToUse: 'Caller wants to change an existing appointment.',
    steps: [
      'Verify caller identity and locate the appointment.',
      'Confirm which appointment to modify.',
      'Offer the next available slots.',
      'Update the DMS record and send confirmation.',
    ],
    tools: ['DMS integration', 'Schedule appointment', 'Send confirmation', 'CRM update'],
  },
  {
    id: 'p-012b',
    name: 'Cancel appointment',
    category: 'Service',
    description: 'Cancels an existing appointment and releases the slot.',
    whenToUse: 'Caller wants to cancel an existing appointment.',
    steps: [
      'Verify caller identity and locate the appointment.',
      'Confirm the cancellation and capture the reason.',
      'Release the slot back to availability.',
      'Update the DMS record and send confirmation.',
    ],
    tools: ['DMS integration', 'Send confirmation', 'CRM update'],
  },
  {
    id: 'p-008b',
    name: 'Book new appointment',
    category: 'Service',
    description: 'Finds availability and schedules a new visit for the customer.',
    whenToUse: 'Caller has no existing appointment and wants to book a visit.',
    steps: [
      'Confirm the reason for the visit.',
      'Check available appointment slots in the DMS.',
      'Offer the soonest options that fit the request.',
      'Confirm the booking and send confirmation.',
    ],
    tools: ['DMS integration', 'Schedule appointment', 'Send confirmation'],
  },
  {
    id: 'p-013b',
    name: 'Handle slot conflict',
    category: 'Service',
    description: 'Re-offers availability when the chosen slot was already taken.',
    whenToUse: 'The slot the caller picked is no longer available.',
    steps: [
      'Apologize for the conflict.',
      'Pull the next available slots from the DMS.',
      'Offer the closest alternatives to the original request.',
      'Confirm the new booking and send confirmation.',
    ],
    tools: ['DMS integration', 'Schedule appointment', 'Send confirmation'],
  },
  {
    id: 'p-009',
    name: 'Repair / diagnostic triage',
    category: 'Service',
    description: 'Triages a described vehicle problem and books the right level of service.',
    whenToUse: 'Caller describes a vehicle problem or warning light.',
    steps: [
      'Collect the symptom description and vehicle information.',
      'Ask clarifying questions about onset, frequency, and severity.',
      'Check the knowledge base for common diagnostic guidance.',
      'Assess urgency (safe to drive vs. immediate attention).',
      'Book a same-day or next-available appointment.',
      'Provide interim safety guidance.',
    ],
    tools: ['Knowledge base', 'DMS integration', 'Schedule appointment', 'VIN decode'],
  },
  {
    id: 'p-010',
    name: 'Recall inquiry',
    category: 'Service',
    description: 'Checks for open recalls on a vehicle and books recall service.',
    whenToUse: 'Caller asks about recalls on their vehicle.',
    steps: [
      'Collect the VIN or year/make/model.',
      'Query the NHTSA recall database for open recalls.',
      'Report the recall status and description to the caller.',
      'Offer to schedule recall service if an open recall exists.',
      'Book the appointment and send confirmation.',
    ],
    tools: ['VIN decode', 'NHTSA recall lookup', 'DMS integration', 'Schedule appointment', 'Send confirmation'],
  },
  {
    id: 'p-011',
    name: 'Service status check',
    category: 'Service',
    description: 'Reports the status and estimated completion of an in-progress repair.',
    whenToUse: 'Caller inquires about an in-progress repair.',
    steps: [
      'Verify caller identity and vehicle.',
      'Look up the active repair order in the DMS.',
      'Provide the current status and estimated completion time.',
      'Relay any additional work found and its cost.',
      'Offer to send a status update via text.',
    ],
    tools: ['DMS integration', 'Voice identity', 'Send confirmation'],
  },
  {
    id: 'p-013',
    name: 'Warranty inquiry',
    category: 'Service',
    description: 'Explains warranty coverage and books work under warranty when eligible.',
    whenToUse: 'Caller asks about warranty coverage.',
    steps: [
      'Collect the VIN and current mileage.',
      'Look up warranty status via DMS/OEM integration.',
      'Explain coverage periods and what is and is not covered.',
      'Offer to schedule under warranty if service is needed.',
    ],
    tools: ['VIN decode', 'DMS integration', 'Knowledge base'],
  },
  {
    id: 'p-014',
    name: 'New vehicle inquiry',
    category: 'Sales',
    description: 'Matches interest to inventory and captures a sales lead.',
    whenToUse: 'Caller is interested in purchasing a new vehicle.',
    steps: [
      'Ask about desired vehicle type, features, and budget.',
      'Search real-time inventory for matching vehicles.',
      'Present the top 2–3 options with key specs and pricing.',
      'Offer to schedule a test drive.',
      'Capture the lead in CRM and route to a sales consultant.',
    ],
    tools: ['Inventory search', 'CRM update', 'Lead routing', 'Schedule appointment'],
  },
  {
    id: 'p-015',
    name: 'Used / CPO vehicle inquiry',
    category: 'Sales',
    description: 'Matches pre-owned interest to inventory and shares vehicle history.',
    whenToUse: 'Caller is interested in pre-owned or certified vehicles.',
    steps: [
      'Ask about preferences: make, model, year range, budget, features.',
      'Search used/CPO inventory for matches.',
      'Highlight CPO certification benefits if applicable.',
      'Share a vehicle history summary.',
      'Offer to schedule a viewing or test drive.',
    ],
    tools: ['Inventory search', 'VIN decode', 'CRM update', 'Lead routing'],
  },
  {
    id: 'p-016',
    name: 'Trade-in valuation',
    category: 'Sales',
    description: 'Provides an estimated trade-in range and offers an in-person appraisal.',
    whenToUse: 'Caller wants to know the trade-in value of their current vehicle.',
    steps: [
      'Collect vehicle year, make, model, trim, and mileage.',
      'Ask about vehicle condition.',
      'Provide an estimated range based on market data.',
      'Add a disclaimer that the final value requires inspection.',
      'Offer to schedule an in-person appraisal.',
    ],
    tools: ['Knowledge base', 'CRM update', 'Schedule appointment'],
  },
  {
    id: 'p-017',
    name: 'Finance pre-qualification',
    category: 'Sales',
    description: 'Explains financing options and routes to F&I for detailed review.',
    whenToUse: 'Caller asks about financing options or payment estimates.',
    steps: [
      'Explain the general financing options available.',
      'Provide typical rate ranges without committing to specifics.',
      'Explain that pre-qualification requires F&I review.',
      'Offer to schedule with a finance manager.',
    ],
    tools: ['Knowledge base', 'CRM update', 'Lead routing', 'Schedule appointment'],
  },
  {
    id: 'p-018',
    name: 'Test drive scheduling',
    category: 'Sales',
    description: 'Confirms availability and books a test drive for the vehicles of interest.',
    whenToUse: 'Caller wants to schedule a test drive.',
    steps: [
      'Confirm the vehicle(s) of interest.',
      'Verify vehicle availability on the lot.',
      'Collect name, phone, and preferred date/time.',
      'Check sales consultant availability.',
      'Book the test drive and send confirmation.',
    ],
    tools: ['Inventory search', 'Schedule appointment', 'Send confirmation', 'CRM update', 'Lead routing'],
  },
  {
    id: 'p-019',
    name: 'Internet lead qualification',
    category: 'Sales',
    description: 'Follows up on an online inquiry and qualifies the lead.',
    whenToUse: 'Following up on an online form submission or website inquiry.',
    steps: [
      'Reference the specific vehicle or inquiry from the lead source.',
      'Confirm continued interest and timeline.',
      'Ask qualifying questions: budget, trade-in, financing.',
      'Present relevant inventory matches.',
      'Offer an immediate test drive or appointment.',
    ],
    tools: ['CRM update', 'Inventory search', 'Lead routing', 'Schedule appointment', 'Send confirmation'],
  },
  {
    id: 'p-020',
    name: 'Parts availability & pricing',
    category: 'Parts',
    description: 'Checks parts availability and pricing and offers to place an order.',
    whenToUse: 'Caller inquires about parts availability or pricing.',
    steps: [
      'Collect the part description or part number.',
      'Decode the VIN for exact fitment if available.',
      'Search the parts inventory in the DMS.',
      'Provide availability status and price range.',
      'Offer to place an order if not in stock.',
    ],
    tools: ['DMS integration', 'VIN decode', 'Knowledge base'],
  },
  {
    id: 'p-021',
    name: 'After-hours lead capture',
    category: 'After-Hours',
    description: 'Captures a sales inquiry received outside business hours for next-day follow-up.',
    whenToUse: 'A sales inquiry is received outside business hours.',
    steps: [
      'Inform the caller of current business hours.',
      'Capture name, phone, email, and vehicle interest.',
      'Assure a callback first thing the next business day.',
      'Send a confirmation text with business hours.',
      'Create a priority lead in CRM for morning follow-up.',
    ],
    tools: ['Check business hours', 'CRM update', 'Send confirmation', 'Lead routing'],
  },
  {
    id: 'p-022',
    name: 'After-hours service request',
    category: 'After-Hours',
    description: 'Triages a service inquiry received outside business hours.',
    whenToUse: 'A service inquiry is received outside business hours.',
    steps: [
      'Inform the caller of service department hours.',
      'Assess the urgency of the service need.',
      'Provide the roadside assistance number for emergencies.',
      'Capture details and schedule a callback for non-urgent needs.',
    ],
    tools: ['Check business hours', 'CRM update', 'Send confirmation'],
  },
  {
    id: 'p-023',
    name: 'Lead follow-up call',
    category: 'Outbound',
    description: 'Calls an internet lead within minutes to confirm interest and book a visit.',
    whenToUse: 'An internet lead is received and an outbound call is initiated within 5 minutes.',
    steps: [
      'Introduce yourself and reference the specific inquiry.',
      'Confirm interest and ask qualifying questions.',
      'Present matching inventory options.',
      'Offer to schedule a test drive or appointment.',
      'Leave a voicemail and send a follow-up SMS if no answer.',
    ],
    tools: ['CRM update', 'Inventory search', 'Schedule appointment', 'Send confirmation', 'Lead routing'],
  },
  {
    id: 'p-025',
    name: 'Appointment confirmation',
    category: 'Outbound',
    description: 'Runs the reminder journey that confirms a scheduled appointment.',
    whenToUse: 'An appointment is scheduled and the confirmation journey begins.',
    steps: [
      'Send an immediate SMS confirmation with appointment details.',
      'Send an SMS reminder 24 hours before with confirm/reschedule options.',
      'Place a final confirmation call 2 hours before.',
      'Process the response and update the appointment status in the DMS.',
    ],
    tools: ['DMS integration', 'Send confirmation', 'Schedule appointment'],
  },
  {
    id: 'p-026',
    name: 'No-show re-engagement',
    category: 'Outbound',
    description: 'Re-engages a customer who missed an appointment and offers easy rebooking.',
    whenToUse: 'Customer missed a scheduled appointment without canceling.',
    steps: [
      'Wait 2 hours after the missed appointment time.',
      'Send an empathetic SMS acknowledging the missed appointment.',
      'Offer a one-click rescheduling link.',
      'Follow up with a voice call if there is no response in 24 hours.',
    ],
    tools: ['DMS integration', 'CRM update', 'Send confirmation', 'Schedule appointment'],
  },
  {
    id: 'p-027',
    name: 'Lease maturity outreach',
    category: 'Outbound',
    description: 'Proactively presents lease-end options before a lease matures.',
    whenToUse: 'A customer lease matures within 90 days.',
    steps: [
      'Send an initial SMS introducing lease-end options.',
      'Present three paths: lease new, purchase, or return.',
      'Offer to schedule a consultation with a sales consultant.',
      'Follow up at 60, 30, and 14 days if there is no response.',
    ],
    tools: ['CRM update', 'DMS integration', 'Inventory search', 'Lead routing', 'Send confirmation', 'Schedule appointment'],
  },
  {
    id: 'p-029',
    name: 'Service lapse re-engagement',
    category: 'Outbound',
    description: 'Re-engages customers who have not visited for service in a while.',
    whenToUse: 'A customer has not visited for service in 6 or more months.',
    steps: [
      'Send a friendly SMS noting time since the last visit.',
      'Highlight recommended maintenance based on mileage estimate.',
      'Offer a convenient scheduling link.',
      'Include any current service specials or coupons.',
    ],
    tools: ['DMS integration', 'CRM update', 'Send confirmation', 'Schedule appointment', 'Knowledge base'],
  },
  {
    id: 'p-030',
    name: 'CSI follow-up',
    category: 'Outbound',
    description: 'Sends a satisfaction survey and escalates negative responses.',
    whenToUse: 'A customer completed a service or purchase within the last 48 hours.',
    steps: [
      'Send a satisfaction survey via SMS.',
      'Alert the service/sales manager immediately on a negative response.',
      'Thank the customer and request an online review on a positive response.',
      'Log the survey response in CRM.',
    ],
    tools: ['CRM update', 'Send confirmation', 'Tone analysis'],
  },
]

// ── Featured rich content (matches the Figma detail screen) ─────
// p-005 is the emergency/urgent procedure that the Figma detail and
// edit screens showcase, with structured steps, inline chips, and a
// filled context panel.
const EMERGENCY: Procedure = {
  id: 'p-005',
  name: 'Handle emergency or urgent concern',
  category: 'Inbound General',
  description: 'Detects urgent symptoms or safety issues and routes the caller fast, for caller safety.',
  lastEdited: 'May 18',
  whenToUse:
    "Caller describes a worsening problem, a safety issue, a breakdown they feel can't wait, anxiety about a vehicle fault, or any time-sensitive issue (but not life-threatening).",
  steps: [
    {
      title: 'Safety check first',
      bullets: [
        { tokens: ['State clearly: "If this is life-threatening — a fire, a crash, or anyone is hurt — please hang up and call 911 right now."'] },
        {
          tokens: [
            'Wait briefly for a response. If the caller confirms it is life-threatening → end with the 911 instruction ',
            ref('tool', 'End conversation'),
          ],
        },
      ],
    },
    {
      title: 'Acknowledge and triage',
      bullets: [
        { tokens: ['"I hear you — that sounds really stressful. Let\'s get you taken care of."'] },
        {
          tokens: [
            'One question only: is this a breakdown, a worsening fault, or a new concern ',
            ref('tool', 'agent_turn'),
          ],
        },
        { tokens: ['Do not assess, diagnose, or advise.'] },
      ],
    },
    {
      title: 'Route to care',
      bullets: [
        {
          tokens: [
            'If a same-day appointment is appropriate, invoke ',
            ref('subagent', 'Appointment_Management_agent'),
            ' ',
            ref('context', 'visit_type=urgent'),
          ],
        },
        {
          tokens: [
            'If immediate attention is needed → invoke ',
            ref('procedure', 'Escalate_to_staff'),
          ],
        },
        { tokens: ['Always confirm the next step explicitly: "I\'m connecting you to our service line now" or "You\'re booked at 2pm — please come straight in."'] },
      ],
    },
    {
      title: 'Close',
      bullets: [
        {
          tokens: ['Invoke ', ref('procedure', 'Close_session')],
        },
      ],
    },
  ],
  tools: ['patient_lookup', 'End conversation', 'agent_turn'],
  context: [
    { kind: 'context', label: 'Location.name' },
    { kind: 'context', label: 'Location.brand' },
    { kind: 'file', label: 'Products_list.PDF' },
    { kind: 'link', label: 'www.aspendental.com' },
  ],
}

// Default context set used to fill out non-featured procedures.
const DEFAULT_CONTEXT: ContextItem[] = [
  { kind: 'context', label: 'Location.name' },
  { kind: 'context', label: 'Location.hours' },
]

function transform(raw: RawProcedure): Procedure {
  return {
    id: raw.id,
    name: raw.name,
    category: raw.category,
    description: raw.description,
    lastEdited: 'May 18',
    whenToUse: raw.whenToUse,
    steps: raw.steps.map((title) => ({ title, bullets: [] })),
    tools: raw.tools,
    context: DEFAULT_CONTEXT,
  }
}

// Final list — emergency procedure inserted at position 3 to mirror Figma.
const transformed = RAW.map(transform)
export const PROCEDURES: Procedure[] = [
  ...transformed.slice(0, 2),
  EMERGENCY,
  ...transformed.slice(2),
]

export const ALL_CATEGORIES: ProcedureCategory[] = [
  'Inbound General',
  'Service',
  'Sales',
  'Parts',
  'After-Hours',
  'Outbound',
]
