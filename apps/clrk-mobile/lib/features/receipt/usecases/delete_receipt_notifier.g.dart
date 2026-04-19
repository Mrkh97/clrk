// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'delete_receipt_notifier.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning

@ProviderFor(DeleteReceiptNotifier)
final deleteReceiptProvider = DeleteReceiptNotifierProvider._();

final class DeleteReceiptNotifierProvider
    extends $AsyncNotifierProvider<DeleteReceiptNotifier, void> {
  DeleteReceiptNotifierProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'deleteReceiptProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$deleteReceiptNotifierHash();

  @$internal
  @override
  DeleteReceiptNotifier create() => DeleteReceiptNotifier();
}

String _$deleteReceiptNotifierHash() =>
    r'0a1ee1640ca9a849a99778215dac04cce3d23c0f';

abstract class _$DeleteReceiptNotifier extends $AsyncNotifier<void> {
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
