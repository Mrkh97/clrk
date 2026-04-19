import 'dart:async';

import 'package:riverpod_annotation/riverpod_annotation.dart';

import 'get_receipt_provider.dart';
import 'list_receipts_provider.dart';
import 'selected_receipt_id_notifier.dart';
import 'receipt_form_state_notifier.dart';
import 'remote_receipts_repository_provider.dart';

part 'delete_receipt_notifier.g.dart';

@riverpod
class DeleteReceiptNotifier extends _$DeleteReceiptNotifier {
  @override
  FutureOr<void> build() {}

  Future<void> remove(String receiptId) async {
    state = const AsyncLoading();

    state = await AsyncValue.guard(() async {
      await ref.read(remoteReceiptsRepositoryProvider).deleteReceipt(receiptId);
      ref.invalidate(listReceiptsProvider);

      if (ref.read(selectedReceiptIdProvider) == receiptId) {
        ref.read(selectedReceiptIdProvider.notifier).clear();
        ref.read(receiptFormStateProvider.notifier).reset();
        ref.invalidate(getReceiptProvider(receiptId));
      }
    });
  }
}
