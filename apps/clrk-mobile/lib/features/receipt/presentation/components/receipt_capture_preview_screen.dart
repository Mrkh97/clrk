import 'dart:io';

import 'package:flutter/material.dart';
import 'package:forui/forui.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:image_picker/image_picker.dart';

import '../../../../shared/components/app_button.dart';
import '../../../../shared/theme/app_theme.dart';
import '../../usecases/extract_receipt_notifier.dart';

class ReceiptCapturePreviewScreen extends ConsumerStatefulWidget {
  const ReceiptCapturePreviewScreen({
    required this.initialFilePath,
    required this.initialSource,
    super.key,
  });

  final String initialFilePath;
  final ImageSource initialSource;

  @override
  ConsumerState<ReceiptCapturePreviewScreen> createState() =>
      _ReceiptCapturePreviewScreenState();
}

class _ReceiptCapturePreviewScreenState
    extends ConsumerState<ReceiptCapturePreviewScreen> {
  final ImagePicker _picker = ImagePicker();

  late String _filePath;
  late ImageSource _source;

  @override
  void initState() {
    super.initState();
    _filePath = widget.initialFilePath;
    _source = widget.initialSource;
  }

  Future<void> _replaceImage() async {
    final image = await _picker.pickImage(source: _source, imageQuality: 90);

    if (image == null) {
      return;
    }

    setState(() {
      _filePath = image.path;
    });
  }

  Future<void> _scanReceipt() async {
    final receipt = await ref
        .read(extractReceiptProvider.notifier)
        .extract(filePath: _filePath, sourceLabel: _sourceLabel(_source));

    if (receipt != null && mounted) {
      Navigator.of(context).pop();
    }
  }

  @override
  Widget build(BuildContext context) {
    final isScanning = ref.watch(extractReceiptProvider).isLoading;
    final theme = Theme.of(context);
    final replaceLabel = _source == ImageSource.camera ? 'Retake' : 'Replace';

    return Scaffold(
      backgroundColor: Colors.transparent,
      body: DecoratedBox(
        decoration: BoxDecoration(gradient: AppTheme.backgroundGradient()),
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.fromLTRB(20, 20, 20, 24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                IconButton(
                  onPressed: isScanning
                      ? null
                      : () => Navigator.of(context).pop(),
                  icon: const Icon(Icons.arrow_back_rounded),
                ),
                const SizedBox(height: 8),
                Text('PREVIEW', style: AppTheme.monoLabel(context)),
                const SizedBox(height: 10),
                Text(
                  'Check the receipt before scanning',
                  style: theme.textTheme.headlineMedium,
                ),
                const SizedBox(height: 8),
                Text(
                  'If the photo looks off, take another one before sending it to extraction.',
                  style: theme.textTheme.bodyMedium?.copyWith(
                    color: AppColors.mutedForeground,
                  ),
                ),
                const SizedBox(height: 20),
                Expanded(
                  child: Container(
                    width: double.infinity,
                    decoration: AppTheme.glassPanel(heavy: true),
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            _sourceLabel(_source),
                            style: AppTheme.monoLabel(
                              context,
                              color: AppColors.brand,
                            ),
                          ),
                          const SizedBox(height: 12),
                          Expanded(
                            child: ClipRRect(
                              borderRadius: BorderRadius.circular(22),
                              child: ColoredBox(
                                color: AppColors.background,
                                child: Image.file(
                                  File(_filePath),
                                  width: double.infinity,
                                  fit: BoxFit.contain,
                                  errorBuilder: (_, _, _) => Center(
                                    child: Text(
                                      'Could not load this image preview.',
                                      style: theme.textTheme.bodyMedium,
                                    ),
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 18),
                Row(
                  children: [
                    Expanded(
                      child: AppButton(
                        label: replaceLabel,
                        variant: FButtonVariant.outline,
                        onPress: isScanning ? null : _replaceImage,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: AppButton(
                        label: isScanning ? 'Scanning...' : 'Scan',
                        onPress: isScanning ? null : _scanReceipt,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 100),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

String _sourceLabel(ImageSource source) {
  return source == ImageSource.camera ? 'Camera capture' : 'Gallery import';
}
