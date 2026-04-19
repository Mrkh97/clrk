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
    final content = Row(
      mainAxisSize: expand ? MainAxisSize.max : MainAxisSize.min,
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        if (icon != null) ...[icon!, const SizedBox(width: 8)],
        Flexible(child: Text(label, textAlign: TextAlign.center)),
      ],
    );

    final buttonStyle = switch (variant) {
      FButtonVariant.outline => OutlinedButton.styleFrom(
        minimumSize: Size.fromHeight(expand ? 52 : 44),
        side: const BorderSide(color: AppColors.borderStrong),
        backgroundColor: Colors.transparent,
        foregroundColor: AppColors.foreground,
      ),
      _ => ElevatedButton.styleFrom(
        minimumSize: Size.fromHeight(expand ? 52 : 44),
        backgroundColor: AppColors.brand,
        foregroundColor: const Color(0xFF14100D),
      ),
    };

    final child = expand ? SizedBox(width: double.infinity, child: content) : content;

    if (variant == FButtonVariant.outline) {
      return OutlinedButton(onPressed: onPress, style: buttonStyle, child: child);
    }

    return ElevatedButton(onPressed: onPress, style: buttonStyle, child: child);
  }
}
