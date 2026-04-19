// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'list_receipts_provider.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning

@ProviderFor(listReceipts)
final listReceiptsProvider = ListReceiptsProvider._();

final class ListReceiptsProvider
    extends
        $FunctionalProvider<
          AsyncValue<List<Receipt>>,
          List<Receipt>,
          FutureOr<List<Receipt>>
        >
    with $FutureModifier<List<Receipt>>, $FutureProvider<List<Receipt>> {
  ListReceiptsProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'listReceiptsProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$listReceiptsHash();

  @$internal
  @override
  $FutureProviderElement<List<Receipt>> $createElement(
    $ProviderPointer pointer,
  ) => $FutureProviderElement(pointer);

  @override
  FutureOr<List<Receipt>> create(Ref ref) {
    return listReceipts(ref);
  }
}

String _$listReceiptsHash() => r'3f825464c19179be7b3c5991f6775e6543ab97c3';
