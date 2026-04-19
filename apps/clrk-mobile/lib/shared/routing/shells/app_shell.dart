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
        child: navigationShell,
      ),
      floatingActionButton: FloatingActionButton.small(
        onPressed: () async {
          try {
            await ref.read(authControllerProvider.notifier).signOut();
          } catch (error) {
            if (!context.mounted) {
              return;
            }

            context.showErrorToast(
              'Sign out failed',
              description: authErrorMessage(error),
            );
          }
        },
        backgroundColor: AppColors.surfaceHeavy,
        foregroundColor: AppColors.foreground,
        child: const Icon(Icons.logout_rounded, size: 18),
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.miniEndTop,
      bottomNavigationBar: AppBottomNav(
        currentIndex: navigationShell.currentIndex,
        onTap: (index) {
          navigationShell.goBranch(
            index,
            initialLocation: index == navigationShell.currentIndex,
          );
        },
      ),
    );
  }
}
