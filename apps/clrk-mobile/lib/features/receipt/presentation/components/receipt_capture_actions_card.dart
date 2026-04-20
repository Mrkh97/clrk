import 'dart:io';

import 'package:flutter/material.dart';
import 'package:forui/forui.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:image_picker/image_picker.dart';

import '../../../../shared/components/app_button.dart';
import '../../../../shared/components/app_section_card.dart';
import '../../../../shared/theme/app_theme.dart';
import '../../usecases/captured_receipt_path_notifier.dart';
import '../../usecases/extract_receipt_notifier.dart';
import '../../usecases/selected_capture_source_notifier.dart';
import 'receipt_capture_preview_screen.dart';

class ReceiptCaptureActionsCard extends ConsumerWidget {
  const ReceiptCaptureActionsCard({super.key});

  Future<void> _selectImage(BuildContext context, ImageSource source) async {
    final picker = ImagePicker();
    final image = await picker.pickImage(source: source, imageQuality: 90);

    if (image == null || !context.mounted) {
      return;
    }

    await Navigator.of(context).push<void>(
      MaterialPageRoute<void>(
        builder: (_) => ReceiptCapturePreviewScreen(
          initialFilePath: image.path,
          initialSource: source,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final extractState = ref.watch(extractReceiptProvider);
    final selectedSource = ref.watch(selectedCaptureSourceProvider);
    final capturedPath = ref.watch(capturedReceiptPathProvider);
    final isScanning = extractState.isLoading;

    return AppSectionCard(
      title: 'Import Receipt',
      subtitle:
          'Match the web flow: choose a photo, preview it, then scan and review the extracted form.',
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(
                child: AppButton(
                  label: 'Open Camera',
                  onPress: isScanning
                      ? null
                      : () => _selectImage(context, ImageSource.camera),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: AppButton(
                  label: 'Open Gallery',
                  variant: FButtonVariant.outline,
                  onPress: isScanning
                      ? null
                      : () => _selectImage(context, ImageSource.gallery),
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(14),
            decoration: AppTheme.softPanel(radius: BorderRadius.circular(20)),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Tips', style: AppTheme.monoLabel(context)),
                const SizedBox(height: 8),
                Text(
                  'Keep the full receipt visible, use good light, and confirm the preview before scanning.',
                  style: Theme.of(context).textTheme.bodySmall,
                ),
              ],
            ),
          ),
          if (capturedPath != null) ...[
            const SizedBox(height: 14),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(14),
              decoration: AppTheme.softPanel(radius: BorderRadius.circular(20)),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Latest Scan',
                    style: AppTheme.monoLabel(context, color: AppColors.brand),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    selectedSource,
                    style: Theme.of(context).textTheme.bodySmall,
                  ),
                  const SizedBox(height: 12),
                  ClipRRect(
                    borderRadius: BorderRadius.circular(16),
                    child: Image.file(
                      File(capturedPath),
                      height: 180,
                      width: double.infinity,
                      fit: BoxFit.cover,
                      errorBuilder: (_, _, _) => Container(
                        height: 180,
                        color: AppColors.surfaceSoft,
                        alignment: Alignment.center,
                        child: const Text('Preview unavailable'),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ],
      ),
    );
  }
}
