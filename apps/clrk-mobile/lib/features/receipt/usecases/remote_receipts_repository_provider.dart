import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../../../shared/utils/dio_provider.dart';
import '../data/remote_receipts_repository.dart';

part 'remote_receipts_repository_provider.g.dart';

@riverpod
RemoteReceiptsRepository remoteReceiptsRepository(Ref ref) {
  return RemoteReceiptsRepository(ref.watch(dioProvider));
}
