import 'package:dio/dio.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';

import '../../../shared/auth/auth_session_signal.dart';
import '../../../shared/utils/dio_provider.dart';
import '../data/remote_auth_repository.dart';
import '../domains/auth_session.dart';

final remoteAuthRepositoryProvider = Provider<RemoteAuthRepository>((ref) {
  return RemoteAuthRepository(ref.watch(dioProvider));
});

final authControllerProvider =
    AsyncNotifierProvider<AuthController, AuthSession?>(AuthController.new);

class AuthController extends AsyncNotifier<AuthSession?> {
  @override
  Future<AuthSession?> build() {
    ref.watch(authSessionSignalProvider);
    return ref.read(remoteAuthRepositoryProvider).getSession();
  }

  Future<void> refreshSession() async {
    final repository = ref.read(remoteAuthRepositoryProvider);

    state = const AsyncLoading();
    state = await AsyncValue.guard(repository.getSession);
  }

  Future<void> signIn({required String email, required String password}) async {
    final repository = ref.read(remoteAuthRepositoryProvider);

    try {
      final session = await repository.signIn(email: email, password: password);
      state = AsyncData(session);
    } catch (error) {
      rethrow;
    }
  }

  Future<void> signUp({
    required String name,
    required String email,
    required String password,
  }) async {
    final repository = ref.read(remoteAuthRepositoryProvider);

    try {
      final session = await repository.signUp(
        name: name,
        email: email,
        password: password,
      );
      state = AsyncData(session);
    } catch (error) {
      rethrow;
    }
  }

  Future<void> signOut() async {
    final repository = ref.read(remoteAuthRepositoryProvider);

    await repository.signOut();
    state = const AsyncData(null);
  }
}

String authErrorMessage(Object error) {
  if (error is DioException) {
    final data = error.response?.data;

    if (data is Map<String, dynamic>) {
      final message = data['message'] ?? data['error'];

      if (message is String && message.isNotEmpty) {
        return message;
      }
    }

    return error.message ?? 'Something went wrong while contacting the server.';
  }

  return error.toString();
}
