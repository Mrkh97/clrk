import 'package:flutter/material.dart';
import 'package:forui/forui.dart';

import '../theme/app_theme.dart';

class AppButton extends StatelessWidget {
  const AppButton({
    required this.label,
    required this.onPress,
    this.icon,
    this.variant = FButtonVariant.primary,
    this.expand = true,
    super.key,
  });

  final String label;
  final VoidCallback? onPress;
  final Widget? icon;
  final FButtonVariant variant;
  final bool expand;

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final shouldExpand = expand && constraints.hasBoundedWidth;
        final minHeight = expand ? 52.0 : 44.0;

        final content = Row(
          mainAxisSize: shouldExpand ? MainAxisSize.max : MainAxisSize.min,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            if (icon != null) ...[icon!, const SizedBox(width: 8)],
            if (shouldExpand)
              Expanded(
                child: Text(
                  label,
                  textAlign: TextAlign.center,
                  overflow: TextOverflow.ellipsis,
                ),
              )
            else
              Text(
                label,
                textAlign: TextAlign.center,
                overflow: TextOverflow.ellipsis,
              ),
          ],
        );

        final buttonStyle = switch (variant) {
          FButtonVariant.outline => OutlinedButton.styleFrom(
            minimumSize: Size(0, minHeight),
            side: const BorderSide(color: AppColors.borderStrong),
            backgroundColor: Colors.transparent,
            foregroundColor: AppColors.foreground,
          ),
          _ => ElevatedButton.styleFrom(
            minimumSize: Size(0, minHeight),
            backgroundColor: AppColors.brand,
            foregroundColor: const Color(0xFF14100D),
          ),
        };

        final button = variant == FButtonVariant.outline
            ? OutlinedButton(
                onPressed: onPress,
                style: buttonStyle,
                child: content,
              )
            : ElevatedButton(
                onPressed: onPress,
                style: buttonStyle,
                child: content,
              );

        if (shouldExpand) {
          return SizedBox(width: double.infinity, child: button);
        }

        return button;
      },
    );
  }
}
