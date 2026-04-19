enum ReceiptCategory {
  food('Food & Dining'),
  transport('Transport'),
  utilities('Utilities'),
  entertainment('Entertainment'),
  health('Health'),
  shopping('Shopping'),
  other('Other');

  const ReceiptCategory(this.label);

  final String label;
}

ReceiptCategory receiptCategoryFromJson(String? value) {
  return ReceiptCategory.values.firstWhere(
    (category) => category.name == value,
    orElse: () => ReceiptCategory.other,
  );
}
