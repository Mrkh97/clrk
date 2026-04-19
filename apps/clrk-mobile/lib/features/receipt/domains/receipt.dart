import 'payment_method.dart';
import 'receipt_category.dart';
import 'receipt_status.dart';

class Receipt {
  const Receipt({
    required this.id,
    required this.merchant,
    required this.amount,
    required this.currency,
    required this.date,
    required this.category,
    required this.paymentMethod,
    required this.status,
    required this.aiExtracted,
    this.notes,
  });

  factory Receipt.fromJson(Map<String, dynamic> json) {
    return Receipt(
      id: json['id'] as String,
      merchant: json['merchant'] as String? ?? '',
      amount: (json['amount'] as num?)?.toDouble() ?? 0,
      currency: json['currency'] as String? ?? 'USD',
      date: json['date'] as String? ?? '',
      category: receiptCategoryFromJson(json['category'] as String?),
      paymentMethod: paymentMethodFromJson(json['paymentMethod'] as String?),
      status: receiptStatusFromJson(json['status'] as String?),
      aiExtracted: json['aiExtracted'] as bool? ?? false,
      notes: json['notes'] as String?,
    );
  }

  final String id;
  final String merchant;
  final double amount;
  final String currency;
  final String date;
  final ReceiptCategory category;
  final PaymentMethod paymentMethod;
  final String? notes;
  final ReceiptStatus status;
  final bool aiExtracted;
}
