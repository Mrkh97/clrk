import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../domains/domains.dart';

part 'receipt_form_state_notifier.g.dart';

@riverpod
class ReceiptFormStateNotifier extends _$ReceiptFormStateNotifier {
  @override
  ReceiptFormState build() => ReceiptFormState.initial();

  void setMerchant(String merchant) =>
      state = state.copyWith(merchant: merchant);

  void setAmount(String amount) => state = state.copyWith(amount: amount);

  void setDate(String date) => state = state.copyWith(date: date);

  void setCategory(ReceiptCategory category) =>
      state = state.copyWith(category: category);

  void setPaymentMethod(PaymentMethod paymentMethod) =>
      state = state.copyWith(paymentMethod: paymentMethod);

  void setNotes(String notes) => state = state.copyWith(notes: notes);

  void populateFromReceipt(Receipt receipt) {
    state = ReceiptFormState.fromReceipt(receipt);
  }

  void applyExtractedReceipt(ExtractedReceipt receipt) {
    state = state.applyExtractedReceipt(receipt);
  }

  void reset() {
    state = ReceiptFormState.initial();
  }
}
