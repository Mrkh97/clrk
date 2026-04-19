// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'camera_controller_provider.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning

@ProviderFor(cameraController)
final cameraControllerProvider = CameraControllerProvider._();

final class CameraControllerProvider
    extends
        $FunctionalProvider<
          AsyncValue<CameraController?>,
          CameraController?,
          FutureOr<CameraController?>
        >
    with
        $FutureModifier<CameraController?>,
        $FutureProvider<CameraController?> {
  CameraControllerProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'cameraControllerProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$cameraControllerHash();

  @$internal
  @override
  $FutureProviderElement<CameraController?> $createElement(
    $ProviderPointer pointer,
  ) => $FutureProviderElement(pointer);

  @override
  FutureOr<CameraController?> create(Ref ref) {
    return cameraController(ref);
  }
}

String _$cameraControllerHash() => r'f4851f3aeb08fe2a3ed8ce73e8073134948e89c5';
