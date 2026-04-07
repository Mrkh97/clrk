import { jsx, jsxs } from "react/jsx-runtime";
import { TrendingUp, Search, Bell } from "lucide-react";
import { create } from "zustand";
import { C as Card, a as CardContent } from "./card-hkT-JgLl.js";
import { useState, useEffect } from "react";
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Line } from "recharts";
import { useQuery } from "@tanstack/react-query";
import "./utils-H80jjgLf.js";
import "clsx";
import "tailwind-merge";
const useOptimizerStore = create((set) => ({
  timeFilter: "30D",
  setTimeFilter: (timeFilter) => set({ timeFilter })
}));
const FILTERS = ["7D", "30D", "3M", "6M", "1Y"];
function TimeFilter() {
  const { timeFilter, setTimeFilter } = useOptimizerStore();
  return /* @__PURE__ */ jsx("div", { className: "flex gap-1 rounded-lg border border-[#E8E8E8] bg-white p-1", children: FILTERS.map((f) => /* @__PURE__ */ jsx(
    "button",
    {
      onClick: () => setTimeFilter(f),
      className: `nd-mono flex-1 rounded-md py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${timeFilter === f ? "bg-[#000] text-white" : "text-[#666666] hover:bg-[#F5F5F5] hover:text-[#000]"}`,
      children: f
    },
    f
  )) });
}
function StatCard({ label, value, trend, trendUp }) {
  return /* @__PURE__ */ jsx(Card, { className: "border border-[#E8E8E8] bg-white shadow-none", children: /* @__PURE__ */ jsxs(CardContent, { className: "p-5", children: [
    /* @__PURE__ */ jsx("p", { className: "nd-mono text-[10px] uppercase tracking-widest text-[#999999]", children: label }),
    /* @__PURE__ */ jsx("p", { className: "nd-mono mt-2 text-2xl font-bold text-[#000]", children: value }),
    trend && /* @__PURE__ */ jsxs("div", { className: "mt-2 flex items-center gap-1", children: [
      /* @__PURE__ */ jsx(
        TrendingUp,
        {
          size: 12,
          className: trendUp ? "text-[#4A9E5C]" : "text-[#D71921] rotate-180"
        }
      ),
      /* @__PURE__ */ jsx(
        "span",
        {
          className: `nd-mono text-[10px] ${trendUp ? "text-[#4A9E5C]" : "text-[#D71921]"}`,
          children: trend
        }
      )
    ] })
  ] }) });
}
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-[#E8E8E8] bg-[#000] px-3 py-2 shadow-lg", children: [
    /* @__PURE__ */ jsx("p", { className: "nd-mono text-[10px] uppercase tracking-wider text-[#666666]", children: label }),
    /* @__PURE__ */ jsxs("p", { className: "nd-mono text-sm font-bold text-white", children: [
      "$",
      payload[0].value.toLocaleString()
    ] })
  ] });
}
function SpendingChart({ data }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return /* @__PURE__ */ jsx("div", { className: "h-48 animate-pulse rounded-xl bg-[#F5F5F5]" });
  }
  return /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: 192, children: /* @__PURE__ */ jsxs(LineChart, { data, margin: { top: 4, right: 4, left: -20, bottom: 0 }, children: [
    /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#F0F0F0", vertical: false }),
    /* @__PURE__ */ jsx(
      XAxis,
      {
        dataKey: "label",
        tick: { fontSize: 10, fontFamily: "Space Mono", fill: "#999999" },
        axisLine: false,
        tickLine: false
      }
    ),
    /* @__PURE__ */ jsx(
      YAxis,
      {
        tick: { fontSize: 10, fontFamily: "Space Mono", fill: "#999999" },
        axisLine: false,
        tickLine: false,
        tickFormatter: (v) => `$${v >= 1e3 ? `${(v / 1e3).toFixed(1)}k` : v}`
      }
    ),
    /* @__PURE__ */ jsx(Tooltip, { content: /* @__PURE__ */ jsx(CustomTooltip, {}), cursor: { stroke: "#E8E8E8", strokeWidth: 1 } }),
    /* @__PURE__ */ jsx(
      Line,
      {
        type: "monotone",
        dataKey: "amount",
        stroke: "#D71921",
        strokeWidth: 2,
        dot: { fill: "#D71921", r: 3, strokeWidth: 0 },
        activeDot: { fill: "#D71921", r: 5, strokeWidth: 2, stroke: "#fff" }
      }
    )
  ] }) });
}
const TOTAL_SEGMENTS = 20;
function CategoryBars({ data }) {
  return /* @__PURE__ */ jsx("div", { className: "space-y-4", children: data.map((item) => {
    const filledCount = Math.round(item.percentage / 100 * TOTAL_SEGMENTS);
    return /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-1.5 flex items-center justify-between", children: [
        /* @__PURE__ */ jsx("span", { className: "nd-mono text-[10px] uppercase tracking-wider text-[#666666]", children: item.category }),
        /* @__PURE__ */ jsxs("span", { className: "nd-mono text-xs font-bold text-[#000]", children: [
          "$",
          item.amount.toLocaleString()
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex gap-0.5", children: Array.from({ length: TOTAL_SEGMENTS }).map((_, i) => /* @__PURE__ */ jsx(
        "span",
        {
          className: "h-3 flex-1 rounded-sm",
          style: {
            background: "#D71921",
            opacity: i < filledCount ? 1 : 0.1
          }
        },
        i
      )) })
    ] }, item.category);
  }) });
}
const STATUS_CONFIG = {
  completed: { label: "Completed", color: "text-[#4A9E5C]", dot: "bg-[#4A9E5C]" },
  pending: { label: "Pending", color: "text-[#D4A843]", dot: "bg-[#D4A843]" },
  refunded: { label: "Refunded", color: "text-[#666666]", dot: "bg-[#CCCCCC]" },
  failed: { label: "Failed", color: "text-[#D71921]", dot: "bg-[#D71921]" }
};
function TransactionList({ transactions }) {
  return /* @__PURE__ */ jsxs("div", { className: "overflow-hidden rounded-xl border border-[#E8E8E8] bg-white", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[1fr_auto_auto] items-center gap-4 border-b border-[#F0F0F0] px-4 py-2.5 sm:grid-cols-[1fr_auto_auto_auto]", children: [
      /* @__PURE__ */ jsx("span", { className: "nd-mono text-[10px] uppercase tracking-wider text-[#999999]", children: "Merchant" }),
      /* @__PURE__ */ jsx("span", { className: "nd-mono hidden text-[10px] uppercase tracking-wider text-[#999999] sm:block", children: "Category" }),
      /* @__PURE__ */ jsx("span", { className: "nd-mono text-[10px] uppercase tracking-wider text-[#999999]", children: "Status" }),
      /* @__PURE__ */ jsx("span", { className: "nd-mono text-[10px] uppercase tracking-wider text-[#999999]", children: "Amount" })
    ] }),
    transactions.map((tx) => {
      const status = STATUS_CONFIG[tx.status];
      const formattedDate = new Date(tx.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric"
      });
      return /* @__PURE__ */ jsxs(
        "div",
        {
          className: "grid grid-cols-[1fr_auto_auto] items-center gap-4 border-b border-[#F0F0F0] px-4 py-3 transition-colors last:border-b-0 hover:bg-[#F5F5F5] sm:grid-cols-[1fr_auto_auto_auto]",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsx("p", { className: "truncate text-sm font-medium text-[#000]", children: tx.merchant }),
              /* @__PURE__ */ jsx("p", { className: "nd-mono mt-0.5 text-[10px] text-[#999999]", children: formattedDate })
            ] }),
            /* @__PURE__ */ jsx("span", { className: "nd-mono hidden text-xs text-[#666666] sm:block", children: tx.category }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsx("span", { className: `h-1.5 w-1.5 flex-shrink-0 rounded-full ${status.dot}` }),
              /* @__PURE__ */ jsx("span", { className: `nd-mono text-[10px] ${status.color}`, children: status.label })
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "nd-mono text-sm font-bold text-[#000]", children: [
              "$",
              tx.amount.toFixed(2)
            ] })
          ]
        },
        tx.id
      );
    })
  ] });
}
const TRANSACTIONS = [
  { id: "1", merchant: "Whole Foods Market", amount: 84.5, date: "2026-04-03", category: "Food & Dining", status: "completed" },
  { id: "2", merchant: "Uber", amount: 23, date: "2026-04-02", category: "Transport", status: "completed" },
  { id: "3", merchant: "Netflix", amount: 15.99, date: "2026-04-01", category: "Entertainment", status: "completed" },
  { id: "4", merchant: "CVS Pharmacy", amount: 42.3, date: "2026-04-01", category: "Health", status: "pending" },
  { id: "5", merchant: "Amazon", amount: 156, date: "2026-03-30", category: "Shopping", status: "completed" },
  { id: "6", merchant: "PG&E", amount: 120, date: "2026-03-28", category: "Utilities", status: "completed" },
  { id: "7", merchant: "Chipotle", amount: 18.75, date: "2026-03-27", category: "Food & Dining", status: "completed" },
  { id: "8", merchant: "Spotify", amount: 9.99, date: "2026-03-26", category: "Entertainment", status: "completed" }
];
const MONTHLY_DATA = {
  "7D": [
    { label: "Mon", amount: 42 },
    { label: "Tue", amount: 85 },
    { label: "Wed", amount: 23 },
    { label: "Thu", amount: 156 },
    { label: "Fri", amount: 67 },
    { label: "Sat", amount: 120 },
    { label: "Sun", amount: 38 }
  ],
  "30D": [
    { label: "Wk 1", amount: 420 },
    { label: "Wk 2", amount: 680 },
    { label: "Wk 3", amount: 530 },
    { label: "Wk 4", amount: 750 }
  ],
  "3M": [
    { label: "Feb", amount: 2100 },
    { label: "Mar", amount: 2650 },
    { label: "Apr", amount: 1850 }
  ],
  "6M": [
    { label: "Nov", amount: 1980 },
    { label: "Dec", amount: 3100 },
    { label: "Jan", amount: 2300 },
    { label: "Feb", amount: 2100 },
    { label: "Mar", amount: 2650 },
    { label: "Apr", amount: 1850 }
  ],
  "1Y": [
    { label: "May", amount: 1800 },
    { label: "Jun", amount: 2100 },
    { label: "Jul", amount: 2400 },
    { label: "Aug", amount: 1950 },
    { label: "Sep", amount: 2200 },
    { label: "Oct", amount: 2600 },
    { label: "Nov", amount: 1980 },
    { label: "Dec", amount: 3100 },
    { label: "Jan", amount: 2300 },
    { label: "Feb", amount: 2100 },
    { label: "Mar", amount: 2650 },
    { label: "Apr", amount: 1850 }
  ]
};
const CATEGORY_DATA = [
  { category: "Food & Dining", amount: 847, percentage: 35 },
  { category: "Shopping", amount: 486, percentage: 20 },
  { category: "Transport", amount: 364, percentage: 15 },
  { category: "Utilities", amount: 291, percentage: 12 },
  { category: "Entertainment", amount: 218, percentage: 9 },
  { category: "Health", amount: 146, percentage: 6 },
  { category: "Other", amount: 73, percentage: 3 }
];
const STATS = {
  "7D": { totalSpent: 531, avgDaily: 75.86, topCategory: "Shopping", transactionCount: 12 },
  "30D": { totalSpent: 2380, avgDaily: 79.33, topCategory: "Food & Dining", transactionCount: 47 },
  "3M": { totalSpent: 6600, avgDaily: 73.33, topCategory: "Food & Dining", transactionCount: 138 },
  "6M": { totalSpent: 13930, avgDaily: 77.39, topCategory: "Food & Dining", transactionCount: 271 },
  "1Y": { totalSpent: 27030, avgDaily: 74.05, topCategory: "Food & Dining", transactionCount: 523 }
};
const fetchOptimizerData = (filter) => new Promise(
  (resolve) => setTimeout(
    () => resolve({
      stats: STATS[filter],
      monthlySpend: MONTHLY_DATA[filter],
      categorySpend: CATEGORY_DATA,
      transactions: TRANSACTIONS
    }),
    200
  )
);
function useOptimizerData() {
  const timeFilter = useOptimizerStore((s) => s.timeFilter);
  return useQuery({
    queryKey: ["optimizer", timeFilter],
    queryFn: () => fetchOptimizerData(timeFilter),
    staleTime: Infinity,
    placeholderData: (prev) => prev
  });
}
function OptimizerPage() {
  const {
    data,
    isLoading
  } = useOptimizerData();
  return /* @__PURE__ */ jsxs("div", { className: "min-h-full", children: [
    /* @__PURE__ */ jsxs("header", { className: "flex items-center justify-between border-b border-[#E8E8E8] bg-white px-6 py-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "nd-mono text-[10px] uppercase tracking-widest text-[#999999]", children: "Dashboard" }),
        /* @__PURE__ */ jsx("h1", { className: "text-xl font-bold text-[#000]", style: {
          fontFamily: "'Space Grotesk', system-ui, sans-serif"
        }, children: "Spending Optimizer" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 border-b border-[#CCCCCC] pb-1", children: [
          /* @__PURE__ */ jsx(Search, { size: 14, className: "text-[#999999]" }),
          /* @__PURE__ */ jsx("input", { className: "nd-mono w-32 bg-transparent text-xs text-[#666666] outline-none placeholder:text-[#CCCCCC]", placeholder: "Search..." })
        ] }),
        /* @__PURE__ */ jsx("button", { className: "rounded-full p-2 transition-colors hover:bg-[#F5F5F5]", children: /* @__PURE__ */ jsx(Bell, { size: 16, className: "text-[#666666]" }) }),
        /* @__PURE__ */ jsx("div", { className: "h-8 w-8 rounded-full bg-[#000] flex items-center justify-center", children: /* @__PURE__ */ jsx("span", { className: "nd-mono text-[10px] font-bold text-white", children: "MK" }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "p-6 space-y-6", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between gap-4", children: /* @__PURE__ */ jsx("div", { className: "w-64", children: /* @__PURE__ */ jsx(TimeFilter, {}) }) }),
      isLoading ? /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-4 lg:grid-cols-4", children: Array.from({
        length: 4
      }).map((_, i) => /* @__PURE__ */ jsx("div", { className: "h-28 animate-pulse rounded-xl bg-[#E8E8E8]" }, i)) }) : data ? /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4 lg:grid-cols-4", children: [
        /* @__PURE__ */ jsx(StatCard, { label: "Total Spent", value: `$${data.stats.totalSpent.toLocaleString()}`, trend: "+4.2% vs last period", trendUp: false }),
        /* @__PURE__ */ jsx(StatCard, { label: "Avg. Daily", value: `$${data.stats.avgDaily.toFixed(2)}` }),
        /* @__PURE__ */ jsx(StatCard, { label: "Top Category", value: data.stats.topCategory }),
        /* @__PURE__ */ jsx(StatCard, { label: "Transactions", value: String(data.stats.transactionCount), trend: "+8 vs last period", trendUp: true })
      ] }) : null,
      data && /* @__PURE__ */ jsxs("div", { className: "grid gap-4 lg:grid-cols-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "nd-card p-5", children: [
          /* @__PURE__ */ jsx("p", { className: "nd-mono mb-4 text-[10px] uppercase tracking-widest text-[#999999]", children: "Spending Over Time" }),
          /* @__PURE__ */ jsx(SpendingChart, { data: data.monthlySpend })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "nd-card p-5", children: [
          /* @__PURE__ */ jsx("p", { className: "nd-mono mb-4 text-[10px] uppercase tracking-widest text-[#999999]", children: "Spending by Category" }),
          /* @__PURE__ */ jsx(CategoryBars, { data: data.categorySpend })
        ] })
      ] }),
      data && /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "nd-mono mb-3 text-[10px] uppercase tracking-widest text-[#999999]", children: "Recent Transactions" }),
        /* @__PURE__ */ jsx(TransactionList, { transactions: data.transactions })
      ] })
    ] })
  ] });
}
export {
  OptimizerPage as component
};
