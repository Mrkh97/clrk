import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';

import '../../../../shared/components/app_button.dart';
import '../../../../shared/components/app_section_card.dart';
import '../../domains/domains.dart';
import '../../usecases/delete_receipt_notifier.dart';
import '../../usecases/extract_receipt_notifier.dart';
import '../../usecases/list_receipts_provider.dart';
import '../../usecases/selected_receipt_id_notifier.dart';

class ReceiptsList extends ConsumerWidget {
  const ReceiptsList({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final receipts = ref.watch(listReceiptsProvider);
    final deleteState = ref.watch(deleteReceiptProvider);

    return AppSectionCard(
      title: 'Recent Receipts',
      subtitle: 'Open an existing receipt to edit it or remove it.',
      child: receipts.when(
        data: (items) {
          if (items.isEmpty) {
            return const Text(
              'No receipts yet. Capture or import one to get started.',
            );
          }

          return Column(
            children: [
              for (final receipt in items) ...[
                _ReceiptListItem(
                  receipt: receipt,
                  isDeleting: deleteState.isLoading,
                ),
                if (receipt != items.last) const SizedBox(height: 12),
              ],
            ],
          );
        },
        error: (error, _) => Text('Could not load receipts: $error'),
        loading: () => const Center(child: CircularProgressIndicator()),
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
                child: Text(_formatMoney(receipt.amount, receipt.currency)),
              ),
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
                onPress: isDeleting
                    ? null
                    : () => ref
                          .read(deleteReceiptProvider.notifier)
                          .remove(receipt.id),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

String _formatMoney(num amount, String currency) {
  return '$currency ${amount.toStringAsFixed(2)}';
}
