// Stub for L2NavLayout — simplified for Search-AI-master
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function L2NavLayout({ sections, activeItem, onActiveItemChange, headerAction, children }: any) {
  return (
    <div className="flex flex-col h-full overflow-hidden bg-white dark:bg-[#1a1a1a] border-r border-[#e5e9f0] dark:border-[#333a47]">
      {headerAction && (
        <div className="p-3 border-b border-[#e5e9f0] dark:border-[#333a47]">
          <button
            onClick={headerAction.onClick}
            className="w-full text-left text-sm text-[#2552ED] hover:opacity-80"
          >
            {headerAction.label}
          </button>
        </div>
      )}
      {sections?.map((section: any) => (
        <div key={section.label} className="flex-1 overflow-y-auto">
          <div className="px-3 py-2 text-xs text-[#6b7280] font-medium uppercase tracking-wider">
            {section.label}
          </div>
          {section.children?.map((item: any) => (
            <button
              key={item.key}
              onClick={() => onActiveItemChange?.(item.key)}
              className={`w-full text-left px-3 py-2 text-sm truncate hover:bg-[#f5f7fa] dark:hover:bg-[#2a2a2a] ${
                activeItem === item.key ? "bg-[#eef2ff] dark:bg-[#1e2a3a] text-[#2552ED]" : "text-[#212121] dark:text-[#e4e4e4]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      ))}
      {children}
    </div>
  );
}

// Stub for FloatingSheetFrame
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function FloatingSheetFrame({ children, title, primaryAction }: any) {
  return (
    <div className="absolute inset-0 flex flex-col bg-white dark:bg-[#212121] z-50">
      {title && (
        <div className="p-4 border-b border-[#e5e9f0] dark:border-[#333a47] flex items-center justify-between">
          <div>{title}</div>
          {primaryAction && (
            <button
              onClick={primaryAction.onClick}
              disabled={primaryAction.disabled}
              className="text-sm text-[#2552ED] disabled:opacity-50"
            >
              {primaryAction.label}
            </button>
          )}
        </div>
      )}
      <div className="flex-1 min-h-0 overflow-auto">{children}</div>
    </div>
  );
}

export const L1_STRIP_ICON_STROKE_PX = 1.5;
export const FLOATING_SHEET_FRAME_CONTENT_CLASS = "flex flex-col flex-1 min-h-0 overflow-hidden";

// Slide panel constants (stubbing @balajik-cmyk/aero-ds)
export const SLIDE_MS = 260;
export const SLIDE_EASING = "cubic-bezier(0.4,0,0.2,1)";
export const closedTransform = "translateX(100%)";
