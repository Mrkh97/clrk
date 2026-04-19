class OptimizationResult {
  const OptimizationResult({
    required this.currency,
    required this.level,
    required this.totalCurrentSpend,
    required this.totalSavings,
    required this.suggestions,
  });

  factory OptimizationResult.fromJson(Map<String, dynamic> json) {
    return OptimizationResult(
      currency: json['currency'] as String? ?? 'USD',
      level: json['level'] as String? ?? 'easy',
      totalCurrentSpend: (json['totalCurrentSpend'] as num?)?.toDouble() ?? 0,
      totalSavings: (json['totalSavings'] as num?)?.toDouble() ?? 0,
      suggestions: (json['suggestions'] as List<dynamic>? ?? const [])
          .map((item) => CutSuggestion.fromJson(item as Map<String, dynamic>))
          .toList(),
    );
  }

  final String currency;
  final String level;
  final double totalCurrentSpend;
  final double totalSavings;
  final List<CutSuggestion> suggestions;
}

class CutSuggestion {
  const CutSuggestion({
    required this.id,
    required this.category,
    required this.merchant,
    required this.currentSpend,
    required this.suggestedSpend,
    required this.saving,
    required this.reason,
  });

  factory CutSuggestion.fromJson(Map<String, dynamic> json) {
    return CutSuggestion(
      id: json['id'] as String? ?? '',
      category: json['category'] as String? ?? 'Other',
      merchant: json['merchant'] as String? ?? 'Unknown Merchant',
      currentSpend: (json['currentSpend'] as num?)?.toDouble() ?? 0,
      suggestedSpend: (json['suggestedSpend'] as num?)?.toDouble() ?? 0,
      saving: (json['saving'] as num?)?.toDouble() ?? 0,
      reason: json['reason'] as String? ?? '',
    );
  }

  final String id;
  final String category;
  final String merchant;
  final double currentSpend;
  final double suggestedSpend;
  final double saving;
  final String reason;
}
