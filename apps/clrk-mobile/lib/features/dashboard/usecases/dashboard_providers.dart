import 'package:hooks_riverpod/hooks_riverpod.dart';

import '../../../shared/utils/dio_provider.dart';
import '../data/remote_dashboard_repository.dart';
import '../domains/dashboard_data.dart';

final dashboardTimeFilterProvider =
    NotifierProvider<DashboardTimeFilterNotifier, DashboardTimeFilter>(
      DashboardTimeFilterNotifier.new,
    );

class DashboardTimeFilterNotifier extends Notifier<DashboardTimeFilter> {
  @override
  DashboardTimeFilter build() => DashboardTimeFilter.thirtyDays;

  void setFilter(DashboardTimeFilter filter) {
    state = filter;
  }
}

final remoteDashboardRepositoryProvider = Provider<RemoteDashboardRepository>((
  ref,
) {
  return RemoteDashboardRepository(ref.watch(dioProvider));
});

final dashboardDataProvider = FutureProvider<DashboardData>((ref) async {
  final filter = ref.watch(dashboardTimeFilterProvider);
  return ref.watch(remoteDashboardRepositoryProvider).fetchDashboard(filter);
});
