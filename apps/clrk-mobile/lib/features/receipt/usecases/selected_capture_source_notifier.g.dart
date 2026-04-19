// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'selected_capture_source_notifier.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning

@ProviderFor(SelectedCaptureSourceNotifier)
final selectedCaptureSourceProvider = SelectedCaptureSourceNotifierProvider._();

final class SelectedCaptureSourceNotifierProvider
    extends $NotifierProvider<SelectedCaptureSourceNotifier, String> {
  SelectedCaptureSourceNotifierProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'selectedCaptureSourceProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$selectedCaptureSourceNotifierHash();

  @$internal
  @override
  SelectedCaptureSourceNotifier create() => SelectedCaptureSourceNotifier();

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(String value) {
    return $ProviderOverride(
      origin: this,
      providerOverride: $SyncValueProvider<String>(value),
    );
  }
}

String _$selectedCaptureSourceNotifierHash() =>
    r'05039dea54babda0425d5092bfbdac25baa09e25';

abstract class _$SelectedCaptureSourceNotifier extends $Notifier<String> {
  String build();
  @$mustCallSuper
  @override
  void runBuild() {
    final ref = this.ref as $Ref<String, String>;
    final element =
        ref.element
            as $ClassProviderElement<
              AnyNotifier<String, String>,
              String,
              Object?,
              Object?
            >;
    element.handleCreate(ref, build);
  }
}
