import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';

import '../../../../shared/components/app_button.dart';
import '../../../../shared/components/app_choice_selector.dart';
import '../../../../shared/components/app_section_card.dart';
import '../../../../shared/components/app_text_field.dart';
import '../../domains/domains.dart';
import '../../usecases/receipt_form_state_notifier.dart';
import '../../usecases/save_receipt_notifier.dart';
import '../../usecases/selected_receipt_id_notifier.dart';

class ReceiptDetailsForm extends ConsumerWidget {
  const ReceiptDetailsForm({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final formState = ref.watch(receiptFormStateProvider);
    final saveState = ref.watch(saveReceiptProvider);
    final saveNotifier = ref.read(saveReceiptProvider.notifier);
    final selectedReceiptId = ref.watch(selectedReceiptIdProvider);

    final isSaving = saveState.isLoading;

    return AppSectionCard(
      title: 'Receipt Details',
      subtitle: selectedReceiptId == null
          ? 'Capture or import a receipt and confirm the details.'
          : 'Editing an existing receipt.',
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          AppTextField(
            label: 'Merchant',
            hint: 'Whole Foods Market',
            value: formState.merchant,
            onChanged: ref.read(receiptFormStateProvider.notifier).setMerchant,
            enabled: !isSaving,
          ),
          const SizedBox(height: 12),
          AppTextField(
            label: 'Amount',
            hint: '0.00',
            value: formState.amount,
            keyboardType: const TextInputType.numberWithOptions(decimal: true),
            inputFormatters: [
              FilteringTextInputFormatter.allow(RegExp(r'[0-9.]')),
            ],
            onChanged: ref.read(receiptFormStateProvider.notifier).setAmount,
            enabled: !isSaving,
          ),
          const SizedBox(height: 12),
          AppTextField(
            label: 'Date',
            value: formState.date,
            readOnly: true,
            onChanged: (_) {},
            onTap: () async {
              final parsed =
                  DateTime.tryParse(formState.date) ?? DateTime.now();
              final selected = await showDatePicker(
                context: context,
                initialDate: parsed,
                firstDate: DateTime(2020),
                lastDate: DateTime(2100),
              );

              if (selected != null && context.mounted) {
                ref
                    .read(receiptFormStateProvider.notifier)
                    .setDate(selected.toIso8601String().split('T').first);
              }
            },
            enabled: !isSaving,
          ),
          const SizedBox(height: 12),
          AppChoiceSelector<ReceiptCategory>(
            label: 'Category',
            value: formState.category,
            choices: [
              for (final category in ReceiptCategory.values)
                AppChoice(value: category, label: category.label),
            ],
            onChanged: ref.read(receiptFormStateProvider.notifier).setCategory,
          ),
          const SizedBox(height: 12),
          AppChoiceSelector<PaymentMethod>(
            label: 'Payment Method',
            value: formState.paymentMethod,
            choices: [
              for (final paymentMethod in PaymentMethod.values)
                AppChoice(value: paymentMethod, label: paymentMethod.label),
            ],
            onChanged: ref
                .read(receiptFormStateProvider.notifier)
                .setPaymentMethod,
          ),
          const SizedBox(height: 12),
          AppTextField(
            label: 'Notes',
            hint: 'Optional notes',
            value: formState.notes,
            maxLines: 4,
            onChanged: ref.read(receiptFormStateProvider.notifier).setNotes,
            enabled: !isSaving,
          ),
          const SizedBox(height: 16),
          SizedBox(
            width: double.infinity,
            child: AppButton(
              label: isSaving
                  ? 'Saving...'
                  : selectedReceiptId == null
                  ? 'Save receipt'
                  : 'Update receipt',
              onPress: isSaving ? null : saveNotifier.submit,
            ),
          ),
        ],
      ),
    );
  }
}
