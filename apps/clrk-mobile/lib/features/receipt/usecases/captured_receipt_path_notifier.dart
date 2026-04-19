import 'package:riverpod_annotation/riverpod_annotation.dart';

part 'captured_receipt_path_notifier.g.dart';

@riverpod
class CapturedReceiptPathNotifier extends _$CapturedReceiptPathNotifier {
  @override
  String? build() => null;

  void set(String? path) => state = path;

  void clear() => state = null;
}
