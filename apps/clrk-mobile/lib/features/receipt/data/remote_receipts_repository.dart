import 'package:dio/dio.dart';

import '../domains/domains.dart';

class RemoteReceiptsRepository {
  const RemoteReceiptsRepository(this._dio);

  final Dio _dio;

  Future<List<Receipt>> listReceipts() async {
    final response = await _dio.get<Map<String, dynamic>>('/api/receipts');
    final payload = response.data ?? const <String, dynamic>{};
    final receipts = (payload['receipts'] as List<dynamic>? ?? const []);

    return receipts
        .map((receipt) => Receipt.fromJson(receipt as Map<String, dynamic>))
        .toList();
  }

  Future<Receipt> getReceipt(String id) async {
    final response = await _dio.get<Map<String, dynamic>>('/api/receipts/$id');
    final payload = response.data ?? const <String, dynamic>{};

    return Receipt.fromJson(payload['receipt'] as Map<String, dynamic>);
  }

  Future<ReceiptExtractionResponse> extractReceipt(String filePath) async {
    final formData = FormData.fromMap({
      'file': await MultipartFile.fromFile(filePath),
    });

    final response = await _dio.post<Map<String, dynamic>>(
      '/api/receipts/extract',
      data: formData,
    );

    return ReceiptExtractionResponse.fromJson(
      response.data ?? const <String, dynamic>{},
    );
  }

  Future<Receipt> createReceipt(ReceiptFormInput input) async {
    final response = await _dio.post<Map<String, dynamic>>(
      '/api/receipts',
      data: input.toJson(),
    );

    return Receipt.fromJson(
      (response.data ?? const <String, dynamic>{})['receipt']
          as Map<String, dynamic>,
    );
  }

  Future<Receipt> updateReceipt(String id, ReceiptFormInput input) async {
    final response = await _dio.put<Map<String, dynamic>>(
      '/api/receipts/$id',
      data: input.toJson(),
    );

    return Receipt.fromJson(
      (response.data ?? const <String, dynamic>{})['receipt']
          as Map<String, dynamic>,
    );
  }

  Future<void> deleteReceipt(String id) async {
    await _dio.delete<void>('/api/receipts/$id');
  }
}
