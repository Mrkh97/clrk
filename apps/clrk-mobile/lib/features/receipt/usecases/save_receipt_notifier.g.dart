// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'save_receipt_notifier.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning

@ProviderFor(SaveReceiptNotifier)
final saveReceiptProvider = SaveReceiptNotifierProvider._();

final class SaveReceiptNotifierProvider
    extends $AsyncNotifierProvider<SaveReceiptNotifier, void> {
  SaveReceiptNotifierProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'saveReceiptProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$saveReceiptNotifierHash();

  @$internal
  @override
  SaveReceiptNotifier create() => SaveReceiptNotifier();
}

String _$saveReceiptNotifierHash() =>
    r'51befdb482fc6fe69f01b3bccbe67ee6257078a9';

abstract class _$SaveReceiptNotifier extends $AsyncNotifier<void> {
  FutureOr<void> build();
  @$mustCallSuper
  @override
  void runBuild() {
    final ref = this.ref as $Ref<AsyncValue<void>, void>;
    final element =
        ref.element
            as $ClassProviderElement<
              AnyNotifier<AsyncValue<void>, void>,
              AsyncValue<void>,
              Object?,
              Object?
            >;
    element.handleCreate(ref, build);
  }
}
