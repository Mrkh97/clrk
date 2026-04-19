class AuthSession {
  const AuthSession({
    required this.userId,
    required this.email,
    required this.name,
    required this.subscriptionEnabled,
  });

  factory AuthSession.fromJson(Map<String, dynamic> json) {
    final user = json['user'] as Map<String, dynamic>? ?? const <String, dynamic>{};

    return AuthSession(
      userId: user['id'] as String? ?? '',
      email: user['email'] as String? ?? '',
      name: user['name'] as String? ?? 'clrk user',
      subscriptionEnabled: user['subscriptionEnabled'] as bool? ?? false,
    );
  }

  final String userId;
  final String email;
  final String name;
  final bool subscriptionEnabled;
}
