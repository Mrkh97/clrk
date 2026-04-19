import 'package:flutter/material.dart';
import 'package:forui/forui.dart';

extension BuildContextExtensions on BuildContext {
  void showInfoToast(String title, {String? description}) {
    showFToast(
      context: this,
      title: Text(title),
      description: description == null ? null : Text(description),
    );
  }

  void showErrorToast(String title, {String? description}) {
    showFToast(
      context: this,
      variant: FToastVariant.destructive,
      title: Text(title),
      description: description == null ? null : Text(description),
    );
  }
}
