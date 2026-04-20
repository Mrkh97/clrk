import 'package:flutter/material.dart';

import '../../theme/app_theme.dart';

class AuthShell extends StatelessWidget {
  const AuthShell({required this.child, super.key});

  final Widget child;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      body: DecoratedBox(
        decoration: BoxDecoration(gradient: AppTheme.backgroundGradient()),
        child: SafeArea(
          child: LayoutBuilder(
            builder: (context, constraints) {
              final wide = constraints.maxWidth >= 920;

              final hero = Container(
                padding: const EdgeInsets.all(28),
                decoration: AppTheme.glassPanel(
                  radius: BorderRadius.circular(32),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Container(
                          width: 10,
                          height: 10,
                          decoration: const BoxDecoration(
                            color: AppColors.brand,
                            shape: BoxShape.circle,
                          ),
                        ),
                        const SizedBox(width: 10),
                        Text('clrk', style: theme.textTheme.titleLarge),
                      ],
                    ),
                    const SizedBox(height: 28),
                    Text(
                      'MOBILE FINANCE COCKPIT',
                      style: AppTheme.monoLabel(context),
                    ),
                    const SizedBox(height: 14),
                    Text(
                      'Set up your account and step into a calmer money workflow.',
                      style: theme.textTheme.displayMedium,
                    ),
                    const SizedBox(height: 16),
                    Text(
                      'The mobile app brings receipt capture, dashboard monitoring, and optimizer guidance into one protected space designed for quick daily use.',
                      style: theme.textTheme.bodyLarge?.copyWith(
                        color: AppColors.mutedForeground,
                      ),
                    ),
                    const SizedBox(height: 28),
                    Wrap(
                      spacing: 12,
                      runSpacing: 12,
                      children: const [
                        _AuthHighlight(
                          label: 'CAPTURE',
                          text:
                              'Receipt intake stays close to the camera and review flow.',
                        ),
                        _AuthHighlight(
                          label: 'TRACK',
                          text:
                              'Dashboard and optimizer stay behind session-aware routes.',
                        ),
                        _AuthHighlight(
                          label: 'ACT',
                          text:
                              'Move from raw numbers to guided decisions without context switching.',
                        ),
                      ],
                    ),
                  ],
                ),
              );

              final formPane = Container(
                constraints: const BoxConstraints(maxWidth: 460),
                decoration: AppTheme.glassPanel(
                  heavy: true,
                  radius: BorderRadius.circular(32),
                ),
                padding: const EdgeInsets.all(28),
                child: child,
              );

              return Padding(
                padding: const EdgeInsets.all(20),
                child: Center(
                  child: ConstrainedBox(
                    constraints: const BoxConstraints(maxWidth: 1180),
                    child: wide
                        ? Row(
                            children: [
                              Expanded(flex: 11, child: hero),
                              const SizedBox(width: 20),
                              Expanded(flex: 9, child: Align(child: formPane)),
                            ],
                          )
                        : SingleChildScrollView(
                            child: Column(
                              children: [
                                hero,
                                const SizedBox(height: 20),
                                formPane,
                              ],
                            ),
                          ),
                  ),
                ),
              );
            },
          ),
        ),
      ),
    );
  }
}

class _AuthHighlight extends StatelessWidget {
  const _AuthHighlight({required this.label, required this.text});

  final String label;
  final String text;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return ConstrainedBox(
      constraints: const BoxConstraints(minWidth: 180, maxWidth: 220),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: AppTheme.softPanel(radius: BorderRadius.circular(24)),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              label,
              style: AppTheme.monoLabel(context, color: AppColors.brand),
            ),
            const SizedBox(height: 10),
            Text(text, style: theme.textTheme.bodySmall),
          ],
        ),
      ),
    );
  }
}
