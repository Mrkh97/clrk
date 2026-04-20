import 'package:flutter/material.dart';
import 'package:forui/forui.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';

import '../../../../shared/components/app_button.dart';
import '../../../../shared/components/app_section_card.dart';
import '../../../../shared/theme/app_theme.dart';
import '../../domains/domains.dart';
import '../../usecases/delete_receipt_notifier.dart';
import '../../usecases/extract_receipt_notifier.dart';
import '../../usecases/list_receipts_provider.dart';
import '../../usecases/selected_receipt_id_notifier.dart';

class ReceiptsList extends ConsumerStatefulWidget {
  const ReceiptsList({super.key});

  @override
  ConsumerState<ReceiptsList> createState() => _ReceiptsListState();
}

class _ReceiptsListState extends ConsumerState<ReceiptsList> {
  DateTime? _fromDate;
  DateTime? _toDate;
  ReceiptCategory? _selectedCategory;

  @override
  Widget build(BuildContext context) {
    final receipts = ref.watch(listReceiptsProvider);
    final deleteState = ref.watch(deleteReceiptProvider);

    return AppSectionCard(
      title: 'Receipts',
      subtitle: 'Filter, edit, or remove saved receipts.',
      child: receipts.when(
        data: (items) {
          final filteredItems = _applyFilters(items);

          return Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _ReceiptsFiltersBar(
                fromDate: _fromDate,
                toDate: _toDate,
                selectedCategory: _selectedCategory,
                onSelectFromDate: () => _pickDate(isFromDate: true),
                onSelectToDate: () => _pickDate(isFromDate: false),
                onCategoryChanged: (value) {
                  setState(() {
                    _selectedCategory = value;
                  });
                },
                onClearFilters: _hasFilters
                    ? () {
                        setState(() {
                          _fromDate = null;
                          _toDate = null;
                          _selectedCategory = null;
                        });
                      }
                    : null,
              ),
              const SizedBox(height: 16),
              Text(
                '${filteredItems.length} receipt${filteredItems.length == 1 ? '' : 's'}',
                style: AppTheme.monoLabel(context),
              ),
              const SizedBox(height: 12),
              if (items.isEmpty)
                const Text(
                  'No receipts yet. Capture or import one to get started.',
                )
              else if (filteredItems.isEmpty)
                const Text(
                  'No receipts match the selected date range and category.',
                )
              else
                Column(
                  children: [
                    for (final receipt in filteredItems) ...[
                      _ReceiptListItem(
                        receipt: receipt,
                        isDeleting: deleteState.isLoading,
                      ),
                      if (receipt != filteredItems.last)
                        const SizedBox(height: 12),
                    ],
                  ],
                ),
            ],
          );
        },
        error: (error, _) => Text('Could not load receipts: $error'),
        loading: () => const Center(child: CircularProgressIndicator()),
      ),
    );
  }

  bool get _hasFilters =>
      _fromDate != null || _toDate != null || _selectedCategory != null;

  Future<void> _pickDate({required bool isFromDate}) async {
    final currentValue = isFromDate ? _fromDate : _toDate;
    final selected = await showDatePicker(
      context: context,
      initialDate: currentValue ?? DateTime.now(),
      firstDate: DateTime(2020),
      lastDate: DateTime(2100),
    );

    if (selected == null || !mounted) {
      return;
    }

    setState(() {
      if (isFromDate) {
        _fromDate = selected;
      } else {
        _toDate = selected;
      }
    });
  }

  List<Receipt> _applyFilters(List<Receipt> items) {
    return items.where((receipt) {
      final receiptDate = DateTime.tryParse(receipt.date);
      if (receiptDate == null) {
        return false;
      }

      if (_selectedCategory != null && receipt.category != _selectedCategory) {
        return false;
      }

      if (_fromDate != null &&
          _startOfDay(receiptDate).isBefore(_startOfDay(_fromDate!))) {
        return false;
      }

      if (_toDate != null &&
          _startOfDay(receiptDate).isAfter(_startOfDay(_toDate!))) {
        return false;
      }

      return true;
    }).toList()..sort((a, b) => b.date.compareTo(a.date));
  }

  DateTime _startOfDay(DateTime value) {
    return DateTime(value.year, value.month, value.day);
  }
}

