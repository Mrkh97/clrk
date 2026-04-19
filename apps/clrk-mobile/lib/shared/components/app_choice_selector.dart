import 'package:flutter/widgets.dart';
import 'package:forui/forui.dart';

import 'app_button.dart';

class AppChoice<T> {
  const AppChoice({required this.value, required this.label});

  final T value;
  final String label;
}

class AppChoiceSelector<T> extends StatelessWidget {
  const AppChoiceSelector({
    required this.label,
    required this.value,
    required this.choices,
    required this.onChanged,
    super.key,
  });

  final String label;
  final T value;
  final List<AppChoice<T>> choices;
  final ValueChanged<T> onChanged;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label),
        const SizedBox(height: 8),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: [
            for (final choice in choices)
              AppButton(
                label: choice.label,
                expand: false,
                variant: choice.value == value
                    ? FButtonVariant.primary
                    : FButtonVariant.outline,
                onPress: () => onChanged(choice.value),
              ),
          ],
        ),
      ],
    );
  }
}
