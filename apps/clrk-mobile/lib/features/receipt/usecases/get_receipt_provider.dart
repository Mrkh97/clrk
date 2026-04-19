import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../domains/domains.dart';
import 'remote_receipts_repository_provider.dart';

part 'get_receipt_provider.g.dart';

@riverpod
Future<Receipt?> getReceipt(Ref ref, String? receiptId) async {
  if (receiptId == null) {
    return null;
  }

  return ref.watch(remoteReceiptsRepositoryProvider).getReceipt(receiptId);
}
