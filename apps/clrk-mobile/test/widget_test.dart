import 'package:clrk_mobile/features/receipt/domains/domains.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  test('receipt form state applies extracted receipt values', () {
    final initial = ReceiptFormState.initial();
    final extracted = ExtractedReceipt(
      merchant: 'Corner Store',
      total: 42.50,
      date: '2026-04-19T10:00:00.000Z',
      paymentMethod: PaymentMethod.digital,
      notes: 'Scanned from gallery',
      items: const [],
    );

    final next = initial.applyExtractedReceipt(extracted);

    expect(next.merchant, 'Corner Store');
    expect(next.amount, '42.50');
    expect(next.date, '2026-04-19');
    expect(next.paymentMethod, PaymentMethod.digital);
    expect(next.notes, 'Scanned from gallery');
  });
}
