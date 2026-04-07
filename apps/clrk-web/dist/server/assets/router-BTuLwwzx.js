import { createRootRouteWithContext, HeadContent, Scripts, createFileRoute, lazyRouteComponent, redirect, createRouter } from "@tanstack/react-router";
import { jsxs, jsx } from "react/jsx-runtime";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { QueryClient } from "@tanstack/react-query";
const appCss = "/assets/styles-DlDWSX6z.css";
const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var mode=(stored==='light'||stored==='dark'||stored==='auto')?stored:'auto';var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=mode==='auto'?(prefersDark?'dark':'light'):mode;var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);if(mode==='auto'){root.removeAttribute('data-theme')}else{root.setAttribute('data-theme',mode)}root.style.colorScheme=resolved;}catch(e){}})();`;
const Route$4 = createRootRouteWithContext()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8"
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      },
      {
        title: "Clrk, Let Us Manage Your Money"
      }
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss
      }
    ]
  }),
  shellComponent: RootDocument
});
function RootDocument({ children }) {
  return /* @__PURE__ */ jsxs("html", { lang: "en", suppressHydrationWarning: true, children: [
    /* @__PURE__ */ jsxs("head", { children: [
      /* @__PURE__ */ jsx("script", { dangerouslySetInnerHTML: { __html: THEME_INIT_SCRIPT } }),
      /* @__PURE__ */ jsx(HeadContent, {})
    ] }),
    /* @__PURE__ */ jsxs("body", { className: "font-sans antialiased [overflow-wrap:anywhere] selection:bg-[rgba(79,184,178,0.24)]", children: [
      children,
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
const $$splitComponentImporter$2 = () => import("./_app-Doxofx_2.js");
const Route$3 = createFileRoute("/_app")({
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const Route$2 = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({ to: "/optimizer" });
  }
});
const $$splitComponentImporter$1 = () => import("./receipt-CeKA125N.js");
const Route$1 = createFileRoute("/_app/receipt")({
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./optimizer-DXeXmXyC.js");
const Route = createFileRoute("/_app/optimizer")({
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const AppRoute = Route$3.update({
  id: "/_app",
  getParentRoute: () => Route$4
});
const IndexRoute = Route$2.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$4
});
const AppReceiptRoute = Route$1.update({
  id: "/receipt",
  path: "/receipt",
  getParentRoute: () => AppRoute
});
const AppOptimizerRoute = Route.update({
  id: "/optimizer",
  path: "/optimizer",
  getParentRoute: () => AppRoute
});
const AppRouteChildren = {
  AppOptimizerRoute,
  AppReceiptRoute
};
const AppRouteWithChildren = AppRoute._addFileChildren(AppRouteChildren);
const rootRouteChildren = {
  IndexRoute,
  AppRoute: AppRouteWithChildren
};
const routeTree = Route$4._addFileChildren(rootRouteChildren)._addFileTypes();
function getContext() {
  const queryClient = new QueryClient();
  return {
    queryClient
  };
}
function getRouter() {
  const context = getContext();
  const router = createRouter({
    routeTree,
    context,
    scrollRestoration: true,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0
  });
  setupRouterSsrQueryIntegration({ router, queryClient: context.queryClient });
  return router;
}
export {
  getRouter
};
