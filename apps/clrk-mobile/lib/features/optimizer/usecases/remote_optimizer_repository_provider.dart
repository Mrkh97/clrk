import 'package:hooks_riverpod/hooks_riverpod.dart';

import '../../../shared/utils/dio_provider.dart';
import '../data/remote_optimizer_repository.dart';

final remoteOptimizerRepositoryProvider = Provider<RemoteOptimizerRepository>((
  ref,
) {
  return RemoteOptimizerRepository(ref.watch(dioProvider));
});
