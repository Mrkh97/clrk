// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'remote_receipts_repository_provider.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning

@ProviderFor(remoteReceiptsRepository)
final remoteReceiptsRepositoryProvider = RemoteReceiptsRepositoryProvider._();

final class RemoteReceiptsRepositoryProvider
    extends
        $FunctionalProvider<
          RemoteReceiptsRepository,
          RemoteReceiptsRepository,
          RemoteReceiptsRepository
        >
    with $Provider<RemoteReceiptsRepository> {
  RemoteReceiptsRepositoryProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'remoteReceiptsRepositoryProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$remoteReceiptsRepositoryHash();

  @$internal
  @override
  $ProviderElement<RemoteReceiptsRepository> $createElement(
    $ProviderPointer pointer,
  ) => $ProviderElement(pointer);

  @override
  RemoteReceiptsRepository create(Ref ref) {
    return remoteReceiptsRepository(ref);
  }

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(RemoteReceiptsRepository value) {
    return $ProviderOverride(
      origin: this,
      providerOverride: $SyncValueProvider<RemoteReceiptsRepository>(value),
    );
  }
}

String _$remoteReceiptsRepositoryHash() =>
    r'0a362a5c9f8eac44626a44e80db6bd33b427c3ce';
