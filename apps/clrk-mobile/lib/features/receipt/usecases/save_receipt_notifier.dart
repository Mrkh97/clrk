import 'dart:async';

import 'package:riverpod_annotation/riverpod_annotation.dart';

import 'extract_receipt_notifier.dart';
import 'get_receipt_provider.dart';
import 'list_receipts_provider.dart';
import 'receipt_form_state_notifier.dart';
import 'remote_receipts_repository_provider.dart';
import 'selected_capture_source_notifier.dart';
import 'selected_receipt_id_notifier.dart';
import 'captured_receipt_path_notifier.dart';

part 'save_receipt_notifier.g.dart';

@riverpod
class SaveReceiptNotifier extends _$SaveReceiptNotifier {
  @override
  FutureOr<void> build() {}

  Future<void> submit() async {
    state = const AsyncLoading();

    state = await AsyncValue.guard(() async {
      final repository = ref.read(remoteReceiptsRepositoryProvider);
      final selectedReceiptId = ref.read(selectedReceiptIdProvider);
      final extractedReceipt = ref.read(extractReceiptProvider).asData?.value;
      final input = ref
          .read(receiptFormStateProvider)
          .toInput(
            aiExtracted: selectedReceiptId == null && extractedReceipt != null,
          );

      if (selectedReceiptId == null) {
        await repository.createReceipt(input);
      } else {
        await repository.updateReceipt(selectedReceiptId, input);
        ref.invalidate(getReceiptProvider(selectedReceiptId));
      }

      ref.invalidate(listReceiptsProvider);
      ref.read(selectedReceiptIdProvider.notifier).clear();
      ref.read(capturedReceiptPathProvider.notifier).clear();
      ref.read(selectedCaptureSourceProvider.notifier).reset();
      ref.read(extractReceiptProvider.notifier).clear();
      ref.read(receiptFormStateProvider.notifier).reset();
    });
  }
}
