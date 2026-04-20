import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../theme/app_theme.dart';

class AppTextField extends StatefulWidget {
  const AppTextField({
    required this.label,
    required this.onChanged,
    this.value,
    this.controller,
    this.hint,
    this.keyboardType,
    this.textInputAction,
    this.maxLines = 1,
    this.readOnly = false,
    this.onTap,
    this.inputFormatters,
    this.enabled = true,
    this.obscureText = false,
    super.key,
  });

  final String label;
  final String? value;
  final TextEditingController? controller;
  final ValueChanged<String> onChanged;
  final String? hint;
  final TextInputType? keyboardType;
  final TextInputAction? textInputAction;
  final int maxLines;
  final bool readOnly;
  final GestureTapCallback? onTap;
  final List<TextInputFormatter>? inputFormatters;
  final bool enabled;
  final bool obscureText;

  @override
  State<AppTextField> createState() => _AppTextFieldState();
}

class _AppTextFieldState extends State<AppTextField> {
  TextEditingController? _internalController;

  TextEditingController get _effectiveController =>
      widget.controller ?? _internalController!;

  @override
  void initState() {
    super.initState();

    if (widget.controller == null) {
      _internalController = TextEditingController(text: widget.value ?? '');
    }
  }

  @override
  void didUpdateWidget(covariant AppTextField oldWidget) {
    super.didUpdateWidget(oldWidget);

    if (oldWidget.controller != widget.controller) {
      if (oldWidget.controller == null) {
        _internalController?.dispose();
        _internalController = null;
      }

      if (widget.controller == null) {
        _internalController = TextEditingController(text: widget.value ?? '');
      }
    }

    if (widget.controller == null) {
      final nextValue = widget.value ?? '';
      if (nextValue != _effectiveController.text) {
        _effectiveController.value = TextEditingValue(
          text: nextValue,
          selection: TextSelection.collapsed(offset: nextValue.length),
        );
      }
    }
  }

  @override
  void dispose() {
    _internalController?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(widget.label.toUpperCase(), style: AppTheme.monoLabel(context)),
        const SizedBox(height: 8),
        TextFormField(
          controller: _effectiveController,
          onChanged: widget.onChanged,
          keyboardType: widget.keyboardType,
          textInputAction: widget.textInputAction,
          maxLines: widget.obscureText ? 1 : widget.maxLines,
          readOnly: widget.readOnly,
          onTap: widget.onTap,
          inputFormatters: widget.inputFormatters,
          enabled: widget.enabled,
          obscureText: widget.obscureText,
          style: Theme.of(context).textTheme.bodyLarge,
          decoration: InputDecoration(
            hintText: widget.hint,
            filled: true,
            fillColor: AppColors.surfaceSoft,
          ),
        ),
      ],
    );
  }
}
