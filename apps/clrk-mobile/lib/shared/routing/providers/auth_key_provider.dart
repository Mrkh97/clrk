import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';

final authKeyProvider = Provider<GlobalKey<NavigatorState>>((ref) {
  return GlobalKey<NavigatorState>();
});
