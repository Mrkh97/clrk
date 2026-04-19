import 'package:flutter/material.dart';

import '../theme/app_theme.dart';

class AppPageScaffold extends StatelessWidget {
  const AppPageScaffold({
    required this.title,
    required this.subtitle,
    required this.child,
    this.actions,
    super.key,
  });

  final String title;
  final String subtitle;
  final Widget child;
  final Widget? actions;

  @override
  Widget build(BuildContext context) {
    final actions = this.actions;
    final theme = Theme.of(context);

    return DecoratedBox(
      decoration: BoxDecoration(gradient: AppTheme.backgroundGradient()),
      child: SafeArea(
        bottom: false,
        child: Padding(
          padding: const EdgeInsets.fromLTRB(20, 20, 20, 0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('WORKSPACE', style: AppTheme.monoLabel(context)),
                        const SizedBox(height: 10),
                        Text(title, style: theme.textTheme.headlineLarge),
                        const SizedBox(height: 8),
                        Text(
                          subtitle,
                          style: theme.textTheme.bodyMedium?.copyWith(
                            color: AppColors.mutedForeground,
                          ),
                        ),
                      ],
                    ),
                  ),
                  ?actions,
                ],
              ),
              const SizedBox(height: 20),
              Expanded(child: child),
            ],
          ),
        ),
      ),
    );
  }
}
