import 'package:dio/dio.dart';

import '../domains/optimization_result.dart';

class RemoteOptimizerRepository {
  const RemoteOptimizerRepository(this._dio);

  final Dio _dio;

  Future<OptimizationResult> optimize({
    required String level,
    required String from,
    required String to,
  }) async {
    final response = await _dio.post<Map<String, dynamic>>(
      '/api/receipts/optimize',
      data: {'level': level, 'from': from, 'to': to},
    );

    return OptimizationResult.fromJson(
      response.data ?? const <String, dynamic>{},
    );
  }
}
