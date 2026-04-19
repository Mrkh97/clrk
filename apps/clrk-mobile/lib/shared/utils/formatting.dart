String formatCurrency(double amount, String currency) {
  final symbol = switch (currency.toUpperCase()) {
    'USD' => r'$',
    'EUR' => '€',
    'GBP' => '£',
    'TRY' => '₺',
    _ => '${currency.toUpperCase()} ',
  };

  final value = amount.toStringAsFixed(amount % 1 == 0 ? 0 : 2);
  return '$symbol$value';
}

String formatDateLabel(String value) {
  final date = DateTime.tryParse(value);

  if (date == null) {
    return value;
  }

  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  return '${months[date.month - 1]} ${date.day}';
}

String formatDateInput(DateTime value) {
  final month = value.month.toString().padLeft(2, '0');
  final day = value.day.toString().padLeft(2, '0');
  return '${value.year}-$month-$day';
}
