import 'package:dio/dio.dart';

import '../domains/dashboard_data.dart';

class RemoteDashboardRepository {
  const RemoteDashboardRepository(this._dio);

  final Dio _dio;

  Future<DashboardData> fetchDashboard(DashboardTimeFilter filter) async {
    final response = await _dio.get<Map<String, dynamic>>(
      '/api/dashboard',
      queryParameters: {'timeFilter': filter.apiValue},
    );

    return DashboardData.fromJson(response.data ?? const <String, dynamic>{});
  }
}
