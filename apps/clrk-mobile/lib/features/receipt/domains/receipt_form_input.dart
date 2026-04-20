import 'payment_method.dart';
import 'receipt_category.dart';

class ReceiptFormInput {
  const ReceiptFormInput({
    required this.merchant,
    required this.amount,
    required this.currency,
    required this.date,
    required this.category,
    required this.paymentMethod,
    required this.notes,
    required this.aiExtracted,
  });

  final String merchant;
  final String amount;
  final String currency;
  final String date;
  final ReceiptCategory category;
  final PaymentMethod paymentMethod;
  final String notes;
  final bool aiExtracted;

  Map<String, dynamic> toJson() {
    return {
      'merchant': merchant,
      'amount': double.parse(amount),
      'currency': currency,
      'date': date,
      'category': category.name,
      'paymentMethod': paymentMethod.name,
      'notes': notes,
      'aiExtracted': aiExtracted,
    };
  }
}
