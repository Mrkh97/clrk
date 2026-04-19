# Plan: Flutter splash integration with auth bootstrap (2026)
- Objective: Replace in-app boot/loading screen with flutter_native_splash while preserving auth bootstrap behavior; ensure router redirects and verify steps.

Milestones:
1) Dependency and codegen
   - Add dependency flutter_native_splash; run flutter pub get
   - Configure flutter_native_splash in pubspec.yaml and run flutter pub run flutter_native_splash:create
2) Bootstrap in main.dart
   - Acquire WidgetsBinding, call FlutterNativeSplash.preserve(widgetsBinding: binding)
   - Run asynchronous auth/app bootstrap (Firebase init, token load, remote config)
   - Call FlutterNativeSplash.remove() after bootstrap, then runApp()
3) Router integration
   - Implement a router (GoRouter) with a refreshListenable on Auth state
   - Use initialLocation or redirect to route to /login or /home after bootstrap completes
   - Ensure router redirects account for authenticated state without exposing splash
4) Verification
   - Manual: cold-start on device, confirm splash shows, app shows correct route
   - Instrumentation: log bootstrap completion, auth state, and redirect decision
   - Automated: small tests for router redirect logic and bootstrap sequence
5) Edge cases and maintenance
   - Pin flutter_native_splash to a 2026-stable version; monitor issues with remove() and preserve() interplay
   - Consider Android 12+ nuances if using flavor-specific config
6) Deliverables
   - Included code templates and a ready-to-run bootstrap pattern

Open questions:
- Which auth backend and storage method do you prefer for bootstrap (Firebase, custom REST, SecureStorage)?
- Do you want a separate splash screen route during bootstrap or rely entirely on native splash until removal?
