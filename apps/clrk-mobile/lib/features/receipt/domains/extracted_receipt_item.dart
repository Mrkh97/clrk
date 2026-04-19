class ExtractedReceiptItem {
  const ExtractedReceiptItem({
    required this.name,
    this.quantity,
    this.unitPrice,
    this.totalPrice,
  });

  factory ExtractedReceiptItem.fromJson(Map<String, dynamic> json) {
    return ExtractedReceiptItem(
      name: json['name'] as String? ?? '',
      quantity: (json['quantity'] as num?)?.toInt(),
      unitPrice: (json['unitPrice'] as num?)?.toDouble(),
      totalPrice: (json['totalPrice'] as num?)?.toDouble(),
    );
  }

  final String name;
  final int? quantity;
  final double? unitPrice;
  final double? totalPrice;
}
