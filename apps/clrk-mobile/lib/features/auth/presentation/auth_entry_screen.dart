import 'package:flutter/material.dart';
import 'package:forui/forui.dart';
import 'package:go_router/go_router.dart';

import '../../../shared/components/app_button.dart';
import '../../../shared/theme/app_theme.dart';
import '../domains/auth_redirect.dart';

class AuthEntryScreen extends StatelessWidget {
  const AuthEntryScreen({this.redirectTo, super.key});

  final String? redirectTo;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        Text('ACCOUNT ACCESS', style: AppTheme.monoLabel(context)),
        const SizedBox(height: 12),
        Text(
          'Choose how you want to enter clrk.',
          style: theme.textTheme.headlineMedium,
        ),
        const SizedBox(height: 10),
        Text(
          'Create a new account to start fresh, or sign in to step back into your finance workspace.',
          style: theme.textTheme.bodyMedium?.copyWith(
            color: AppColors.mutedForeground,
          ),
        ),
        const SizedBox(height: 28),
        Container(
          padding: const EdgeInsets.all(20),
          decoration: AppTheme.softPanel(radius: BorderRadius.circular(24)),
          child: Column(
            children: [
              AppButton(
                label: 'Create Account',
                icon: const Icon(Icons.person_add_alt_1_rounded, size: 18),
                onPress: () => context.go(_authPath('/register', redirectTo)),
              ),
              const SizedBox(height: 12),
              AppButton(
                label: 'Sign In',
                icon: const Icon(Icons.login_rounded, size: 18),
                variant: FButtonVariant.outline,
                onPress: () => context.go(_authPath('/login', redirectTo)),
              ),
            ],
          ),
        ),
        const SizedBox(height: 20),
        Wrap(
          spacing: 12,
          runSpacing: 12,
          children: const [
            _AuthDetail(
              icon: Icons.shield_rounded,
              title: 'Protected routes',
              text:
                  'Dashboard, optimizer, and receipt tools stay session-aware.',
            ),
            _AuthDetail(
              icon: Icons.document_scanner_rounded,
              title: 'Receipt workflow',
              text:
                  'Capture and review receipts from the same mobile workspace.',
            ),
            _AuthDetail(
              icon: Icons.insights_rounded,
              title: 'Decision support',
              text:
                  'Move from raw spending signals to optimizer actions quickly.',
            ),
          ],
        ),
      ],
    );
  }
}

class _AuthDetail extends StatelessWidget {
  const _AuthDetail({
    required this.icon,
    required this.title,
    required this.text,
  });

  final IconData icon;
  final String title;
  final String text;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return ConstrainedBox(
      constraints: const BoxConstraints(
        minWidth: 180,
        maxWidth: double.infinity,
      ),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: AppTheme.softPanel(radius: BorderRadius.circular(24)),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(icon, size: 18, color: AppColors.brand),
            const SizedBox(height: 12),
            Text(title, style: theme.textTheme.titleMedium),
            const SizedBox(height: 8),
            Text(
              text,
              style: theme.textTheme.bodySmall?.copyWith(
                color: AppColors.mutedForeground,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

String _authPath(String path, String? redirectTo) {
  final safeRedirect = getSafeRedirectTarget(redirectTo);

  if (safeRedirect == defaultAuthenticatedRoute) {
    return path;
  }

  return Uri(
    path: path,
    queryParameters: {'redirect': safeRedirect},
  ).toString();
}
