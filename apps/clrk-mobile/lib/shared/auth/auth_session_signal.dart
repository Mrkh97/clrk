import 'package:hooks_riverpod/hooks_riverpod.dart';

final authSessionSignalProvider =
    NotifierProvider<AuthSessionSignalNotifier, int>(
      AuthSessionSignalNotifier.new,
    );

class AuthSessionSignalNotifier extends Notifier<int> {
  @override
  int build() => 0;

  void invalidate() {
    state++;
  }
}
