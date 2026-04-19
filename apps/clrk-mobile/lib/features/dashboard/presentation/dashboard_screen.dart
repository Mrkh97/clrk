import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';

import '../../../shared/components/app_page_scaffold.dart';
import '../../../shared/components/app_section_card.dart';
import '../../../shared/theme/app_theme.dart';
import '../../../shared/utils/formatting.dart';
import '../domains/dashboard_data.dart';
import '../usecases/dashboard_providers.dart';

class DashboardScreen extends ConsumerWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final dashboardState = ref.watch(dashboardDataProvider);
    final selectedFilter = ref.watch(dashboardTimeFilterProvider);

    return AppPageScaffold(
      title: 'Spending Dashboard',
      subtitle: 'A dark, live read on your spend, category pressure, and most recent transactions.',
      actions: IconButton(
        onPressed: () => ref.invalidate(dashboardDataProvider),
        icon: const Icon(Icons.refresh_rounded),
      ),
      child: ListView(
        padding: const EdgeInsets.only(bottom: 140),
        children: [
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: [
                for (final filter in DashboardTimeFilter.values) ...[
                    _FilterChip(
                    label: filter.label,
                    selected: filter == selectedFilter,
                    onTap: () {
                      ref.read(dashboardTimeFilterProvider.notifier).setFilter(filter);
                    },
                  ),
                  const SizedBox(width: 10),
                ],
              ],
            ),
          ),
          const SizedBox(height: 18),
          dashboardState.when(
            loading: () => const _DashboardLoading(),
            error: (error, _) => _DashboardError(
              message: error.toString(),
              onRetry: () => ref.invalidate(dashboardDataProvider),
            ),
            data: (data) => _DashboardContent(data: data),
          ),
        ],
      ),
    );
  }
}

class _DashboardContent extends StatelessWidget {
  const _DashboardContent({required this.data});

  final DashboardData data;

  @override
  Widget build(BuildContext context) {
    final stats = data.stats;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        GridView.count(
          physics: const NeverScrollableScrollPhysics(),
          crossAxisCount: 2,
          shrinkWrap: true,
          mainAxisSpacing: 12,
          crossAxisSpacing: 12,
          childAspectRatio: 1.25,
          children: [
            _MetricCard(
              label: 'Total Spent',
              value: formatCurrency(stats.totalSpent, data.currency),
              tone: AppColors.brand,
            ),
            _MetricCard(
              label: 'Avg Daily',
              value: formatCurrency(stats.avgDaily, data.currency),
            ),
            _MetricCard(label: 'Top Category', value: stats.topCategory.toUpperCase()),
            _MetricCard(
              label: 'Transactions',
              value: stats.transactionCount.toString(),
            ),
          ],
        ),
        const SizedBox(height: 18),
        AppSectionCard(
          title: 'Monthly Spend',
          subtitle: 'Recent trend compressed into a compact instrument rail.',
          child: Column(
            children: [
              for (final item in data.monthlySpend) ...[
                _BarRow(
                  label: item.label,
                  value: formatCurrency(item.amount, data.currency),
                  ratio: _monthlyRatio(item.amount, data.monthlySpend),
                ),
                const SizedBox(height: 12),
              ],
            ],
          ),
        ),
        const SizedBox(height: 18),
        AppSectionCard(
          title: 'Category Pressure',
          subtitle: 'Where your budget is taking the most force right now.',
          child: Column(
            children: [
              for (final item in data.categorySpend) ...[
                _BarRow(
                  label: item.category.toUpperCase(),
                  value: '${item.percentage.toStringAsFixed(0)}%',
                  ratio: (item.percentage / 100).clamp(0, 1),
                  tone: AppColors.success,
                ),
                const SizedBox(height: 12),
              ],
            ],
          ),
        ),
        const SizedBox(height: 18),
        AppSectionCard(
          title: 'Recent Transactions',
          subtitle: 'Your last recorded movements in the authenticated workspace.',
          child: Column(
            children: [
              for (final transaction in data.transactions.take(6)) ...[
                _TransactionTile(transaction: transaction),
                const SizedBox(height: 12),
              ],
            ],
          ),
        ),
      ],
    );
  }

  double _monthlyRatio(double amount, List<MonthlySpend> values) {
    final max = values.fold<double>(0, (current, item) => item.amount > current ? item.amount : current);

    if (max <= 0) {
      return 0;
    }

    return (amount / max).clamp(0, 1);
  }
}

