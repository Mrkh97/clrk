// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'receipt_form_state_notifier.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning

@ProviderFor(ReceiptFormStateNotifier)
final receiptFormStateProvider = ReceiptFormStateNotifierProvider._();

final class ReceiptFormStateNotifierProvider
    extends $NotifierProvider<ReceiptFormStateNotifier, ReceiptFormState> {
  ReceiptFormStateNotifierProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'receiptFormStateProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$receiptFormStateNotifierHash();

  @$internal
  @override
  ReceiptFormStateNotifier create() => ReceiptFormStateNotifier();

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(ReceiptFormState value) {
    return $ProviderOverride(
      origin: this,
      providerOverride: $SyncValueProvider<ReceiptFormState>(value),
    );
  }
}

String _$receiptFormStateNotifierHash() =>
    r'b3fd2fe7d43d48f06f64335880cfccb67aa4a199';

abstract class _$ReceiptFormStateNotifier extends $Notifier<ReceiptFormState> {
  ReceiptFormState build();
  @$mustCallSuper
  @override
  void runBuild() {
    final ref = this.ref as $Ref<ReceiptFormState, ReceiptFormState>;
    final element =
        ref.element
            as $ClassProviderElement<
              AnyNotifier<ReceiptFormState, ReceiptFormState>,
              ReceiptFormState,
              Object?,
              Object?
            >;
    element.handleCreate(ref, build);
  }
}
