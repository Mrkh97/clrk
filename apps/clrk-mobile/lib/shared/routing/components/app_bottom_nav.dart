import 'package:flutter/material.dart';

import '../../theme/app_theme.dart';

class AppBottomNav extends StatelessWidget {
  const AppBottomNav({
    required this.currentIndex,
    required this.onTap,
    super.key,
  });

  final int currentIndex;
  final ValueChanged<int> onTap;

  static const _items = [
    _BottomNavItem(label: 'Dashboard', icon: Icons.grid_view_rounded),
    _BottomNavItem(label: 'Optimizer', icon: Icons.auto_awesome_rounded),
    _BottomNavItem(label: 'Receipts', icon: Icons.receipt_long_rounded),
  ];

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      top: false,
      child: Padding(
        padding: const EdgeInsets.fromLTRB(16, 8, 16, 12),
        child: Container(
          decoration: AppTheme.glassPanel(heavy: true, radius: BorderRadius.circular(28)),
          child: Row(
            children: [
              for (var index = 0; index < _items.length; index++)
                Expanded(
                  child: _BottomNavButton(
                    item: _items[index],
                    isActive: index == currentIndex,
                    onTap: () => onTap(index),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}

class _BottomNavButton extends StatelessWidget {
  const _BottomNavButton({
    required this.item,
    required this.isActive,
    required this.onTap,
  });

  final _BottomNavItem item;
  final bool isActive;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(24),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 14),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 6,
              height: 6,
              decoration: BoxDecoration(
                color: isActive ? AppColors.brand : Colors.transparent,
                shape: BoxShape.circle,
              ),
            ),
            const SizedBox(height: 8),
            Icon(
              item.icon,
              size: 18,
              color: isActive ? AppColors.foreground : AppColors.mutedForeground,
            ),
            const SizedBox(height: 6),
            Text(
              item.label.toUpperCase(),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: theme.textTheme.labelSmall?.copyWith(
                color: isActive ? AppColors.foreground : AppColors.mutedForeground,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _BottomNavItem {
  const _BottomNavItem({required this.label, required this.icon});

  final String label;
  final IconData icon;
}