class _MetricCard extends StatelessWidget {
  const _MetricCard({
    required this.label,
    required this.value,
    this.tone = AppColors.foreground,
  });

  final String label;
  final String value;
  final Color tone;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Container(
      decoration: AppTheme.glassPanel(),
      padding: const EdgeInsets.all(18),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label.toUpperCase(), style: AppTheme.monoLabel(context)),
          const Spacer(),
          Text(
            value,
            style: theme.textTheme.headlineMedium?.copyWith(color: tone),
          ),
        ],
      ),
    );
  }
}

class _BarRow extends StatelessWidget {
  const _BarRow({
    required this.label,
    required this.value,
    required this.ratio,
    this.tone = AppColors.brand,
  });

  final String label;
  final String value;
  final double ratio;
  final Color tone;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Expanded(
              child: Text(label, style: theme.textTheme.bodyMedium),
            ),
            Text(value, style: AppTheme.monoLabel(context, color: AppColors.foreground)),
          ],
        ),
        const SizedBox(height: 8),
        ClipRRect(
          borderRadius: BorderRadius.circular(999),
          child: LinearProgressIndicator(
            value: ratio,
            minHeight: 10,
            backgroundColor: AppColors.surfaceSoft,
            valueColor: AlwaysStoppedAnimation<Color>(tone),
          ),
        ),
      ],
    );
  }
}

class _TransactionTile extends StatelessWidget {
  const _TransactionTile({required this.transaction});

  final DashboardTransaction transaction;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Container(
      decoration: AppTheme.softPanel(radius: BorderRadius.circular(22)),
      padding: const EdgeInsets.all(14),
      child: Row(
        children: [
          Container(
            width: 42,
            height: 42,
            decoration: BoxDecoration(
              color: AppColors.brand.withValues(alpha: 0.12),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.receipt_long_rounded, color: AppColors.brand),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(transaction.merchant, style: theme.textTheme.titleMedium),
                const SizedBox(height: 4),
                Text(
                  '${transaction.category} • ${formatDateLabel(transaction.date)}',
                  style: theme.textTheme.bodySmall,
                ),
              ],
            ),
          ),
          const SizedBox(width: 8),
          Text(
            formatCurrency(transaction.amount, transaction.currency),
            style: theme.textTheme.titleMedium,
          ),
        ],
      ),
    );
  }
}

class _DashboardLoading extends StatelessWidget {
  const _DashboardLoading();

  @override
  Widget build(BuildContext context) {
    return Column(
      children: List.generate(
        4,
        (_) => Padding(
          padding: const EdgeInsets.only(bottom: 12),
          child: Container(
            height: 110,
            decoration: AppTheme.glassPanel(),
          ),
        ),
      ),
    );
  }
}

class _DashboardError extends StatelessWidget {
  const _DashboardError({required this.message, required this.onRetry});

  final String message;
  final VoidCallback onRetry;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return AppSectionCard(
      title: 'Dashboard unavailable',
      subtitle: 'The dashboard endpoint returned an error.',
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(message, style: theme.textTheme.bodySmall),
          const SizedBox(height: 14),
          FilledButton(onPressed: onRetry, child: const Text('Retry')),
        ],
      ),
    );
  }
}

class _FilterChip extends StatelessWidget {
  const _FilterChip({
    required this.label,
    required this.selected,
    required this.onTap,
  });

  final String label;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        decoration: BoxDecoration(
          color: selected ? AppColors.brand : AppColors.surfaceSoft,
          borderRadius: BorderRadius.circular(999),
          border: Border.all(
            color: selected ? AppColors.brand : AppColors.border,
          ),
        ),
        child: Text(
          label,
          style: AppTheme.monoLabel(
            context,
            color: selected ? const Color(0xFF17120F) : AppColors.foreground,
          ),
        ),
      ),
    );
  }
}
