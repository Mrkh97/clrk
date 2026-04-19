import 'package:flutter/widgets.dart';

import '../../../../shared/components/app_section_card.dart';
import '../../domains/domains.dart';

class ExtractedReceiptSummary extends StatelessWidget {
  const ExtractedReceiptSummary({required this.receipt, super.key});

  final ExtractedReceipt receipt;

  @override
  Widget build(BuildContext context) {
    final currency = receipt.currency ?? 'USD';
    final previewItems = receipt.items.take(3).toList();

    return AppSectionCard(
      title: 'Extracted Summary',
      subtitle: 'Review the AI-assisted details before saving.',
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Wrap(
            spacing: 12,
            runSpacing: 12,
            children: [
              _SummaryBlock(
                label: 'Merchant',
                value: receipt.merchant ?? 'Unknown',
              ),
              _SummaryBlock(
                label: 'Total',
                value: _formatMoney(receipt.total, currency),
              ),
              _SummaryBlock(
                label: 'Payment',
                value: receipt.paymentMethod?.label ?? 'Needs review',
              ),
              _SummaryBlock(
                label: 'Confidence',
                value: _formatConfidence(receipt.confidence),
              ),
            ],
          ),
          if (previewItems.isNotEmpty) ...[
            const SizedBox(height: 16),
            const Text('Line items'),
            const SizedBox(height: 8),
            for (final item in previewItems)
              Padding(
                padding: const EdgeInsets.only(bottom: 8),
                child: Row(
                  children: [
                    Expanded(child: Text(item.name)),
                    Text('Qty ${item.quantity ?? 1}'),
                    const SizedBox(width: 12),
                    Text(
                      _formatMoney(item.totalPrice ?? item.unitPrice, currency),
                    ),
                  ],
                ),
              ),
          ],
          if ((receipt.rawText ?? '').isNotEmpty) ...[
            const SizedBox(height: 16),
            const Text('Raw text'),
            const SizedBox(height: 8),
            Text(
              receipt.rawText!,
              maxLines: 4,
              overflow: TextOverflow.ellipsis,
            ),
          ],
        ],
      ),
    );
  }
}

class _SummaryBlock extends StatelessWidget {
  const _SummaryBlock({required this.label, required this.value});

  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
      decoration: BoxDecoration(
        border: Border.all(color: const Color(0xFFD9DCE8)),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [Text(label), const SizedBox(height: 4), Text(value)],
      ),
    );
  }
}

String _formatMoney(num? amount, String currency) {
  if (amount == null) {
    return '—';
  }

  return '$currency ${amount.toStringAsFixed(2)}';
}

String _formatConfidence(double? confidence) {
  if (confidence == null) {
    return '—';
  }

  return '${(confidence * 100).round()}%';
}
