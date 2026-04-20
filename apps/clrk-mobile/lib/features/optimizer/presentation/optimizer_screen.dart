import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';

import '../../../shared/components/app_button.dart';
import '../../../shared/components/app_page_scaffold.dart';
import '../../../shared/components/app_section_card.dart';
import '../../../shared/extensions/build_context_extensions.dart';
import '../../../shared/theme/app_theme.dart';
import '../../../shared/utils/formatting.dart';
import '../domains/optimization_result.dart';
import '../usecases/remote_optimizer_repository_provider.dart';

class OptimizerScreen extends ConsumerStatefulWidget {
  const OptimizerScreen({super.key});

  @override
  ConsumerState<OptimizerScreen> createState() => _OptimizerScreenState();
}

class _OptimizerScreenState extends ConsumerState<OptimizerScreen> {
  String _level = 'easy';
  late DateTime _from;
  late DateTime _to;
  bool _isLoading = false;
  String? _error;
  OptimizationResult? _result;

  @override
  void initState() {
    super.initState();
    _to = DateTime.now();
    _from = _to.subtract(const Duration(days: 30));
  }

  @override
  Widget build(BuildContext context) {
    return AppPageScaffold(
      title: 'Spending Optimizer',
      subtitle:
          'Pressure-test your recent spend and surface cuts that still feel realistic.',
      child: ListView(
        padding: const EdgeInsets.only(bottom: 140),
        children: [
          AppSectionCard(
            title: 'Optimization Brief',
            subtitle:
                'Choose a level and time window before the backend builds its suggestion set.',
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('LEVEL', style: AppTheme.monoLabel(context)),
                const SizedBox(height: 10),
                Row(
                  children: [
                    Expanded(
                      child: _LevelOption(
                        label: 'Easy',
                        selected: _level == 'easy',
                        onTap: () => setState(() => _level = 'easy'),
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: _LevelOption(
                        label: 'Hard',
                        selected: _level == 'hard',
                        onTap: () => setState(() => _level = 'hard'),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                Row(
                  children: [
                    Expanded(
                      child: _DateCard(
                        label: 'From',
                        value: formatDateInput(_from),
                        onTap: () => _pickDate(isFrom: true),
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: _DateCard(
                        label: 'To',
                        value: formatDateInput(_to),
                        onTap: () => _pickDate(isFrom: false),
                      ),
                    ),
                  ],
                ),
                if (_error != null) ...[
                  const SizedBox(height: 16),
                  Text(
                    _error!,
                    style: Theme.of(
                      context,
                    ).textTheme.bodySmall?.copyWith(color: AppColors.error),
                  ),
                ],
                const SizedBox(height: 18),
                AppButton(
                  label: _isLoading ? 'Analyzing...' : 'Run Optimizer',
                  onPress: _isLoading ? null : _submit,
                ),
              ],
            ),
          ),
          const SizedBox(height: 18),
          if (_isLoading)
            const AppSectionCard(
              title: 'Analyzing',
              subtitle:
                  'The optimizer is evaluating your recent spend patterns.',
              child: Center(
                child: Padding(
                  padding: EdgeInsets.symmetric(vertical: 12),
                  child: CircularProgressIndicator(),
                ),
              ),
            ),
          if (_result != null) ...[
            _OptimizerResultCard(result: _result!),
            const SizedBox(height: 18),
            for (final suggestion in _result!.suggestions) ...[
              _SuggestionCard(
                suggestion: suggestion,
                currency: _result!.currency,
              ),
              const SizedBox(height: 12),
            ],
          ],
        ],
      ),
    );
  }

  Future<void> _pickDate({required bool isFrom}) async {
    final initialDate = isFrom ? _from : _to;
    final firstDate = DateTime.now().subtract(const Duration(days: 365 * 2));
    final lastDate = DateTime.now();
    final selected = await showDatePicker(
      context: context,
      firstDate: firstDate,
      lastDate: lastDate,
      initialDate: initialDate,
    );

    if (selected == null) {
      return;
    }

    setState(() {
      if (isFrom) {
        _from = selected;
      } else {
        _to = selected;
      }
    });
  }

  Future<void> _submit() async {
    if (_from.isAfter(_to)) {
      setState(() => _error = '`From` must be on or before `To`.');
      return;
    }

    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final result = await ref
          .read(remoteOptimizerRepositoryProvider)
          .optimize(
            level: _level,
            from: formatDateInput(_from),
            to: formatDateInput(_to),
          );

      if (!mounted) return;

      setState(() => _result = result);
      context.showInfoToast(
        'Optimizer complete',
        description:
            'Found ${result.suggestions.length} suggestions for your selected window.',
      );
    } catch (error) {
      if (!mounted) return;
      final message = error.toString();
      setState(() => _error = message);
      context.showErrorToast('Optimizer failed', description: message);
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }
}

class _LevelOption extends StatelessWidget {
  const _LevelOption({
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
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
        decoration: BoxDecoration(
          color: selected ? AppColors.brand : AppColors.surfaceSoft,
          borderRadius: BorderRadius.circular(22),
          border: Border.all(
            color: selected ? AppColors.brand : AppColors.border,
          ),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              label.toUpperCase(),
              style: AppTheme.monoLabel(
                context,
                color: selected
                    ? const Color(0xFF16110D)
                    : AppColors.foreground,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              label == 'Easy'
                  ? 'Smaller, easier lifestyle cuts.'
                  : 'Bigger moves and stricter savings pressure.',
              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                color: selected
                    ? const Color(0xFF241A14)
                    : AppColors.mutedForeground,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _DateCard extends StatelessWidget {
  const _DateCard({
    required this.label,
    required this.value,
    required this.onTap,
  });

  final String label;
  final String value;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(22),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: AppTheme.softPanel(radius: BorderRadius.circular(22)),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(label.toUpperCase(), style: AppTheme.monoLabel(context)),
            const SizedBox(height: 8),
            Text(value, style: Theme.of(context).textTheme.titleMedium),
          ],
        ),
      ),
    );
  }
}

class _OptimizerResultCard extends StatelessWidget {
  const _OptimizerResultCard({required this.result});

  final OptimizationResult result;

  @override
  Widget build(BuildContext context) {
    return AppSectionCard(
      title: 'Optimizer Result',
      subtitle:
          'A compressed summary of current spend versus possible savings.',
      child: Row(
        children: [
          Expanded(
            child: _ResultMetric(
              label: 'Current Spend',
              value: formatCurrency(result.totalCurrentSpend, result.currency),
              tone: AppColors.foreground,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: _ResultMetric(
              label: 'Potential Savings',
              value: formatCurrency(result.totalSavings, result.currency),
              tone: AppColors.success,
            ),
          ),
        ],
      ),
    );
  }
}

class _ResultMetric extends StatelessWidget {
  const _ResultMetric({
    required this.label,
    required this.value,
    required this.tone,
  });

  final String label;
  final String value;
  final Color tone;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: AppTheme.softPanel(radius: BorderRadius.circular(22)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label.toUpperCase(), style: AppTheme.monoLabel(context)),
          const SizedBox(height: 10),
          Text(
            value,
            style: Theme.of(
              context,
            ).textTheme.headlineMedium?.copyWith(color: tone),
          ),
        ],
      ),
    );
  }
}

class _SuggestionCard extends StatelessWidget {
  const _SuggestionCard({required this.suggestion, required this.currency});

  final CutSuggestion suggestion;
  final String currency;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return AppSectionCard(
      title: suggestion.merchant,
      subtitle: suggestion.category,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(
                child: _SuggestionMetric(
                  label: 'Current',
                  value: formatCurrency(suggestion.currentSpend, currency),
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: _SuggestionMetric(
                  label: 'Suggested',
                  value: formatCurrency(suggestion.suggestedSpend, currency),
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: _SuggestionMetric(
                  label: 'Saving',
                  value: formatCurrency(suggestion.saving, currency),
                  tone: AppColors.success,
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),
          Text(suggestion.reason, style: theme.textTheme.bodySmall),
        ],
      ),
    );
  }
}

class _SuggestionMetric extends StatelessWidget {
  const _SuggestionMetric({
    required this.label,
    required this.value,
    this.tone = AppColors.foreground,
  });

  final String label;
  final String value;
  final Color tone;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label.toUpperCase(), style: AppTheme.monoLabel(context)),
        const SizedBox(height: 6),
        Text(
          value,
          style: Theme.of(context).textTheme.titleMedium?.copyWith(color: tone),
        ),
      ],
    );
  }
}
