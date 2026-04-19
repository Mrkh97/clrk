import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';

import '../../features/receipt/presentation/receipt_screen.dart';

final appRouterProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    routes: [
      GoRoute(path: '/', redirect: (_, _) => '/receipt'),
      GoRoute(
        path: '/receipt',
        pageBuilder: (context, state) =>
            const MaterialPage<void>(child: ReceiptScreen()),
      ),
    ],
  );
});
