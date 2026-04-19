import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:forui/forui.dart';

class AppTextField extends StatelessWidget {
  const AppTextField({
    required this.label,
    required this.value,
    required this.onChanged,
    this.hint,
    this.keyboardType,
    this.textInputAction,
    this.maxLines = 1,
    this.readOnly = false,
    this.onTap,
    this.inputFormatters,
    this.enabled = true,
    super.key,
  });

  final String label;
  final String value;
  final ValueChanged<String> onChanged;
  final String? hint;
  final TextInputType? keyboardType;
  final TextInputAction? textInputAction;
  final int maxLines;
  final bool readOnly;
  final GestureTapCallback? onTap;
  final List<TextInputFormatter>? inputFormatters;
  final bool enabled;

  @override
  Widget build(BuildContext context) {
    return FTextField(
      control: FTextFieldControl.lifted(
        value: TextEditingValue(text: value),
        onChange: (next) => onChanged(next.text),
      ),
      label: Text(label),
      hint: hint,
      keyboardType: keyboardType,
      textInputAction: textInputAction,
      maxLines: maxLines,
      readOnly: readOnly,
      onTap: onTap,
      inputFormatters: inputFormatters,
      enabled: enabled,
    );
  }
}
