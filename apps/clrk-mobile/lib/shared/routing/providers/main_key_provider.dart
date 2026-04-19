import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';

final mainKeyProvider = Provider<GlobalKey<NavigatorState>>((ref) {
  return GlobalKey<NavigatorState>();
});
