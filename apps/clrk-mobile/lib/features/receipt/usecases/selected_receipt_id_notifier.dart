import 'package:riverpod_annotation/riverpod_annotation.dart';

part 'selected_receipt_id_notifier.g.dart';

@riverpod
class SelectedReceiptIdNotifier extends _$SelectedReceiptIdNotifier {
  @override
  String? build() => null;

  void set(String? id) => state = id;

  void clear() => state = null;
}
