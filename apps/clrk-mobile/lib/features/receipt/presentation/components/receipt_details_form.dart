import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:forui/forui.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';

import '../../../../shared/components/app_button.dart';
import '../../../../shared/components/app_choice_selector.dart';
import '../../../../shared/components/app_section_card.dart';
import '../../../../shared/components/app_text_field.dart';
import '../../../../shared/theme/app_theme.dart';
import '../../domains/domains.dart';
import '../../usecases/extract_receipt_notifier.dart';
import '../../usecases/receipt_form_state_notifier.dart';
import '../../usecases/save_receipt_notifier.dart';
import '../../usecases/selected_receipt_id_notifier.dart';

const _commonReceiptCurrencies = <String>[
  'TRY',
  'USD',
  'EUR',
  'GBP',
  'CAD',
  'AUD',
  'CHF',
  'JPY',
];

const _currencyLabels = <String, String>{
  'TRY': 'Turkish Lira (TRY)',
  'USD': 'US Dollar (USD)',
  'EUR': 'Euro (EUR)',
  'GBP': 'British Pound (GBP)',
  'CAD': 'Canadian Dollar (CAD)',
  'AUD': 'Australian Dollar (AUD)',
  'CHF': 'Swiss Franc (CHF)',
  'JPY': 'Japanese Yen (JPY)',
};

class ReceiptDetailsForm extends HookConsumerWidget {
  const ReceiptDetailsForm({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final formState = ref.watch(receiptFormStateProvider);
    final extractedReceipt = ref.watch(extractReceiptProvider).asData?.value;
    final saveState = ref.watch(saveReceiptProvider);
    final saveNotifier = ref.read(saveReceiptProvider.notifier);
    final selectedReceiptId = ref.watch(selectedReceiptIdProvider);

    final merchantController = useTextEditingController(
      text: formState.merchant,
    );
    final amountController = useTextEditingController(text: formState.amount);
    final dateController = useTextEditingController(text: formState.date);
    final notesController = useTextEditingController(text: formState.notes);

    final isSaving = saveState.isLoading;
    final currencyOptions =
        formState.currency.isEmpty ||
            _commonReceiptCurrencies.contains(formState.currency)
        ? _commonReceiptCurrencies
        : [formState.currency, ..._commonReceiptCurrencies];

    return AppSectionCard(
      title: 'Receipt Details',
      subtitle: selectedReceiptId == null
          ? 'Preview and scan a receipt, then confirm the extracted details.'
          : 'Editing an existing receipt.',
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (selectedReceiptId != null) ...[
            _EditingBanner(
              onCancel: isSaving
                  ? null
                  : () {
                      ref.read(selectedReceiptIdProvider.notifier).clear();
                      ref.read(receiptFormStateProvider.notifier).reset();
                    },
            ),
            const SizedBox(height: 12),
          ],
          if (selectedReceiptId == null && extractedReceipt != null) ...[
            const _InfoBanner(
              accentColor: AppColors.brand,
              title: 'AI Extracted',
              description: 'Review the scanned details and save when ready.',
            ),
            const SizedBox(height: 12),
          ],
          AppTextField(
            label: 'Merchant',
            hint: 'Whole Foods Market',
            controller: merchantController,
            onChanged: ref.read(receiptFormStateProvider.notifier).setMerchant,
            enabled: !isSaving,
          ),
          const SizedBox(height: 12),
          AppTextField(
            label: 'Amount',
            hint: '0.00',
            controller: amountController,
            keyboardType: const TextInputType.numberWithOptions(decimal: true),
            inputFormatters: [
              FilteringTextInputFormatter.allow(RegExp(r'[0-9.]')),
            ],
            onChanged: ref.read(receiptFormStateProvider.notifier).setAmount,
            enabled: !isSaving,
          ),
          const SizedBox(height: 12),
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                child: AppTextField(
                  label: 'Date',
                  controller: dateController,
                  readOnly: true,
                  onChanged: (_) {},
                  onTap: () async {
                    final parsed =
                        DateTime.tryParse(dateController.text) ??
                        DateTime.now();
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
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _CurrencyField(
                  value: formState.currency,
                  options: currencyOptions,
                  enabled: !isSaving,
                  onChanged: ref
                      .read(receiptFormStateProvider.notifier)
                      .setCurrency,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Opacity(
            opacity: isSaving ? 0.6 : 1,
            child: AbsorbPointer(
              absorbing: isSaving,
              child: AppChoiceSelector<ReceiptCategory>(
                label: 'Category',
                value: formState.category,
                choices: [
                  for (final category in ReceiptCategory.values)
                    AppChoice(value: category, label: category.label),
                ],
                onChanged: ref
                    .read(receiptFormStateProvider.notifier)
                    .setCategory,
              ),
            ),
          ),
          const SizedBox(height: 12),
          Opacity(
            opacity: isSaving ? 0.6 : 1,
            child: AbsorbPointer(
              absorbing: isSaving,
              child: AppChoiceSelector<PaymentMethod>(
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
            ),
          ),
          const SizedBox(height: 12),
          AppTextField(
            label: 'Notes',
            hint: 'Optional notes',
            controller: notesController,
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

class _EditingBanner extends StatelessWidget {
  const _EditingBanner({required this.onCancel});

  final VoidCallback? onCancel;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.brandSoft,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: AppColors.brand.withValues(alpha: 0.3)),
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Editing Receipt',
                  style: AppTheme.monoLabel(context, color: AppColors.brand),
                ),
                const SizedBox(height: 4),
                Text(
                  'Cancel to switch back to a new receipt.',
                  style: Theme.of(context).textTheme.bodySmall,
                ),
              ],
            ),
          ),
          const SizedBox(width: 12),
          AppButton(
            label: 'Cancel',
            expand: false,
            variant: FButtonVariant.outline,
            onPress: onCancel,
          ),
        ],
      ),
    );
  }
}

class _InfoBanner extends StatelessWidget {
  const _InfoBanner({
    required this.accentColor,
    required this.title,
    required this.description,
  });

  final Color accentColor;
  final String title;
  final String description;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: accentColor.withValues(alpha: 0.14),
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: accentColor.withValues(alpha: 0.28)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title, style: AppTheme.monoLabel(context, color: accentColor)),
          const SizedBox(height: 4),
          Text(description, style: Theme.of(context).textTheme.bodySmall),
        ],
      ),
    );
  }
}

class _CurrencyField extends StatelessWidget {
  const _CurrencyField({
    required this.value,
    required this.options,
    required this.enabled,
    required this.onChanged,
  });

  final String value;
  final List<String> options;
  final bool enabled;
  final ValueChanged<String> onChanged;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('CURRENCY', style: AppTheme.monoLabel(context)),
        const SizedBox(height: 8),
        DropdownButtonFormField<String>(
          key: ValueKey(value),
          initialValue: options.contains(value) ? value : options.first,
          isExpanded: true,
          onChanged: enabled
              ? (nextValue) {
                  if (nextValue != null) {
                    onChanged(nextValue);
                  }
                }
              : null,
          selectedItemBuilder: (context) => [
            for (final option in options)
              Align(
                alignment: Alignment.centerLeft,
                child: Text(
                  option,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
          ],
          dropdownColor: AppColors.backgroundElevated,
          decoration: const InputDecoration(),
          items: [
            for (final option in options)
              DropdownMenuItem<String>(
                value: option,
                child: Text(
                  _currencyLabels[option] ?? option,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
          ],
        ),
      ],
    );
  }
}