class _ReceiptsFiltersBar extends StatelessWidget {
  const _ReceiptsFiltersBar({
    required this.fromDate,
    required this.toDate,
    required this.selectedCategory,
    required this.onSelectFromDate,
    required this.onSelectToDate,
    required this.onCategoryChanged,
    required this.onClearFilters,
  });

  final DateTime? fromDate;
  final DateTime? toDate;
  final ReceiptCategory? selectedCategory;
  final VoidCallback onSelectFromDate;
  final VoidCallback onSelectToDate;
  final ValueChanged<ReceiptCategory?> onCategoryChanged;
  final VoidCallback? onClearFilters;

  @override
  Widget build(BuildContext context) {
    final categoryItems = <DropdownMenuItem<String>>[
      const DropdownMenuItem<String>(
        value: 'all',
        child: Text(
          'All categories',
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
        ),
      ),
      for (final category in ReceiptCategory.values)
        DropdownMenuItem<String>(
          value: category.name,
          child: Text(
            category.label,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
        ),
    ];

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(14),
      decoration: AppTheme.softPanel(radius: BorderRadius.circular(20)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(
                child: Text('Filters', style: AppTheme.monoLabel(context)),
              ),
              if (onClearFilters != null)
                TextButton(
                  onPressed: onClearFilters,
                  child: const Text('Clear'),
                ),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: AppButton(
                  label: fromDate == null
                      ? 'From date'
                      : _formatDate(fromDate!),
                  variant: FButtonVariant.outline,
                  onPress: onSelectFromDate,
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: AppButton(
                  label: toDate == null ? 'To date' : _formatDate(toDate!),
                  variant: FButtonVariant.outline,
                  onPress: onSelectToDate,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          DropdownButtonFormField<String>(
            initialValue: selectedCategory?.name ?? 'all',
            isExpanded: true,
            onChanged: (value) {
              onCategoryChanged(
                value == null || value == 'all'
                    ? null
                    : ReceiptCategory.values.firstWhere(
                        (category) => category.name == value,
                      ),
              );
            },
            selectedItemBuilder: (context) => [
              const Align(
                alignment: Alignment.centerLeft,
                child: Text('All categories'),
              ),
              for (final category in ReceiptCategory.values)
                Align(
                  alignment: Alignment.centerLeft,
                  child: Text(
                    category.label,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
            ],
            dropdownColor: AppColors.backgroundElevated,
            decoration: const InputDecoration(labelText: 'Category'),
            items: categoryItems,
          ),
        ],
      ),
    );
  }
}

class _ReceiptListItem extends ConsumerWidget {
  const _ReceiptListItem({required this.receipt, required this.isDeleting});

  final Receipt receipt;
  final bool isDeleting;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        border: Border.all(color: const Color(0xFFD9DCE8)),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(receipt.merchant),
          const SizedBox(height: 6),
          Text(
            '${receipt.date} • ${receipt.category.label} • ${receipt.paymentMethod.label}',
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: Text(
                  _formatMoney(receipt.amount, receipt.currency),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              const SizedBox(width: 8),
              AppButton(
                label: 'Edit',
                expand: false,
                onPress: () {
                  ref.read(selectedReceiptIdProvider.notifier).set(receipt.id);
                  ref.read(extractReceiptProvider.notifier).clear();
                },
              ),
              const SizedBox(width: 8),
              AppButton(
                label: isDeleting ? 'Deleting...' : 'Delete',
                expand: false,
                onPress: isDeleting ? null : () => _confirmDelete(context, ref),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Future<void> _confirmDelete(BuildContext context, WidgetRef ref) async {
    final shouldDelete = await showDialog<bool>(
      context: context,
      builder: (dialogContext) {
        return AlertDialog(
          title: const Text('Delete receipt?'),
          content: Text(
            'This will permanently remove ${receipt.merchant} from your receipts.',
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(dialogContext).pop(false),
              child: const Text('Cancel'),
            ),
            FilledButton(
              onPressed: () => Navigator.of(dialogContext).pop(true),
              child: const Text('Delete'),
            ),
          ],
        );
      },
    );

    if (shouldDelete != true || !context.mounted) {
      return;
    }

    await ref.read(deleteReceiptProvider.notifier).remove(receipt.id);
  }
}

String _formatMoney(num amount, String currency) {
  return '$currency ${amount.toStringAsFixed(2)}';
}

String _formatDate(DateTime date) {
  final month = date.month.toString().padLeft(2, '0');
  final day = date.day.toString().padLeft(2, '0');
  return '${date.year}-$month-$day';
}
