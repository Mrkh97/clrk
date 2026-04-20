class DashboardData {
  const DashboardData({
    required this.currency,
    required this.stats,
    required this.monthlySpend,
    required this.categorySpend,
    required this.transactions,
  });

  factory DashboardData.fromJson(Map<String, dynamic> json) {
    return DashboardData(
      currency: json['currency'] as String? ?? 'USD',
      stats: DashboardStats.fromJson(
        json['stats'] as Map<String, dynamic>? ?? const <String, dynamic>{},
      ),
      monthlySpend: (json['monthlySpend'] as List<dynamic>? ?? const [])
          .map((item) => MonthlySpend.fromJson(item as Map<String, dynamic>))
          .toList(),
      categorySpend: (json['categorySpend'] as List<dynamic>? ?? const [])
          .map((item) => CategorySpend.fromJson(item as Map<String, dynamic>))
          .toList(),
      transactions: (json['transactions'] as List<dynamic>? ?? const [])
          .map(
            (item) =>
                DashboardTransaction.fromJson(item as Map<String, dynamic>),
          )
          .toList(),
    );
  }

  final String currency;
  final DashboardStats stats;
  final List<MonthlySpend> monthlySpend;
  final List<CategorySpend> categorySpend;
  final List<DashboardTransaction> transactions;
}

class DashboardStats {
  const DashboardStats({
    required this.totalSpent,
    required this.avgDaily,
    required this.topCategory,
    required this.transactionCount,
  });

  factory DashboardStats.fromJson(Map<String, dynamic> json) {
    return DashboardStats(
      totalSpent: (json['totalSpent'] as num?)?.toDouble() ?? 0,
      avgDaily: (json['avgDaily'] as num?)?.toDouble() ?? 0,
      topCategory: json['topCategory'] as String? ?? 'No receipts yet',
      transactionCount: (json['transactionCount'] as num?)?.toInt() ?? 0,
    );
  }

  final double totalSpent;
  final double avgDaily;
  final String topCategory;
  final int transactionCount;
}

class MonthlySpend {
  const MonthlySpend({required this.label, required this.amount});

  factory MonthlySpend.fromJson(Map<String, dynamic> json) {
    return MonthlySpend(
      label: json['label'] as String? ?? '',
      amount: (json['amount'] as num?)?.toDouble() ?? 0,
    );
  }

  final String label;
  final double amount;
}

class CategorySpend {
  const CategorySpend({
    required this.category,
    required this.amount,
    required this.percentage,
  });

  factory CategorySpend.fromJson(Map<String, dynamic> json) {
    return CategorySpend(
      category: json['category'] as String? ?? 'Other',
      amount: (json['amount'] as num?)?.toDouble() ?? 0,
      percentage: (json['percentage'] as num?)?.toDouble() ?? 0,
    );
  }

  final String category;
  final double amount;
  final double percentage;
}

class DashboardTransaction {
  const DashboardTransaction({
    required this.id,
    required this.merchant,
    required this.amount,
    required this.currency,
    required this.date,
    required this.category,
    required this.status,
  });

  factory DashboardTransaction.fromJson(Map<String, dynamic> json) {
    return DashboardTransaction(
      id: json['id'] as String? ?? '',
      merchant: json['merchant'] as String? ?? '',
      amount: (json['amount'] as num?)?.toDouble() ?? 0,
      currency: json['currency'] as String? ?? 'USD',
      date: json['date'] as String? ?? '',
      category: json['category'] as String? ?? 'Other',
      status: json['status'] as String? ?? 'pending',
    );
  }

  final String id;
  final String merchant;
  final double amount;
  final String currency;
  final String date;
  final String category;
  final String status;
}

enum DashboardTimeFilter {
  sevenDays('7D', '7D'),
  thirtyDays('30D', '30D'),
  threeMonths('3M', '3M'),
  sixMonths('6M', '6M'),
  oneYear('1Y', '1Y');

  const DashboardTimeFilter(this.apiValue, this.label);

  final String apiValue;
  final String label;
}
