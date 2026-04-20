import 'package:clrk_mobile/features/receipt/domains/extracted_receipt.dart';
import 'package:clrk_mobile/features/receipt/domains/receipt.dart';
import 'package:clrk_mobile/features/receipt/presentation/components/extracted_receipt_summary.dart';
import 'package:clrk_mobile/features/receipt/presentation/components/receipt_capture_actions_card.dart';
import 'package:clrk_mobile/features/receipt/presentation/components/receipt_details_form.dart';
import 'package:clrk_mobile/features/receipt/presentation/components/receipts_list.dart';
import 'package:clrk_mobile/features/receipt/usecases/delete_receipt_notifier.dart';
import 'package:clrk_mobile/features/receipt/usecases/extract_receipt_notifier.dart';
import 'package:clrk_mobile/features/receipt/usecases/get_receipt_provider.dart';
import 'package:clrk_mobile/features/receipt/usecases/receipt_form_state_notifier.dart';
import 'package:clrk_mobile/features/receipt/usecases/save_receipt_notifier.dart';
import 'package:clrk_mobile/features/receipt/usecases/selected_receipt_id_notifier.dart';
import 'package:clrk_mobile/shared/components/app_page_scaffold.dart';
import 'package:clrk_mobile/shared/extensions/build_context_extensions.dart';
import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';

class ReceiptScreen extends ConsumerWidget {
  const ReceiptScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final selectedReceiptId = ref.watch(selectedReceiptIdProvider);
    final extractedReceiptState = ref.watch(extractReceiptProvider);
    final extractedReceipt = extractedReceiptState.asData?.value;

    ref.listen<AsyncValue<Receipt?>>(getReceiptProvider(selectedReceiptId), (
      previous,
      next,
    ) {
      next.whenOrNull(
        data: (receipt) {
          if (receipt != null) {
            ref
                .read(receiptFormStateProvider.notifier)
                .populateFromReceipt(receipt);
          }
        },
        error: (error, _) {
          context.showErrorToast(
            'Could not load receipt',
            description: '$error',
          );
        },
      );
    });

    ref.listen<AsyncValue<ExtractedReceipt?>>(extractReceiptProvider, (
      previous,
      next,
    ) {
      next.whenOrNull(
        data: (receipt) {
          if (receipt != null) {
            ref
                .read(receiptFormStateProvider.notifier)
                .populateFromExtractedReceipt(receipt);
            context.showInfoToast(
              'Receipt scanned',
              description: 'Review the extracted details below.',
            );
          }
        },
        error: (error, _) {
          context.showErrorToast(
            'Receipt extraction failed',
            description: '$error',
          );
        },
      );
    });

    ref.listen<AsyncValue<void>>(saveReceiptProvider, (previous, next) {
      next.whenOrNull(
        data: (_) {
          if (previous?.isLoading == true) {
            context.showInfoToast('Receipt saved');
          }
        },
        error: (error, _) {
          context.showErrorToast(
            'Could not save receipt',
            description: '$error',
          );
        },
      );
    });

    ref.listen<AsyncValue<void>>(deleteReceiptProvider, (previous, next) {
      next.whenOrNull(
        data: (_) {
          if (previous?.isLoading == true) {
            context.showInfoToast('Receipt deleted');
          }
        },
        error: (error, _) {
          context.showErrorToast(
            'Could not delete receipt',
            description: '$error',
          );
        },
      );
    });

    return AppPageScaffold(
      title: 'Scan & Manage Receipts',
      subtitle:
          'Capture or import a receipt, preview it, then review the extracted details before saving.',
      child: ListView(
        children: [
          const ReceiptCaptureActionsCard(),
          const SizedBox(height: 16),
          if (selectedReceiptId == null && extractedReceipt != null) ...[
            ExtractedReceiptSummary(receipt: extractedReceipt),
            const SizedBox(height: 16),
          ],
          const ReceiptDetailsForm(),
          const SizedBox(height: 16),
          const ReceiptsList(),
        ],
      ),
    );
  }
}
