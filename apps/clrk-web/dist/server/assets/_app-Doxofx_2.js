import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { Link, Outlet } from "@tanstack/react-router";
import { LayoutDashboard, Receipt, LogOut } from "lucide-react";
import "react";
import { Separator as Separator$1 } from "radix-ui";
import { c as cn } from "./utils-H80jjgLf.js";
import "clsx";
import "tailwind-merge";
function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    Separator$1.Root,
    {
      "data-slot": "separator",
      decorative,
      orientation,
      className: cn(
        "shrink-0 bg-border data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        className
      ),
      ...props
    }
  );
}
const NAV_ITEMS = [
  { label: "Optimizer", to: "/optimizer", icon: LayoutDashboard },
  { label: "Receipt", to: "/receipt", icon: Receipt }
];
function AppSidebar() {
  return /* @__PURE__ */ jsxs("aside", { className: "flex w-56 flex-shrink-0 flex-col border-r border-[#E8E8E8] bg-white", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5 px-5 py-5", children: [
      /* @__PURE__ */ jsx("span", { className: "h-2.5 w-2.5 rounded-full bg-[#D71921]" }),
      /* @__PURE__ */ jsx(
        "span",
        {
          className: "text-base font-bold tracking-tight text-[#000]",
          style: { fontFamily: "'Space Grotesk', system-ui, sans-serif" },
          children: "clrk"
        }
      )
    ] }),
    /* @__PURE__ */ jsx(Separator, { className: "bg-[#E8E8E8]" }),
    /* @__PURE__ */ jsx("nav", { className: "flex-1 px-3 py-4", children: /* @__PURE__ */ jsx("div", { className: "space-y-0.5", children: NAV_ITEMS.map((item) => /* @__PURE__ */ jsx(
      Link,
      {
        to: item.to,
        className: "flex items-center gap-3 rounded-lg px-3 py-2.5 no-underline transition-colors",
        children: ({ isActive }) => /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(
            "span",
            {
              className: "h-1.5 w-1.5 flex-shrink-0 rounded-full transition-colors",
              style: { background: isActive ? "#D71921" : "transparent" }
            }
          ),
          /* @__PURE__ */ jsx(
            item.icon,
            {
              size: 15,
              className: isActive ? "text-[#000]" : "text-[#999999]"
            }
          ),
          /* @__PURE__ */ jsx(
            "span",
            {
              className: `text-sm font-medium ${isActive ? "text-[#000]" : "text-[#666666]"}`,
              style: { fontFamily: "'Space Grotesk', system-ui, sans-serif" },
              children: item.label
            }
          )
        ] })
      },
      item.to
    )) }) }),
    /* @__PURE__ */ jsx(Separator, { className: "bg-[#E8E8E8]" }),
    /* @__PURE__ */ jsx("div", { className: "px-3 py-4", children: /* @__PURE__ */ jsxs("button", { className: "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-[#F5F5F5]", children: [
      /* @__PURE__ */ jsx("span", { className: "h-1.5 w-1.5 flex-shrink-0 rounded-full" }),
      /* @__PURE__ */ jsx(LogOut, { size: 15, className: "text-[#999999]" }),
      /* @__PURE__ */ jsx(
        "span",
        {
          className: "text-sm font-medium text-[#666666]",
          style: { fontFamily: "'Space Grotesk', system-ui, sans-serif" },
          children: "Sign Out"
        }
      )
    ] }) })
  ] });
}
function AppLayout() {
  return /* @__PURE__ */ jsxs("div", { className: "nd-app flex h-screen overflow-hidden", style: {
    fontFamily: "'Space Grotesk', system-ui, sans-serif"
  }, children: [
    /* @__PURE__ */ jsx(AppSidebar, {}),
    /* @__PURE__ */ jsx("main", { className: "flex-1 overflow-y-auto bg-[#F5F5F5]", children: /* @__PURE__ */ jsx(Outlet, {}) })
  ] });
}
export {
  AppLayout as component
};
