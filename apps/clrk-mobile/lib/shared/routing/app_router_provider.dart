import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';

import '../../features/auth/domains/auth_redirect.dart';
import '../../features/auth/presentation/auth_entry_screen.dart';
import '../../features/auth/presentation/login_screen.dart';
import '../../features/auth/presentation/onboarding_intro_screen.dart';
import '../../features/auth/presentation/register_screen.dart';
import '../../features/auth/usecases/auth_controller.dart';
import '../../features/auth/usecases/onboarding_controller.dart';
import '../../features/dashboard/presentation/dashboard_screen.dart';
import '../../features/optimizer/presentation/optimizer_screen.dart';
import '../../features/receipt/presentation/receipt_screen.dart';
import 'providers/auth_key_provider.dart';
import 'providers/main_key_provider.dart';
import 'shells/app_shell.dart';
import 'shells/auth_shell.dart';

final appRouterProvider = Provider<GoRouter>((ref) {
  final authState = ref.watch(authControllerProvider);
  final hasSeenOnboarding = ref.watch(onboardingControllerProvider);
  final authKey = ref.watch(authKeyProvider);
  final mainKey = ref.watch(mainKeyProvider);

  return GoRouter(
    initialLocation: '/',
    navigatorKey: mainKey,
    redirect: (context, state) {
      final location = state.uri.path;
      final isOnboardingRoute = location == '/onboarding';
      final isAuthRoute =
          location == '/auth' ||
          location == '/login' ||
          location == '/register';
      final session = switch (authState) {
        AsyncData(:final value) => value,
        _ => null,
      };
      final requestedRedirect = getSafeRedirectTarget(
        state.uri.queryParameters['redirect'] ?? state.uri.toString(),
      );

      if (session == null) {
        if (!hasSeenOnboarding) {
          if (isOnboardingRoute) {
            return null;
          }

          if (location == '/') {
            return '/onboarding';
          }

          return Uri(
            path: '/onboarding',
            queryParameters: {'redirect': requestedRedirect},
          ).toString();
        }

        if (isOnboardingRoute) {
          return requestedRedirect == defaultAuthenticatedRoute
              ? '/auth'
              : Uri(
                  path: '/auth',
                  queryParameters: {'redirect': requestedRedirect},
                ).toString();
        }

        if (isAuthRoute) {
          return null;
        }

        if (location == '/') {
          return '/auth';
        }

        return Uri(
          path: '/auth',
          queryParameters: {'redirect': requestedRedirect},
        ).toString();
      }

      if (isOnboardingRoute || isAuthRoute) {
        final explicitRedirect = getSafeRedirectTarget(
          state.uri.queryParameters['redirect'],
        );

        return explicitRedirect;
      }

      if (location == '/') {
        return defaultAuthenticatedRoute;
      }

      return null;
    },
    routes: [
      GoRoute(
        path: '/onboarding',
        pageBuilder: (context, state) => MaterialPage<void>(
          key: state.pageKey,
          child: OnboardingIntroScreen(
            redirectTo: state.uri.queryParameters['redirect'],
          ),
        ),
      ),
      ShellRoute(
        navigatorKey: authKey,
        pageBuilder: (context, state, child) => MaterialPage<void>(
          key: state.pageKey,
          child: AuthShell(child: child),
        ),
        routes: [
          GoRoute(
            path: '/auth',
            pageBuilder: (context, state) => MaterialPage<void>(
              key: state.pageKey,
              child: AuthEntryScreen(
                redirectTo: state.uri.queryParameters['redirect'],
              ),
            ),
          ),
          GoRoute(
            path: '/login',
            pageBuilder: (context, state) => MaterialPage<void>(
              key: state.pageKey,
              child: LoginScreen(
                redirectTo: state.uri.queryParameters['redirect'],
              ),
            ),
          ),
          GoRoute(
            path: '/register',
            pageBuilder: (context, state) => MaterialPage<void>(
              key: state.pageKey,
              child: RegisterScreen(
                redirectTo: state.uri.queryParameters['redirect'],
              ),
            ),
          ),
        ],
      ),
      StatefulShellRoute.indexedStack(
        parentNavigatorKey: mainKey,
        builder: (context, state, navigationShell) {
          return AppShell(navigationShell: navigationShell);
        },
        branches: [
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/dashboard',
                pageBuilder: (context, state) =>
                    const MaterialPage<void>(child: DashboardScreen()),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/optimizer',
                pageBuilder: (context, state) =>
                    const MaterialPage<void>(child: OptimizerScreen()),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/receipt',
                pageBuilder: (context, state) =>
                    const MaterialPage<void>(child: ReceiptScreen()),
              ),
            ],
          ),
        ],
      ),
    ],
  );
});
