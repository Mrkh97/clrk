// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'captured_receipt_path_notifier.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning

@ProviderFor(CapturedReceiptPathNotifier)
final capturedReceiptPathProvider = CapturedReceiptPathNotifierProvider._();

final class CapturedReceiptPathNotifierProvider
    extends $NotifierProvider<CapturedReceiptPathNotifier, String?> {
  CapturedReceiptPathNotifierProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'capturedReceiptPathProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$capturedReceiptPathNotifierHash();

  @$internal
  @override
  CapturedReceiptPathNotifier create() => CapturedReceiptPathNotifier();

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(String? value) {
    return $ProviderOverride(
      origin: this,
      providerOverride: $SyncValueProvider<String?>(value),
    );
  }
}

String _$capturedReceiptPathNotifierHash() =>
    r'fc76423ff3a23fcfdf7e3a396e63bf89deba7e11';

abstract class _$CapturedReceiptPathNotifier extends $Notifier<String?> {
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
