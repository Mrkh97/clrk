import 'package:camera/camera.dart' as camera;
import 'package:riverpod_annotation/riverpod_annotation.dart';

part 'available_cameras_provider.g.dart';

@riverpod
Future<List<camera.CameraDescription>> availableCameras(Ref ref) async {
  try {
    return await camera.availableCameras();
  } on camera.CameraException {
    return const [];
  }
}
