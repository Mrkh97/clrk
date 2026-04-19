import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../domains/domains.dart';
import 'remote_receipts_repository_provider.dart';

part 'list_receipts_provider.g.dart';

@riverpod
Future<List<Receipt>> listReceipts(Ref ref) async {
  return ref.watch(remoteReceiptsRepositoryProvider).listReceipts();
}
