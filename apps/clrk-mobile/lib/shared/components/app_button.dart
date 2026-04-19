import 'package:flutter/widgets.dart';
import 'package:forui/forui.dart';

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

    return FButton(variant: variant, onPress: onPress, child: content);
  }
}
