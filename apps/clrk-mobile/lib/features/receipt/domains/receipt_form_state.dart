import 'extracted_receipt.dart';
import 'payment_method.dart';
import 'receipt.dart';
import 'receipt_category.dart';
import 'receipt_form_input.dart';

class ReceiptFormState {
  const ReceiptFormState({
    required this.merchant,
    required this.amount,
    required this.date,
    required this.category,
    required this.paymentMethod,
    required this.notes,
  });

  factory ReceiptFormState.initial() {
    return ReceiptFormState(
      merchant: '',
      amount: '',
      date: DateTime.now().toIso8601String().split('T').first,
      category: ReceiptCategory.food,
      paymentMethod: PaymentMethod.card,
      notes: '',
    );
  }

  factory ReceiptFormState.fromReceipt(Receipt receipt) {
    return ReceiptFormState(
      merchant: receipt.merchant,
      amount: receipt.amount.toStringAsFixed(2),
      date: receipt.date,
      category: receipt.category,
      paymentMethod: receipt.paymentMethod,
      notes: receipt.notes ?? '',
    );
  }

  final String merchant;
  final String amount;
  final String date;
  final ReceiptCategory category;
  final PaymentMethod paymentMethod;
  final String notes;

  ReceiptFormState copyWith({
    String? merchant,
    String? amount,
    String? date,
    ReceiptCategory? category,
    PaymentMethod? paymentMethod,
    String? notes,
  }) {
    return ReceiptFormState(
      merchant: merchant ?? this.merchant,
      amount: amount ?? this.amount,
      date: date ?? this.date,
      category: category ?? this.category,
      paymentMethod: paymentMethod ?? this.paymentMethod,
      notes: notes ?? this.notes,
    );
  }

  ReceiptFormState applyExtractedReceipt(ExtractedReceipt receipt) {
    return copyWith(
      merchant: receipt.merchant ?? merchant,
      amount: receipt.total?.toStringAsFixed(2) ?? amount,
      date: _normalizeReceiptDate(receipt.date) ?? date,
      paymentMethod: receipt.paymentMethod ?? paymentMethod,
      notes: receipt.notes ?? notes,
    );
  }

  ReceiptFormInput toInput({required bool aiExtracted}) {
    return ReceiptFormInput(
      merchant: merchant.trim(),
      amount: amount.trim(),
      date: date,
      category: category,
      paymentMethod: paymentMethod,
      notes: notes.trim(),
      aiExtracted: aiExtracted,
    );
  }

  static String? _normalizeReceiptDate(String? value) {
    if (value == null || value.isEmpty) {
      return null;
    }

    final parsed = DateTime.tryParse(value);
    return parsed?.toIso8601String().split('T').first;
  }
}
