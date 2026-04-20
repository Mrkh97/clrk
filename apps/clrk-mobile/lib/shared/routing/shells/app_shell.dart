import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';

import '../../../features/auth/usecases/auth_controller.dart';
import '../../extensions/build_context_extensions.dart';
import '../../theme/app_theme.dart';
import '../components/app_bottom_nav.dart';

class AppShell extends ConsumerWidget {
  const AppShell({required this.navigationShell, super.key});

  final StatefulNavigationShell navigationShell;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      body: DecoratedBox(
        decoration: BoxDecoration(gradient: AppTheme.backgroundGradient()),
        child: Stack(
          children: [
            navigationShell,
            Positioned(
              bottom: 0,
              left: 0,
              right: 0,
              child: AppBottomNav(
                currentIndex: navigationShell.currentIndex,
                onTap: (index) {
                  navigationShell.goBranch(
                    index,
                    initialLocation: index == navigationShell.currentIndex,
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
