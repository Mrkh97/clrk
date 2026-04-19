// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'get_receipt_provider.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning

@ProviderFor(getReceipt)
final getReceiptProvider = GetReceiptFamily._();

final class GetReceiptProvider
    extends
        $FunctionalProvider<AsyncValue<Receipt?>, Receipt?, FutureOr<Receipt?>>
    with $FutureModifier<Receipt?>, $FutureProvider<Receipt?> {
  GetReceiptProvider._({
    required GetReceiptFamily super.from,
    required String? super.argument,
  }) : super(
         retry: null,
         name: r'getReceiptProvider',
         isAutoDispose: true,
         dependencies: null,
         $allTransitiveDependencies: null,
       );

  @override
  String debugGetCreateSourceHash() => _$getReceiptHash();

  @override
  String toString() {
    return r'getReceiptProvider'
        ''
        '($argument)';
  }

  @$internal
  @override
  $FutureProviderElement<Receipt?> $createElement($ProviderPointer pointer) =>
      $FutureProviderElement(pointer);

  @override
  FutureOr<Receipt?> create(Ref ref) {
    final argument = this.argument as String?;
    return getReceipt(ref, argument);
  }

  @override
  bool operator ==(Object other) {
    return other is GetReceiptProvider && other.argument == argument;
  }

  @override
  int get hashCode {
    return argument.hashCode;
  }
}

String _$getReceiptHash() => r'736d5054c431d2231e86fc9343aa70240db0a3a9';

final class GetReceiptFamily extends $Family
    with $FunctionalFamilyOverride<FutureOr<Receipt?>, String?> {
  GetReceiptFamily._()
    : super(
        retry: null,
        name: r'getReceiptProvider',
        dependencies: null,
        $allTransitiveDependencies: null,
        isAutoDispose: true,
      );

  GetReceiptProvider call(String? receiptId) =>
      GetReceiptProvider._(argument: receiptId, from: this);

  @override
  String toString() => r'getReceiptProvider';
}
