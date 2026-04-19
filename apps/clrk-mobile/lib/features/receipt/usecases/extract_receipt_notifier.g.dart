// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'extract_receipt_notifier.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning

@ProviderFor(ExtractReceiptNotifier)
final extractReceiptProvider = ExtractReceiptNotifierProvider._();

final class ExtractReceiptNotifierProvider
    extends $AsyncNotifierProvider<ExtractReceiptNotifier, ExtractedReceipt?> {
  ExtractReceiptNotifierProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'extractReceiptProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$extractReceiptNotifierHash();

  @$internal
  @override
  ExtractReceiptNotifier create() => ExtractReceiptNotifier();
}

String _$extractReceiptNotifierHash() =>
    r'e8178792e8e1be2dbda1a8a4295a0bdbbbb3ec17';

abstract class _$ExtractReceiptNotifier
    extends $AsyncNotifier<ExtractedReceipt?> {
  FutureOr<ExtractedReceipt?> build();
  @$mustCallSuper
  @override
  void runBuild() {
    final ref =
        this.ref as $Ref<AsyncValue<ExtractedReceipt?>, ExtractedReceipt?>;
    final element =
        ref.element
            as $ClassProviderElement<
              AnyNotifier<AsyncValue<ExtractedReceipt?>, ExtractedReceipt?>,
              AsyncValue<ExtractedReceipt?>,
              Object?,
              Object?
            >;
    element.handleCreate(ref, build);
  }
}
