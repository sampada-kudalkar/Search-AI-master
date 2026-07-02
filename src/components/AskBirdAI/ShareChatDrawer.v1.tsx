"use client";

import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Info } from "lucide-react";
import {
  Sheet,
  SheetContent,
} from "../ui/sheet";
import {
  FLOATING_SHEET_FRAME_CONTENT_CLASS,
  FloatingSheetFrame,
} from "./stubs";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

// ── Inline stubs for unavailable ui primitives ────────────────────────────────
const Label = ({ children, className, htmlFor, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) => (
  <label htmlFor={htmlFor} className={className} {...props}>{children}</label>
);
const Textarea = ({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea className={className} {...props} />
);
function Select({ value, children }: { value: string; onValueChange?: (v: string) => void; children: React.ReactNode }) {
  return <div data-select-root data-value={value}>{children}</div>;
}
function SelectTrigger({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={className}>{children}</div>;
}
function SelectValue() { return null; }
function SelectContent({ children }: { children: React.ReactNode }) { return <div>{children}</div>; }
function SelectItem({ value, children }: { value: string; children: React.ReactNode }) { return <div data-value={value}>{children}</div>; }
function Switch({ id, checked, onCheckedChange }: { id?: string; checked: boolean; onCheckedChange: (v: boolean) => void }) {
  return <input id={id} type="checkbox" checked={checked} onChange={(e) => onCheckedChange(e.target.checked)} />;
}
import React from "react";

const MAX_DESCRIPTION = 300;

function makeShareId(seed: string): string {
  let h = 5381;
  for (let i = 0; i < seed.length; i++) {
    h = ((h << 5) + h) ^ seed.charCodeAt(i);
    h = h >>> 0;
  }
  return h.toString(16).slice(0, 8);
}

export type ShareChatDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conversationTitle?: string;
  conversationId?: string;
};

export function ShareChatDrawer({
  open,
  onOpenChange,
  conversationTitle = "Untitled conversation",
  conversationId = "default",
}: ShareChatDrawerProps) {
  const [linkName, setLinkName] = useState(conversationTitle);
  const [description, setDescription] = useState("");
  const [access, setAccess] = useState("public");
  const [expirationEnabled, setExpirationEnabled] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (open) {
      setLinkName(conversationTitle);
      setDescription("");
      setAccess("public");
      setExpirationEnabled(false);
      setCopied(false);
    }
  }, [open, conversationTitle]);

  const shareId = makeShareId(conversationId);
  const shareUrl = `share.birdeye.com/view/${shareId}`;

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(`https://${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard not available in all envs
    }
  }, [shareUrl]);

  const handleShare = () => {
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        inset="floating"
        floatingSize="md"
        className={FLOATING_SHEET_FRAME_CONTENT_CLASS}
      >
        <FloatingSheetFrame
          title={
            <span className="flex items-center gap-2">
              <ArrowLeft className="size-4 shrink-0 opacity-60" aria-hidden />
              Share chat
            </span>
          }
          primaryAction={{
            label: "Share",
            onClick: handleShare,
            disabled: !linkName.trim(),
          }}
        >
          <div className="flex flex-col gap-6 pb-2">
            {/* Link name */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="share-link-name">
                Link name{" "}
                <span className="text-destructive" aria-hidden>
                  *
                </span>
              </Label>
              <Input
                id="share-link-name"
                value={linkName}
                onChange={(e) => setLinkName(e.target.value)}
                placeholder="Enter a link name"
                required
              />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="share-description">Description</Label>
                <span className="tabular-nums text-xs text-muted-foreground">
                  {description.length}/{MAX_DESCRIPTION}
                </span>
              </div>
              <Textarea
                id="share-description"
                value={description}
                onChange={(e) => {
                  if (e.target.value.length <= MAX_DESCRIPTION)
                    setDescription(e.target.value);
                }}
                placeholder="Include any details or context about this calendar"
                className="min-h-[96px]"
              />
            </div>

            {/* Who can access */}
            <div className="flex flex-col gap-3 rounded-lg bg-muted/60 p-4">
              <div className="flex items-center gap-1.5">
                <span className="text-[13px] font-semibold text-foreground">
                  Who can access
                </span>
                <Info
                  className="size-[15px] shrink-0 text-muted-foreground"
                  aria-label="Access information"
                />
              </div>

              <Select value={access} onValueChange={setAccess}>
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">
                    <span>
                      <strong>Public</strong>: Anyone with the link can view
                    </span>
                  </SelectItem>
                  <SelectItem value="private">
                    <span>
                      <strong>Private</strong>: Only invited users can view
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center justify-between gap-3">
                <p className="min-w-0 truncate text-[13px] text-muted-foreground">
                  Link:{" "}
                  <a
                    href={`https://${shareUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {shareUrl}
                  </a>
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="shrink-0"
                  onClick={handleCopyLink}
                >
                  {copied ? "Copied!" : "Copy link"}
                </Button>
              </div>
            </div>

            {/* Enable link expiration */}
            <div className="flex items-center justify-between gap-4">
              <Label
                htmlFor="share-expiration"
                className="cursor-pointer text-sm font-medium"
              >
                Enable link expiration
              </Label>
              <Switch
                id="share-expiration"
                checked={expirationEnabled}
                onCheckedChange={setExpirationEnabled}
              />
            </div>
          </div>
        </FloatingSheetFrame>
      </SheetContent>
    </Sheet>
  );
}
