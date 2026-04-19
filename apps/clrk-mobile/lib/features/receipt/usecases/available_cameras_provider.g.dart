// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'available_cameras_provider.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning

@ProviderFor(availableCameras)
final availableCamerasProvider = AvailableCamerasProvider._();

final class AvailableCamerasProvider
    extends
        $FunctionalProvider<
          AsyncValue<List<camera.CameraDescription>>,
          List<camera.CameraDescription>,
          FutureOr<List<camera.CameraDescription>>
        >
    with
        $FutureModifier<List<camera.CameraDescription>>,
        $FutureProvider<List<camera.CameraDescription>> {
  AvailableCamerasProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'availableCamerasProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$availableCamerasHash();

  @$internal
  @override
  $FutureProviderElement<List<camera.CameraDescription>> $createElement(
    $ProviderPointer pointer,
  ) => $FutureProviderElement(pointer);

  @override
  FutureOr<List<camera.CameraDescription>> create(Ref ref) {
    return availableCameras(ref);
  }
}

String _$availableCamerasHash() => r'c8cce4d426fd0ef8fddbe38f8a86b9f25b702bb1';
