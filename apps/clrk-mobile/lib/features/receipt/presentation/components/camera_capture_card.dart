import 'dart:io';

import 'package:camera/camera.dart';
import 'package:flutter/widgets.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:image_picker/image_picker.dart';

import '../../../../shared/components/app_button.dart';
import '../../../../shared/components/app_section_card.dart';
import '../../usecases/camera_controller_provider.dart';
import '../../usecases/captured_receipt_path_notifier.dart';
import '../../usecases/extract_receipt_notifier.dart';
import '../../usecases/selected_capture_source_notifier.dart';

class CameraCaptureCard extends ConsumerWidget {
  const CameraCaptureCard({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final controllerAsync = ref.watch(cameraControllerProvider);
    final extractState = ref.watch(extractReceiptProvider);
    final source = ref.watch(selectedCaptureSourceProvider);
    final filePath = ref.watch(capturedReceiptPathProvider);
    final imagePicker = ImagePicker();

    Future<void> capture() async {
      final controller = await ref.read(cameraControllerProvider.future);

      if (controller == null) {
        return;
      }

      final image = await controller.takePicture();
      await ref
          .read(extractReceiptProvider.notifier)
          .extract(filePath: image.path, sourceLabel: 'Live camera');
    }

    Future<void> pickFromGallery() async {
      final image = await imagePicker.pickImage(source: ImageSource.gallery);
      if (image == null) {
        return;
      }

      await ref
          .read(extractReceiptProvider.notifier)
          .extract(filePath: image.path, sourceLabel: 'Gallery import');
    }

    return AppSectionCard(
      title: 'Capture Receipt',
      subtitle:
          'Open the camera first, then fall back to gallery import if needed.',
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(20),
            child: AspectRatio(
              aspectRatio: 3 / 4,
              child: controllerAsync.when(
                data: (controller) {
                  if (controller == null) {
                    return const _CameraPlaceholder(
                      message:
                          'No camera available. You can still import from gallery.',
                    );
                  }

                  return CameraPreview(controller);
                },
                error: (_, _) => const _CameraPlaceholder(
                  message:
                      'Camera failed to initialize. Use gallery import instead.',
                ),
                loading: () =>
                    const _CameraPlaceholder(message: 'Preparing camera...'),
              ),
            ),
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: AppButton(
                  label: extractState.isLoading
                      ? 'Scanning...'
                      : 'Capture receipt',
                  onPress: extractState.isLoading ? null : capture,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: AppButton(
                  label: 'Gallery',
                  onPress: extractState.isLoading ? null : pickFromGallery,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text('Source: $source'),
          if (filePath != null) ...[
            const SizedBox(height: 12),
            ClipRRect(
              borderRadius: BorderRadius.circular(16),
              child: Image.file(
                File(filePath),
                height: 180,
                width: double.infinity,
                fit: BoxFit.cover,
              ),
            ),
          ],
        ],
      ),
    );
  }
}

class _CameraPlaceholder extends StatelessWidget {
  const _CameraPlaceholder({required this.message});

  final String message;

  @override
  Widget build(BuildContext context) {
    return ColoredBox(
      color: const Color(0xFF101828),
      child: Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Text(
            message,
            textAlign: TextAlign.center,
            style: const TextStyle(color: Color(0xFFE5E7EB)),
          ),
        ),
      ),
    );
  }
}
