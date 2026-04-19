enum PaymentMethod {
  cash('Cash'),
  card('Card'),
  digital('Digital');

  const PaymentMethod(this.label);

  final String label;
}

PaymentMethod paymentMethodFromJson(String? value) {
  return PaymentMethod.values.firstWhere(
    (method) => method.name == value,
    orElse: () => PaymentMethod.card,
  );
}
