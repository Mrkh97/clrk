import 'extracted_receipt_item.dart';
import 'payment_method.dart';

class ExtractedReceipt {
  const ExtractedReceipt({
    required this.items,
    this.merchant,
    this.currency,
    this.date,
    this.subtotal,
    this.tax,
    this.tip,
    this.total,
    this.paymentMethod,
    this.notes,
    this.rawText,
    this.confidence,
  });

  factory ExtractedReceipt.fromJson(Map<String, dynamic> json) {
    return ExtractedReceipt(
      merchant: json['merchant'] as String?,
      currency: json['currency'] as String?,
      date: json['date'] as String?,
      subtotal: (json['subtotal'] as num?)?.toDouble(),
      tax: (json['tax'] as num?)?.toDouble(),
      tip: (json['tip'] as num?)?.toDouble(),
      total: (json['total'] as num?)?.toDouble(),
      paymentMethod: paymentMethodFromJson(json['paymentMethod'] as String?),
      notes: json['notes'] as String?,
      rawText: json['rawText'] as String?,
      confidence: (json['confidence'] as num?)?.toDouble(),
      items: ((json['items'] as List<dynamic>?) ?? const [])
          .map(
            (item) =>
                ExtractedReceiptItem.fromJson(item as Map<String, dynamic>),
          )
          .toList(),
    );
  }

  final String? merchant;
  final String? currency;
  final String? date;
  final double? subtotal;
  final double? tax;
  final double? tip;
  final double? total;
  final PaymentMethod? paymentMethod;
  final String? notes;
  final String? rawText;
  final double? confidence;
  final List<ExtractedReceiptItem> items;
}
