import 'dart:async';

import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../domains/domains.dart';
import 'captured_receipt_path_notifier.dart';
import 'receipt_form_state_notifier.dart';
import 'remote_receipts_repository_provider.dart';
import 'selected_capture_source_notifier.dart';
import 'selected_receipt_id_notifier.dart';

part 'extract_receipt_notifier.g.dart';

@riverpod
class ExtractReceiptNotifier extends _$ExtractReceiptNotifier {
  @override
  FutureOr<ExtractedReceipt?> build() => null;

  Future<void> extract({
    required String filePath,
    required String sourceLabel,
  }) async {
    state = const AsyncLoading();

    final repository = ref.read(remoteReceiptsRepositoryProvider);
    ref.read(capturedReceiptPathProvider.notifier).set(filePath);
    ref.read(selectedCaptureSourceProvider.notifier).set(sourceLabel);
    ref.read(selectedReceiptIdProvider.notifier).clear();

    state = await AsyncValue.guard(() async {
      final response = await repository.extractReceipt(filePath);
      ref
          .read(receiptFormStateProvider.notifier)
          .applyExtractedReceipt(response.receipt);
      return response.receipt;
    });
  }

  void clear() {
    state = const AsyncData(null);
  }
}
