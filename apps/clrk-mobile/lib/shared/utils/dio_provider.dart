import 'dart:io';

import 'package:cookie_jar/cookie_jar.dart';
import 'package:dio/dio.dart';
import 'package:dio_cookie_manager/dio_cookie_manager.dart';
import 'package:flutter/foundation.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:talker/talker.dart';

import '../auth/auth_session_signal.dart';

final talkerProvider = Provider<Talker>((ref) {
  return Talker(settings: TalkerSettings(useConsoleLogs: true));
});

final cookieJarProvider = Provider<CookieJar>((ref) {
  if (kIsWeb) {
    return CookieJar();
  }

  final directory = Directory('${Directory.systemTemp.path}/clrk-mobile-cookies')
    ..createSync(recursive: true);

  return PersistCookieJar(storage: FileStorage(directory.path));
});

final dioProvider = Provider<Dio>((ref) {
  final talker = ref.watch(talkerProvider);
  final cookieJar = ref.watch(cookieJarProvider);

  final dio = Dio(
    BaseOptions(
      baseUrl: _resolveApiBaseUrl(),
      connectTimeout: const Duration(seconds: 20),
      receiveTimeout: const Duration(seconds: 20),
      sendTimeout: const Duration(seconds: 20),
      headers: const {HttpHeaders.acceptHeader: 'application/json'},
    ),
  );

  dio.interceptors.add(CookieManager(cookieJar));

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
        if (_shouldInvalidateSession(error)) {
          ref.read(authSessionSignalProvider.notifier).invalidate();
        }

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

bool _shouldInvalidateSession(DioException error) {
  if (error.response?.statusCode != 401) {
    return false;
  }

  final path = error.requestOptions.path;

  if (path.startsWith('/api/auth/')) {
    return false;
  }

  return true;
}
