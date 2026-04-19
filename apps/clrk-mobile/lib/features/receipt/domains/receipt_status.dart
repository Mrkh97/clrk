enum ReceiptStatus { pending, processing, complete, error }

ReceiptStatus receiptStatusFromJson(String? value) {
  return ReceiptStatus.values.firstWhere(
    (status) => status.name == value,
    orElse: () => ReceiptStatus.pending,
  );
}
