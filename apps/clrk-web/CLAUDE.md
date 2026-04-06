<!-- intent-skills:start -->
# Skill mappings - when working in these areas, load the linked skill file into context.
skills:
  - task: "Adding or modifying routes, file-based routing, route config, routeTree"
    load: "node_modules/@tanstack/router-plugin/skills/router-plugin/SKILL.md"
    # For router-core concepts (createRoute, createRootRoute, route matching, file naming):
    # npx @tanstack/intent@latest list | grep router-core

  - task: "Creating or editing server functions (createServerFn), input validation, server context, useServerFn"
    load: "node_modules/@tanstack/start-client-core/skills/start-core/server-functions/SKILL.md"

  - task: "Server-side API routes, HTTP method handlers (GET/POST/PUT/DELETE), API endpoints"
    load: "node_modules/@tanstack/start-client-core/skills/start-core/server-routes/SKILL.md"

  - task: "Middleware: createMiddleware, request middleware, context passing, global middleware"
    load: "node_modules/@tanstack/start-client-core/skills/start-core/middleware/SKILL.md"

  - task: "Environment boundaries: createServerOnlyFn, createClientOnlyFn, isomorphic code, env vars (VITE_ prefix)"
    load: "node_modules/@tanstack/start-client-core/skills/start-core/execution-model/SKILL.md"

  - task: "Deployment: Cloudflare, Vercel, Netlify, Node/Docker, SSR, SPA mode, static prerendering"
    load: "node_modules/@tanstack/start-client-core/skills/start-core/deployment/SKILL.md"

  - task: "Route data loading: loaders, loaderDeps, staleTime, pendingComponent, deferred data"
    # To load this skill, run: npx @tanstack/intent@latest list | grep data-loading

  - task: "Navigation: Link component, useNavigate, redirect, preloading, useBlocker"
    # To load this skill, run: npx @tanstack/intent@latest list | grep "navigation"

  - task: "Server runtime: createStartHandler, cookies (getCookie/setCookie), useSession, setResponseHeader"
    load: "node_modules/@tanstack/start-server-core/skills/start-server-core/SKILL.md"

  - task: "App entry point, TanStack Start setup, client/server entry, vite plugin config"
    load: "node_modules/@tanstack/react-start/skills/react-start/SKILL.md"
<!-- intent-skills:end -->
