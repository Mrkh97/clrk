import 'package:flutter/widgets.dart';
import 'package:forui/forui.dart';

class AppSectionCard extends StatelessWidget {
  const AppSectionCard({
    required this.title,
    required this.child,
    this.subtitle,
    super.key,
  });

  final String title;
  final String? subtitle;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return FCard.raw(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(title, style: context.theme.typography.lg),
            if (subtitle != null) ...[
              const SizedBox(height: 6),
              Text(
                subtitle!,
                style: context.theme.typography.sm.copyWith(
                  color: context.theme.colors.mutedForeground,
                ),
              ),
            ],
            const SizedBox(height: 16),
            child,
          ],
        ),
      ),
    );
  }
}
