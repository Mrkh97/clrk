import 'package:dio/dio.dart';

import '../domains/auth_session.dart';

class RemoteAuthRepository {
  const RemoteAuthRepository(this._dio);

  final Dio _dio;

  Future<AuthSession?> getSession() async {
    try {
      final response = await _dio.get<Map<String, dynamic>>(
        '/api/auth/get-session',
      );
      final payload = response.data ?? const <String, dynamic>{};

      if (payload['user'] is! Map<String, dynamic>) {
        return null;
      }

      return AuthSession.fromJson(payload);
    } on DioException catch (error) {
      if (error.response?.statusCode == 401) {
        return null;
      }

      rethrow;
    }
  }

  Future<AuthSession> signIn({
    required String email,
    required String password,
  }) async {
    await _dio.post<void>(
      '/api/auth/sign-in/email',
      data: {'email': email, 'password': password, 'rememberMe': true},
    );

    final session = await getSession();

    if (session == null) {
      throw StateError('Signed in, but no session was returned.');
    }

    return session;
  }

  Future<AuthSession> signUp({
    required String name,
    required String email,
    required String password,
  }) async {
    await _dio.post<void>(
      '/api/auth/sign-up/email',
      data: {'name': name, 'email': email, 'password': password},
    );

    final session = await getSession();

    if (session == null) {
      throw StateError('Registered, but no session was returned.');
    }

    return session;
  }

  Future<void> signOut() async {
    await _dio.post<void>('/api/auth/sign-out');
  }
}
