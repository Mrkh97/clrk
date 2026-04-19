// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'selected_receipt_id_notifier.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning

@ProviderFor(SelectedReceiptIdNotifier)
final selectedReceiptIdProvider = SelectedReceiptIdNotifierProvider._();

final class SelectedReceiptIdNotifierProvider
    extends $NotifierProvider<SelectedReceiptIdNotifier, String?> {
  SelectedReceiptIdNotifierProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'selectedReceiptIdProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$selectedReceiptIdNotifierHash();

  @$internal
  @override
  SelectedReceiptIdNotifier create() => SelectedReceiptIdNotifier();

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(String? value) {
    return $ProviderOverride(
      origin: this,
      providerOverride: $SyncValueProvider<String?>(value),
    );
  }
}

String _$selectedReceiptIdNotifierHash() =>
    r'dd2e39c72c3363271ff240754327935e76058d93';

abstract class _$SelectedReceiptIdNotifier extends $Notifier<String?> {
  String? build();
  @$mustCallSuper
  @override
  void runBuild() {
    final ref = this.ref as $Ref<String?, String?>;
    final element =
        ref.element
            as $ClassProviderElement<
              AnyNotifier<String?, String?>,
              String?,
              Object?,
              Object?
            >;
    element.handleCreate(ref, build);
  }
}
