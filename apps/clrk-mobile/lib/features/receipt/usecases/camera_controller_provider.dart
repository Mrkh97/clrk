import 'package:camera/camera.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

import 'available_cameras_provider.dart';

part 'camera_controller_provider.g.dart';

@riverpod
Future<CameraController?> cameraController(Ref ref) async {
  final cameras = await ref.watch(availableCamerasProvider.future);

  if (cameras.isEmpty) {
    return null;
  }

  final selectedCamera = cameras.firstWhere(
    (camera) => camera.lensDirection == CameraLensDirection.back,
    orElse: () => cameras.first,
  );

  final controller = CameraController(
    selectedCamera,
    ResolutionPreset.high,
    enableAudio: false,
    imageFormatGroup: ImageFormatGroup.jpeg,
  );

  ref.onDispose(controller.dispose);
  await controller.initialize();
  return controller;
}
