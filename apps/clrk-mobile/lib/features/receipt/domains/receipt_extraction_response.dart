import 'extracted_receipt.dart';

class ReceiptExtractionResponse {
  const ReceiptExtractionResponse({
    required this.fileName,
    required this.receipt,
  });

  factory ReceiptExtractionResponse.fromJson(Map<String, dynamic> json) {
    return ReceiptExtractionResponse(
      fileName: json['fileName'] as String? ?? 'receipt.jpg',
      receipt: ExtractedReceipt.fromJson(
        json['receipt'] as Map<String, dynamic>,
      ),
    );
  }

  final String fileName;
  final ExtractedReceipt receipt;
}
