import 'dart:io';

import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:talker/talker.dart';

final talkerProvider = Provider<Talker>((ref) {
  return Talker(settings: TalkerSettings(useConsoleLogs: true));
});

final dioProvider = Provider<Dio>((ref) {
  final talker = ref.watch(talkerProvider);

  final dio = Dio(
    BaseOptions(
      baseUrl: _resolveApiBaseUrl(),
      connectTimeout: const Duration(seconds: 20),
      receiveTimeout: const Duration(seconds: 20),
      sendTimeout: const Duration(seconds: 20),
      headers: const {HttpHeaders.acceptHeader: 'application/json'},
    ),
  );

  dio.interceptors.add(
    InterceptorsWrapper(
      onRequest: (options, handler) {
        talker.info('${options.method} ${options.uri}');
        handler.next(options);
      },
      onResponse: (response, handler) {
        talker.info('${response.statusCode} ${response.requestOptions.uri}');
        handler.next(response);
      },
      onError: (error, handler) {
        talker.error(
          '${error.requestOptions.method} ${error.requestOptions.uri}',
          error,
          error.stackTrace,
        );
        handler.next(error);
      },
    ),
  );

  return dio;
});

String _resolveApiBaseUrl() {
  const configured = String.fromEnvironment('API_BASE_URL');

  if (configured.isNotEmpty) {
    return configured;
  }

  if (kIsWeb) {
    return 'http://localhost:3001';
  }

  if (Platform.isAndroid) {
    return 'http://10.0.2.2:3001';
  }

  return 'http://localhost:3001';
}
