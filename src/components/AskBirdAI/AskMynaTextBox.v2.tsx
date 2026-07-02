"use client";

import { Ellipsis, LoaderCircle, X } from "lucide-react";
import { Button } from "../ui/button";
import {
  PromptInput,
  PromptInputAction,
  PromptInputActions,
  PromptInputTextarea,
} from "../ui/prompt-input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { cn } from "../../lib/utils";
import { L1_STRIP_ICON_STROKE_PX } from "./stubs";

// ─── Types ────────────────────────────────────────────────────────────────────

export type AskMynaTextBoxState =
  | "placeholder"
  | "point-edit"
  | "default"
  | "text"
  | "attachments"
  | "text-attachments"
  | "enhance-prompt-loading";

export interface AskMynaAttachment {
  id: string;
  name: string;
  /** Inferred from filename extension when omitted */
  type?: "pdf" | "image";
  thumbnailUrl?: string;
}

export interface AskMynaPointEditContext {
  label: string;
  icon?: React.ReactNode;
  onRemove?: () => void;
}

interface AskMynaTextBoxProps {
  value: string;
  onValueChange: (value: string) => void;
  attachments?: AskMynaAttachment[];
  onRemoveAttachment?: (id: string) => void;
  onAttachClick?: () => void;
  onSend?: () => void;
  onEnhancePrompt?: () => void;
  isSending?: boolean;
  isEnhanceLoading?: boolean;
  onStopSending?: () => void;
  showIgnoreConversationHistoryOption?: boolean;
  ignoreConversationHistory?: boolean;
  onIgnoreConversationHistoryChange?: (checked: boolean) => void;
  pointEditContext?: AskMynaPointEditContext | null;
  state?: AskMynaTextBoxState;
  emptyState?: "placeholder" | "default";
  className?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PLACEHOLDER_COPY =
  "What would you like to build? For example: Send a referral request when users leave a positive review.";

const ENHANCE_LOADING_COPY =
  "Act as a social media strategist. Update this content by adding a clear, engaging line about sustainable landscaping and the benefits of using native plants. Make sure the tone stays friendly and educational, and keep the language simple so readers quickly understand the message.";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function attachmentFileType(a: AskMynaAttachment): "pdf" | "image" {
  if (a.type) return a.type;
  const ext = a.name.split(".").pop()?.toLowerCase() ?? "";
  return ["jpg", "jpeg", "png", "gif", "webp", "svg", "avif"].includes(ext) ? "image" : "pdf";
}

function deriveState(
  forced: AskMynaTextBoxState | undefined,
  value: string,
  attachmentsCount: number,
  emptyState: "placeholder" | "default",
  isEnhanceLoading: boolean,
): AskMynaTextBoxState {
  if (forced) return forced;
  if (isEnhanceLoading) return "enhance-prompt-loading";
  if (value.trim() && attachmentsCount > 0) return "text-attachments";
  if (attachmentsCount > 0) return "attachments";
  if (value.trim()) return "text";
  return emptyState;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function FacebookBadge() {
  return (
    <span className="inline-flex size-4 shrink-0 items-center justify-center rounded-full bg-[#1877f2] text-[10px] font-medium text-white leading-none select-none">
      f
    </span>
  );
}

interface PointEditChipProps {
  label: string;
  icon?: React.ReactNode;
  onRemove?: () => void;
}

function PointEditChip({ label, icon, onRemove }: PointEditChipProps) {
  return (
    <div className="inline-flex h-7 items-center gap-1 rounded bg-white px-2 py-1 text-[12px] leading-[18px] text-[#555] ring-1 ring-[#1976d2] dark:bg-[#1f2430] dark:text-[#c8cfde] dark:ring-[#5580e0]">
      {icon ?? <FacebookBadge />}
      <span className="shrink-0">{label}</span>
      {onRemove && (
        <button
          type="button"
          className="ml-0.5 rounded p-0.5 transition-colors hover:bg-black/[0.06] dark:hover:bg-white/[0.08]"
          aria-label={`Remove ${label}`}
          onClick={onRemove}
        >
          <X className="size-3" />
        </button>
      )}
    </div>
  );
}

interface AttachmentRowProps {
  attachment: AskMynaAttachment;
  onRemove?: () => void;
}

function AttachmentRow({ attachment, onRemove }: AttachmentRowProps) {
  const isImage = attachmentFileType(attachment) === "image";
  return (
    <div className="flex items-center justify-between rounded border border-[#eaeaea] bg-[#f5f5f5] px-2 py-2 dark:border-[#3b4456] dark:bg-[#2b313d]">
      <div className="flex min-w-0 items-center gap-2">
        {isImage && attachment.thumbnailUrl ? (
          <img
            src={attachment.thumbnailUrl}
            alt=""
            className="size-5 shrink-0 rounded-sm object-cover"
          />
        ) : (
          /* PDF or image-without-thumbnail: use page/document icon */
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
            className="shrink-0 text-[#888]"
          >
            <path
              d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <polyline
              points="14 2 14 8 20 8"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
        <span className="truncate text-[14px] leading-5 tracking-[-0.28px] text-[#212121] dark:text-[#e4e4e4]">
          {attachment.name}
        </span>
      </div>
      {onRemove && (
        <button
          type="button"
          className="ml-2 shrink-0 rounded p-0.5 text-[#888] transition-colors hover:bg-black/[0.05] dark:text-[#9aa5ba] dark:hover:bg-white/[0.08]"
          aria-label={`Remove ${attachment.name}`}
          onClick={onRemove}
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function AskMynaTextBox({
  value,
  onValueChange,
  attachments = [],
  onRemoveAttachment,
  onAttachClick,
  onSend,
  onEnhancePrompt,
  isSending = false,
  isEnhanceLoading = false,
  onStopSending,
  showIgnoreConversationHistoryOption = false,
  ignoreConversationHistory = false,
  onIgnoreConversationHistoryChange,
  pointEditContext,
  state,
  emptyState = "default",
  className,
}: AskMynaTextBoxProps) {
  const activeState = deriveState(state, value, attachments.length, emptyState, isEnhanceLoading);

  const hasText = activeState === "text" || activeState === "text-attachments";
  const hasAttachments = activeState === "attachments" || activeState === "text-attachments";
  const isPointEdit = activeState === "point-edit";
  const isEnhanceLoadingState = activeState === "enhance-prompt-loading";
  const showChipArea = isPointEdit || isEnhanceLoadingState;
  const borderActive = hasText || hasAttachments || isPointEdit || isEnhanceLoadingState;

  const canSend =
    isSending ||
    isEnhanceLoadingState ||
    value.trim().length > 0 ||
    attachments.length > 0 ||
    isPointEdit;

  const chipCtx: AskMynaPointEditContext = pointEditContext ?? {
    label: "Facebook post",
    onRemove: undefined,
  };

  const handleSubmit = isSending && onStopSending ? onStopSending : onSend;
  const hasTypedInput = value.trim().length > 0;

  return (
    <PromptInput
      onSubmit={handleSubmit}
      isLoading={isSending}
      className={cn(
        "rounded-lg",
        /* Fill parent composer slot while preserving rounded chrome. */
        "h-full",
        borderActive &&
          "border-[#6834b7] focus-within:border-[#6834b7] dark:border-[#8e69d0] dark:focus-within:border-[#8e69d0]",
        className,
      )}
    >
      {/* ── Chip + static text (Point&Edit / Enhance Prompt Loading) ── */}
      {showChipArea && (
        <div className="flex flex-col gap-2 px-4 pt-4">
          <div>
            <PointEditChip
              label={chipCtx.label}
              icon={chipCtx.icon}
              onRemove={chipCtx.onRemove}
            />
          </div>
          <p className="text-[14px] leading-5 tracking-[-0.28px] text-[#212121] dark:text-[#e4e4e4]">
            {isEnhanceLoadingState
              ? ENHANCE_LOADING_COPY
              : value || "Add something about sustainable landscaping and native plants."}
          </p>
        </div>
      )}

      {/* ── Editable textarea (all states except chip area) ── */}
      {!showChipArea && (
        <PromptInputTextarea
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          placeholder={activeState === "placeholder" ? PLACEHOLDER_COPY : "Ask anything"}
          minRows={1}
          minHeightPx={42}
          className="text-[14px] leading-5 tracking-[-0.28px] placeholder:text-[#a3a3a3] dark:placeholder:text-[#7c8598]"
        />
      )}

      {/* ── Attachments — below text, above toolbar ── */}
      {hasAttachments && (
        <div className="flex flex-col gap-2 px-4 pb-2">
          {attachments.map((file) => (
            <AttachmentRow
              key={file.id}
              attachment={file}
              onRemove={onRemoveAttachment ? () => onRemoveAttachment(file.id) : undefined}
            />
          ))}
        </div>
      )}

      {/* ── Toolbar ── */}
      <PromptInputActions className="w-full h-8 gap-0 pl-0 pr-1 pb-0 pt-0">
        <div className="flex items-center justify-start gap-0">
          {/* Attach */}
          <PromptInputAction
            tooltip="Attach files"
            aria-label="Attach files"
            onClick={onAttachClick}
          >
            <img
              src="/attach_file.svg"
              alt=""
              aria-hidden
              width={20}
              height={20}
              className="h-[20px] w-[20px] shrink-0 opacity-60"
            />
          </PromptInputAction>

          {/* Enhance prompt / loading spinner */}
          {isEnhanceLoadingState ? (
            <PromptInputAction
              tooltip="Enhancing prompt…"
              aria-label="Enhancing prompt"
              disabled
              className="cursor-default opacity-100"
            >
              <LoaderCircle className="size-4 animate-spin text-[#6834b7] dark:text-[#8e69d0]" />
            </PromptInputAction>
          ) : (
            <PromptInputAction
              tooltip="Enhance prompt"
              aria-label="Enhance prompt"
              disabled={isSending}
              onClick={onEnhancePrompt}
              className={cn(isPointEdit && "opacity-100")}
            >
              <img
                src="/edit_note.svg"
                alt=""
                aria-hidden
                width={20}
                height={20}
                className={cn(
                  "h-[20px] w-[20px] shrink-0 opacity-60",
                  isPointEdit && "opacity-100",
                )}
              />
            </PromptInputAction>
          )}

          {/* More actions */}
          {showIgnoreConversationHistoryOption ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <PromptInputAction
                  tooltip="More actions"
                  aria-label="More actions"
                  disabled={isSending}
                >
                  <Ellipsis
                    className="h-[20px] w-[20px] shrink-0"
                    strokeWidth={L1_STRIP_ICON_STROKE_PX}
                    absoluteStrokeWidth
                  />
                </PromptInputAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" side="top" className="min-w-[220px]">
                <DropdownMenuCheckboxItem
                  checked={ignoreConversationHistory}
                  onCheckedChange={(checked) =>
                    onIgnoreConversationHistoryChange?.(checked === true)
                  }
                >
                  Ignore conversation history
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <PromptInputAction
              tooltip="More actions"
              aria-label="More actions"
              disabled={isSending}
            >
              <Ellipsis
                className="h-[20px] w-[20px] shrink-0"
                strokeWidth={L1_STRIP_ICON_STROKE_PX}
                absoluteStrokeWidth
              />
            </PromptInputAction>
          )}
        </div>

        {/* Send */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={isSending ? "Stop sending" : "Send message"}
          title={isSending ? "Stop sending" : "Send message"}
          disabled={!canSend}
          className={cn(
            "size-6 rounded hover:bg-transparent disabled:opacity-100",
            hasTypedInput ? "text-[#6834B7]" : "text-[#cccccc]",
          )}
          onClick={handleSubmit}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
            className="h-4 w-4"
          >
            <path
              d="M20 11.9898C20.0006 12.2189 19.9402 12.444 19.8251 12.6418C19.7101 12.8397 19.5445 13.003 19.3455 13.115L5.9105 20.8312C5.71748 20.9412 5.4995 20.9993 5.2776 21C5.07297 20.9996 4.87141 20.9499 4.68983 20.8551C4.50826 20.7603 4.35195 20.6232 4.23401 20.4552C4.11607 20.2872 4.03994 20.0933 4.01199 19.8897C3.98405 19.6861 4.00511 19.4787 4.07341 19.2849L6.26176 12.8594C6.28332 12.7958 6.32417 12.7406 6.37856 12.7016C6.43295 12.6625 6.49815 12.6415 6.56501 12.6416H12.3187C12.4065 12.6418 12.4934 12.6239 12.5739 12.5889C12.6545 12.554 12.727 12.5028 12.787 12.4385C12.8471 12.3742 12.8933 12.2982 12.9229 12.2152C12.9524 12.1322 12.9647 12.044 12.9589 11.9561C12.9443 11.7907 12.8682 11.637 12.7456 11.5257C12.6231 11.4144 12.4632 11.3536 12.2979 11.3557H6.57061C6.50385 11.3558 6.43872 11.335 6.38434 11.2961C6.32996 11.2571 6.28906 11.2021 6.26736 11.1387L4.07181 4.70917C3.98631 4.4628 3.97744 4.19613 4.04639 3.94458C4.11534 3.69303 4.25883 3.4685 4.45783 3.3008C4.65682 3.1331 4.90189 3.03017 5.1605 3.00568C5.41911 2.98119 5.67901 3.03629 5.9057 3.16367L19.3479 10.8703C19.5456 10.9821 19.7102 11.1447 19.8248 11.3414C19.9394 11.5381 19.9998 11.7619 20 11.9898Z"
              fill="currentColor"
            />
          </svg>
        </Button>
      </PromptInputActions>
    </PromptInput>
  );
}
