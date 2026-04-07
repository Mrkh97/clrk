import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useRef, useCallback, useState } from "react";
import { CloudUpload, CheckCircle, ChevronDownIcon, CheckIcon, ChevronUpIcon } from "lucide-react";
import { create } from "zustand";
import { cva } from "class-variance-authority";
import { Slot, Label as Label$1, Select as Select$1 } from "radix-ui";
import { c as cn } from "./utils-H80jjgLf.js";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { C as Card, a as CardContent } from "./card-hkT-JgLl.js";
import "clsx";
import "tailwind-merge";
const useReceiptStore = create((set) => ({
  uploadState: { phase: "idle", progress: 0 },
  selectedReceiptId: null,
  setUploadPhase: (phase, fileName) => set((s) => ({ uploadState: { ...s.uploadState, phase, fileName } })),
  setUploadProgress: (progress) => set((s) => ({ uploadState: { ...s.uploadState, progress } })),
  selectReceipt: (id) => set({ selectedReceiptId: id }),
  resetUpload: () => set({ uploadState: { phase: "idle", progress: 0 }, selectedReceiptId: null })
}));
const TOTAL_SEGMENTS = 20;
function ReceiptUploadZone() {
  const inputRef = useRef(null);
  const { uploadState, setUploadPhase, setUploadProgress, resetUpload } = useReceiptStore();
  const simulateProcessing = useCallback((fileName) => {
    setUploadPhase("processing", fileName);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setUploadPhase("complete", fileName);
      }
    }, 80);
  }, [setUploadPhase, setUploadProgress]);
  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) simulateProcessing(file.name);
    },
    [simulateProcessing]
  );
  const handleFileChange = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      if (file) simulateProcessing(file.name);
    },
    [simulateProcessing]
  );
  const filledSegments = Math.round(uploadState.progress / 100 * TOTAL_SEGMENTS);
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4", children: [
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: `relative flex min-h-56 cursor-pointer flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed p-8 transition-colors ${uploadState.phase === "dragging" ? "border-[#D71921] bg-[#D71921]/5" : "border-[#CCCCCC] bg-white hover:border-[#999999]"}`,
        onDragOver: (e) => {
          e.preventDefault();
          setUploadPhase("dragging");
        },
        onDragLeave: () => {
          if (uploadState.phase === "dragging") setUploadPhase("idle");
        },
        onDrop: handleDrop,
        onClick: () => uploadState.phase === "idle" && inputRef.current?.click(),
        role: "button",
        tabIndex: 0,
        onKeyDown: (e) => e.key === "Enter" && inputRef.current?.click(),
        "aria-label": "Upload receipt",
        children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              ref: inputRef,
              type: "file",
              accept: "image/*,.pdf",
              className: "sr-only",
              onChange: handleFileChange
            }
          ),
          uploadState.phase === "idle" || uploadState.phase === "dragging" ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("div", { className: "flex h-14 w-14 items-center justify-center rounded-full bg-[#F5F5F5]", children: /* @__PURE__ */ jsx(CloudUpload, { size: 24, className: "text-[#666666]" }) }),
            /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-[#000]", children: "Drop your receipt here" }),
              /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-[#666666]", children: "or click to browse — JPG, PNG, PDF" })
            ] })
          ] }) : uploadState.phase === "processing" ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("p", { className: "nd-mono text-xs uppercase tracking-widest text-[#666666]", children: "Processing" }),
            /* @__PURE__ */ jsx("div", { className: "flex gap-1", children: Array.from({ length: TOTAL_SEGMENTS }).map((_, i) => /* @__PURE__ */ jsx(
              "span",
              {
                className: "h-4 w-2 rounded-sm transition-all duration-150",
                style: {
                  background: "#D71921",
                  opacity: i < filledSegments ? 1 : 0.15
                }
              },
              i
            )) }),
            /* @__PURE__ */ jsxs("p", { className: "nd-mono text-xs text-[#999999]", children: [
              uploadState.progress,
              "%"
            ] })
          ] }) : uploadState.phase === "complete" ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("div", { className: "flex h-14 w-14 items-center justify-center rounded-full bg-[#4A9E5C]/10", children: /* @__PURE__ */ jsx(CheckCircle, { size: 28, className: "text-[#4A9E5C]" }) }),
            /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-[#000]", children: uploadState.fileName }),
              /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-[#4A9E5C]", children: "Receipt scanned successfully" })
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                className: "nd-mono mt-1 text-xs uppercase tracking-wider text-[#999999] underline hover:text-[#666]",
                onClick: (e) => {
                  e.stopPropagation();
                  resetUpload();
                },
                children: "Upload another"
              }
            )
          ] }) : null
        ]
      }
    ),
    uploadState.phase === "idle" && /* @__PURE__ */ jsxs("div", { className: "rounded-lg border-l-2 border-[#D71921] bg-white px-4 py-3", children: [
      /* @__PURE__ */ jsx("p", { className: "nd-mono text-xs uppercase tracking-widest text-[#D71921]", children: "Tips" }),
      /* @__PURE__ */ jsxs("ul", { className: "mt-2 space-y-1 text-xs text-[#666666]", children: [
        /* @__PURE__ */ jsx("li", { children: "· Make sure the receipt is fully visible and not blurry" }),
        /* @__PURE__ */ jsx("li", { children: "· Good lighting improves AI extraction accuracy" }),
        /* @__PURE__ */ jsx("li", { children: "· Supported: photos, scans, PDF receipts" })
      ] })
    ] })
  ] });
}
const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40",
        outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        xs: "h-6 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-xs": "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot.Root : "button";
  return /* @__PURE__ */ jsx(
    Comp,
    {
      "data-slot": "button",
      "data-variant": variant,
      "data-size": size,
      className: cn(buttonVariants({ variant, size, className })),
      ...props
    }
  );
}
function Input({ className, type, ...props }) {
  return /* @__PURE__ */ jsx(
    "input",
    {
      type,
      "data-slot": "input",
      className: cn(
        "h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30",
        "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
        className
      ),
      ...props
    }
  );
}
function Label({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    Label$1.Root,
    {
      "data-slot": "label",
      className: cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      ),
      ...props
    }
  );
}
function Select({
  ...props
}) {
  return /* @__PURE__ */ jsx(Select$1.Root, { "data-slot": "select", ...props });
}
function SelectValue({
  ...props
}) {
  return /* @__PURE__ */ jsx(Select$1.Value, { "data-slot": "select-value", ...props });
}
function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxs(
    Select$1.Trigger,
    {
      "data-slot": "select-trigger",
      "data-size": size,
      className: cn(
        "flex w-fit items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-[placeholder]:text-muted-foreground data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsx(Select$1.Icon, { asChild: true, children: /* @__PURE__ */ jsx(ChevronDownIcon, { className: "size-4 opacity-50" }) })
      ]
    }
  );
}
function SelectContent({
  className,
  children,
  position = "item-aligned",
  align = "center",
  ...props
}) {
  return /* @__PURE__ */ jsx(Select$1.Portal, { children: /* @__PURE__ */ jsxs(
    Select$1.Content,
    {
      "data-slot": "select-content",
      className: cn(
        "relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border bg-popover text-popover-foreground shadow-md data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
        position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      ),
      position,
      align,
      ...props,
      children: [
        /* @__PURE__ */ jsx(SelectScrollUpButton, {}),
        /* @__PURE__ */ jsx(
          Select$1.Viewport,
          {
            className: cn(
              "p-1",
              position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1"
            ),
            children
          }
        ),
        /* @__PURE__ */ jsx(SelectScrollDownButton, {})
      ]
    }
  ) });
}
function SelectItem({
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxs(
    Select$1.Item,
    {
      "data-slot": "select-item",
      className: cn(
        "relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className
      ),
      ...props,
      children: [
        /* @__PURE__ */ jsx(
          "span",
          {
            "data-slot": "select-item-indicator",
            className: "absolute right-2 flex size-3.5 items-center justify-center",
            children: /* @__PURE__ */ jsx(Select$1.ItemIndicator, { children: /* @__PURE__ */ jsx(CheckIcon, { className: "size-4" }) })
          }
        ),
        /* @__PURE__ */ jsx(Select$1.ItemText, { children })
      ]
    }
  );
}
function SelectScrollUpButton({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    Select$1.ScrollUpButton,
    {
      "data-slot": "select-scroll-up-button",
      className: cn(
        "flex cursor-default items-center justify-center py-1",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsx(ChevronUpIcon, { className: "size-4" })
    }
  );
}
function SelectScrollDownButton({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    Select$1.ScrollDownButton,
    {
      "data-slot": "select-scroll-down-button",
      className: cn(
        "flex cursor-default items-center justify-center py-1",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsx(ChevronDownIcon, { className: "size-4" })
    }
  );
}
function Textarea({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "textarea",
    {
      "data-slot": "textarea",
      className: cn(
        "flex field-sizing-content min-h-16 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:aria-invalid:ring-destructive/40",
        className
      ),
      ...props
    }
  );
}
const DUMMY_RECEIPTS = [
  {
    id: "1",
    merchant: "Whole Foods Market",
    amount: 84.5,
    currency: "USD",
    date: "2026-04-03",
    category: "food",
    paymentMethod: "card",
    notes: "Weekly groceries",
    status: "complete",
    aiExtracted: true
  },
  {
    id: "2",
    merchant: "Uber",
    amount: 23,
    currency: "USD",
    date: "2026-04-02",
    category: "transport",
    paymentMethod: "digital",
    status: "complete",
    aiExtracted: true
  },
  {
    id: "3",
    merchant: "CVS Pharmacy",
    amount: 42.3,
    currency: "USD",
    date: "2026-04-01",
    category: "health",
    paymentMethod: "card",
    notes: "Prescription + vitamins",
    status: "pending",
    aiExtracted: false
  },
  {
    id: "4",
    merchant: "Amazon",
    amount: 156,
    currency: "USD",
    date: "2026-03-30",
    category: "shopping",
    paymentMethod: "card",
    status: "complete",
    aiExtracted: true
  },
  {
    id: "5",
    merchant: "PG&E",
    amount: 120,
    currency: "USD",
    date: "2026-03-28",
    category: "utilities",
    paymentMethod: "digital",
    notes: "Monthly electricity bill",
    status: "complete",
    aiExtracted: false
  },
  {
    id: "6",
    merchant: "Chipotle",
    amount: 18.75,
    currency: "USD",
    date: "2026-03-27",
    category: "food",
    paymentMethod: "cash",
    status: "complete",
    aiExtracted: true
  }
];
let receipts = [...DUMMY_RECEIPTS];
const fetchReceipts = () => new Promise((resolve) => setTimeout(() => resolve([...receipts]), 300));
const addReceipt = (values) => new Promise((resolve) => {
  const newReceipt = {
    id: String(Date.now()),
    merchant: values.merchant,
    amount: parseFloat(values.amount) || 0,
    currency: "USD",
    date: values.date,
    category: values.category,
    paymentMethod: values.paymentMethod,
    notes: values.notes,
    status: "complete",
    aiExtracted: false
  };
  receipts = [newReceipt, ...receipts];
  setTimeout(() => resolve(newReceipt), 300);
});
function useReceipts() {
  return useQuery({
    queryKey: ["receipts"],
    queryFn: fetchReceipts,
    initialData: [...receipts],
    staleTime: Infinity
  });
}
function useAddReceipt() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addReceipt,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["receipts"] });
    }
  });
}
const CATEGORIES = [
  { value: "food", label: "Food & Dining" },
  { value: "transport", label: "Transport" },
  { value: "utilities", label: "Utilities" },
  { value: "entertainment", label: "Entertainment" },
  { value: "health", label: "Health" },
  { value: "shopping", label: "Shopping" },
  { value: "other", label: "Other" }
];
const PAYMENT_METHODS = [
  { value: "card", label: "Card" },
  { value: "cash", label: "Cash" },
  { value: "digital", label: "Digital" }
];
const defaultValues = {
  merchant: "",
  amount: "",
  date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
  category: "food",
  paymentMethod: "card",
  notes: ""
};
function ReceiptForm() {
  const [values, setValues] = useState(defaultValues);
  const { mutate: addReceipt2, isPending } = useAddReceipt();
  const { uploadState } = useReceiptStore();
  const isAiExtracted = uploadState.phase === "complete";
  const set = (field) => (e) => setValues((prev) => ({ ...prev, [field]: e.target.value }));
  const handleSubmit = (e) => {
    e.preventDefault();
    addReceipt2(values, { onSuccess: () => setValues(defaultValues) });
  };
  return /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "flex flex-col gap-5", children: [
    isAiExtracted && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 rounded-lg border border-[#D71921]/20 bg-[#D71921]/5 px-3 py-2", children: [
      /* @__PURE__ */ jsx("span", { className: "nd-mono text-[10px] font-bold uppercase tracking-widest text-[#D71921]", children: "AI Extracted" }),
      /* @__PURE__ */ jsx("span", { className: "text-xs text-[#666666]", children: "— review and confirm details below" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
      /* @__PURE__ */ jsx(Label, { className: "nd-mono text-[10px] uppercase tracking-widest text-[#666666]", children: "Merchant" }),
      /* @__PURE__ */ jsx(
        Input,
        {
          placeholder: "e.g. Whole Foods Market",
          value: values.merchant,
          onChange: set("merchant"),
          required: true,
          className: "border-x-0 border-t-0 rounded-none border-b border-[#CCCCCC] bg-transparent px-0 text-sm focus-visible:ring-0 focus-visible:border-[#000]"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsx(Label, { className: "nd-mono text-[10px] uppercase tracking-widest text-[#666666]", children: "Amount" }),
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx("span", { className: "absolute left-0 top-1/2 -translate-y-1/2 nd-mono text-sm text-[#999999]", children: "$" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              type: "number",
              step: "0.01",
              min: "0",
              placeholder: "0.00",
              value: values.amount,
              onChange: set("amount"),
              required: true,
              className: "border-x-0 border-t-0 rounded-none border-b border-[#CCCCCC] bg-transparent pl-4 px-0 text-sm nd-mono focus-visible:ring-0 focus-visible:border-[#000]"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsx(Label, { className: "nd-mono text-[10px] uppercase tracking-widest text-[#666666]", children: "Date" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            type: "date",
            value: values.date,
            onChange: set("date"),
            required: true,
            className: "border-x-0 border-t-0 rounded-none border-b border-[#CCCCCC] bg-transparent px-0 text-sm nd-mono focus-visible:ring-0 focus-visible:border-[#000]"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
      /* @__PURE__ */ jsx(Label, { className: "nd-mono text-[10px] uppercase tracking-widest text-[#666666]", children: "Category" }),
      /* @__PURE__ */ jsxs(
        Select,
        {
          value: values.category,
          onValueChange: (v) => setValues((prev) => ({ ...prev, category: v })),
          children: [
            /* @__PURE__ */ jsx(SelectTrigger, { className: "border-x-0 border-t-0 rounded-none border-b border-[#CCCCCC] bg-transparent px-0 text-sm focus:ring-0 focus:border-[#000]", children: /* @__PURE__ */ jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsx(SelectContent, { children: CATEGORIES.map((c) => /* @__PURE__ */ jsx(SelectItem, { value: c.value, children: c.label }, c.value)) })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
      /* @__PURE__ */ jsx(Label, { className: "nd-mono text-[10px] uppercase tracking-widest text-[#666666]", children: "Payment Method" }),
      /* @__PURE__ */ jsx("div", { className: "flex gap-2", children: PAYMENT_METHODS.map((pm) => /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => setValues((prev) => ({ ...prev, paymentMethod: pm.value })),
          className: `nd-mono flex-1 rounded-lg border py-2 text-xs uppercase tracking-wider transition-colors ${values.paymentMethod === pm.value ? "border-[#000] bg-[#000] text-white" : "border-[#E8E8E8] bg-white text-[#666666] hover:border-[#000]"}`,
          children: pm.label
        },
        pm.value
      )) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
      /* @__PURE__ */ jsx(Label, { className: "nd-mono text-[10px] uppercase tracking-widest text-[#666666]", children: "Notes" }),
      /* @__PURE__ */ jsx(
        Textarea,
        {
          placeholder: "Optional notes...",
          value: values.notes,
          onChange: set("notes"),
          rows: 3,
          className: "resize-none border border-[#E8E8E8] bg-white text-sm focus-visible:ring-0 focus-visible:border-[#000]"
        }
      )
    ] }),
    /* @__PURE__ */ jsx(
      Button,
      {
        type: "submit",
        disabled: isPending,
        className: "nd-mono mt-1 w-full rounded-full bg-[#000] py-3 text-xs font-bold uppercase tracking-widest text-white hover:bg-[#222] disabled:opacity-50",
        children: isPending ? "Saving..." : "Save Receipt"
      }
    )
  ] });
}
const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive: "bg-destructive text-white focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40 [a&]:hover:bg-destructive/90",
        outline: "border-border text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        ghost: "[a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        link: "text-primary underline-offset-4 [a&]:hover:underline"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot.Root : "span";
  return /* @__PURE__ */ jsx(
    Comp,
    {
      "data-slot": "badge",
      "data-variant": variant,
      className: cn(badgeVariants({ variant }), className),
      ...props
    }
  );
}
const CATEGORY_LABELS = {
  food: "Food & Dining",
  transport: "Transport",
  utilities: "Utilities",
  entertainment: "Entertainment",
  health: "Health",
  shopping: "Shopping",
  other: "Other"
};
const STATUS_COLORS = {
  complete: "text-[#4A9E5C]",
  pending: "text-[#D4A843]",
  processing: "text-[#666666]",
  error: "text-[#D71921]"
};
function ReceiptCard({ receipt, onClick }) {
  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: receipt.currency
  }).format(receipt.amount);
  const formattedDate = new Date(receipt.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
  return /* @__PURE__ */ jsx(
    Card,
    {
      className: "nd-card cursor-pointer border border-[#E8E8E8] bg-white shadow-none transition-all hover:-translate-y-0.5 hover:shadow-sm",
      onClick,
      children: /* @__PURE__ */ jsxs(CardContent, { className: "p-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-3 flex items-start justify-between gap-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsx("p", { className: "truncate text-sm font-semibold text-[#000]", children: receipt.merchant }),
            /* @__PURE__ */ jsx("p", { className: "nd-mono mt-0.5 text-[10px] uppercase tracking-wider text-[#999999]", children: CATEGORY_LABELS[receipt.category] })
          ] }),
          receipt.aiExtracted && /* @__PURE__ */ jsx("span", { className: "nd-mono flex-shrink-0 rounded border border-[#D71921]/30 bg-[#D71921]/5 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-[#D71921]", children: "AI" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "nd-mono text-lg font-bold text-[#000]", children: formattedAmount }),
        /* @__PURE__ */ jsxs("div", { className: "mt-3 flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("p", { className: "nd-mono text-[10px] text-[#999999]", children: formattedDate }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsx(
              "span",
              {
                className: `h-1.5 w-1.5 rounded-full ${receipt.status === "complete" ? "bg-[#4A9E5C]" : receipt.status === "pending" ? "bg-[#D4A843]" : "bg-[#D71921]"}`
              }
            ),
            /* @__PURE__ */ jsx("span", { className: `nd-mono text-[10px] capitalize ${STATUS_COLORS[receipt.status]}`, children: receipt.status })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-2", children: /* @__PURE__ */ jsx(
          Badge,
          {
            variant: "outline",
            className: "nd-mono border-[#E8E8E8] bg-[#F5F5F5] text-[9px] uppercase tracking-wider text-[#999999]",
            children: receipt.paymentMethod
          }
        ) })
      ] })
    }
  );
}
function ReceiptList() {
  const { data: receipts2, isLoading } = useReceipts();
  if (isLoading) {
    return /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-3 sm:grid-cols-2", children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ jsx("div", { className: "h-36 animate-pulse rounded-xl bg-[#E8E8E8]" }, i)) });
  }
  if (!receipts2 || receipts2.length === 0) {
    return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center rounded-xl border border-dashed border-[#E8E8E8] py-16 text-center", children: [
      /* @__PURE__ */ jsx("p", { className: "nd-mono text-xs uppercase tracking-widest text-[#999999]", children: "No receipts found" }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-[#666666]", children: "Upload your first receipt to get started" })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsxs("p", { className: "nd-mono text-[10px] uppercase tracking-widest text-[#999999]", children: [
      receipts2.length,
      " receipt",
      receipts2.length !== 1 ? "s" : ""
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-3 sm:grid-cols-2", children: receipts2.map((receipt) => /* @__PURE__ */ jsx(ReceiptCard, { receipt }, receipt.id)) })
  ] });
}
function ReceiptPage() {
  return /* @__PURE__ */ jsx("div", { className: "nd-dot-grid min-h-full", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-6xl p-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsx("p", { className: "nd-mono mb-1 text-[10px] uppercase tracking-widest text-[#999999]", children: "Receipts" }),
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-[#000]", style: {
        fontFamily: "'Space Grotesk', system-ui, sans-serif"
      }, children: "Scan & Manage" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-6 lg:grid-cols-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-6", children: [
        /* @__PURE__ */ jsxs("section", { className: "nd-card p-5", children: [
          /* @__PURE__ */ jsx("p", { className: "nd-mono mb-4 text-[10px] uppercase tracking-widest text-[#999999]", children: "Upload Receipt" }),
          /* @__PURE__ */ jsx(ReceiptUploadZone, {})
        ] }),
        /* @__PURE__ */ jsxs("section", { children: [
          /* @__PURE__ */ jsx("p", { className: "nd-mono mb-4 text-[10px] uppercase tracking-widest text-[#999999]", children: "Recent Receipts" }),
          /* @__PURE__ */ jsx(ReceiptList, {})
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "lg:sticky lg:top-6 lg:self-start", children: /* @__PURE__ */ jsxs("section", { className: "nd-card p-5", children: [
        /* @__PURE__ */ jsx("p", { className: "nd-mono mb-4 text-[10px] uppercase tracking-widest text-[#999999]", children: "Receipt Details" }),
        /* @__PURE__ */ jsx(ReceiptForm, {})
      ] }) })
    ] })
  ] }) });
}
export {
  ReceiptPage as component
};
