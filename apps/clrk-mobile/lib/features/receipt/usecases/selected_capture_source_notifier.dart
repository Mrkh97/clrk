import 'package:riverpod_annotation/riverpod_annotation.dart';

part 'selected_capture_source_notifier.g.dart';

@riverpod
class SelectedCaptureSourceNotifier extends _$SelectedCaptureSourceNotifier {
  @override
  String build() => 'Waiting for capture';

  void set(String source) => state = source;

  void reset() => state = 'Waiting for capture';
}
