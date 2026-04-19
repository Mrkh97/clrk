import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';

import '../../../shared/components/app_button.dart';
import '../../../shared/components/app_text_field.dart';
import '../../../shared/extensions/build_context_extensions.dart';
import '../../../shared/theme/app_theme.dart';
import '../domains/auth_redirect.dart';
import '../usecases/auth_controller.dart';

class RegisterScreen extends ConsumerStatefulWidget {
  const RegisterScreen({this.redirectTo, super.key});

  final String? redirectTo;

  @override
  ConsumerState<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends ConsumerState<RegisterScreen> {
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();

  bool _isSubmitting = false;
  String? _errorMessage;

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        Text('CREATE ACCOUNT', style: AppTheme.monoLabel(context)),
        const SizedBox(height: 12),
        Text('Open your private finance cockpit.', style: theme.textTheme.headlineMedium),
        const SizedBox(height: 10),
        Text(
          'Register once, then move directly into route-protected budgeting, optimization, and receipt review.',
          style: theme.textTheme.bodyMedium?.copyWith(color: AppColors.mutedForeground),
        ),
        const SizedBox(height: 28),
        AppTextField(
          label: 'Name',
          value: _nameController.text,
          hint: 'Morgan Lee',
          textInputAction: TextInputAction.next,
          onChanged: (value) => _nameController.text = value,
        ),
        const SizedBox(height: 16),
        AppTextField(
          label: 'Email',
          value: _emailController.text,
          hint: 'you@example.com',
          keyboardType: TextInputType.emailAddress,
          textInputAction: TextInputAction.next,
          onChanged: (value) => _emailController.text = value,
        ),
        const SizedBox(height: 16),
        AppTextField(
          label: 'Password',
          value: _passwordController.text,
          hint: 'Use at least 8 characters',
          obscureText: true,
          onChanged: (value) => _passwordController.text = value,
        ),
        if (_errorMessage != null) ...[
          const SizedBox(height: 16),
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: AppColors.error.withValues(alpha: 0.12),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: AppColors.error.withValues(alpha: 0.35)),
            ),
            child: Text(
              _errorMessage!,
              style: theme.textTheme.bodySmall?.copyWith(color: AppColors.error),
            ),
          ),
        ],
        const SizedBox(height: 20),
        AppButton(
          label: _isSubmitting ? 'Creating Account...' : 'Create Account',
          onPress: _isSubmitting ? null : _handleSubmit,
        ),
        const SizedBox(height: 22),
        Row(
          children: [
            Text(
              'Already have an account?',
              style: theme.textTheme.bodySmall?.copyWith(color: AppColors.mutedForeground),
            ),
            TextButton(
              onPressed: () {
                context.go(_authPath('/login', widget.redirectTo));
              },
              child: const Text('Sign In'),
            ),
          ],
        ),
      ],
    );
  }

  Future<void> _handleSubmit() async {
    final safeRedirect = getSafeRedirectTarget(widget.redirectTo);
    final name = _nameController.text.trim();
    final email = _emailController.text.trim();
    final password = _passwordController.text;

    if (name.isEmpty || email.isEmpty || password.isEmpty) {
      setState(() => _errorMessage = 'Name, email, and password are required.');
      return;
    }

    if (password.length < 8) {
      setState(() => _errorMessage = 'Password must be at least 8 characters long.');
      return;
    }

    setState(() {
      _isSubmitting = true;
      _errorMessage = null;
    });

    try {
      await ref.read(authControllerProvider.notifier).signUp(
            name: name,
            email: email,
            password: password,
          );
      if (!mounted) return;
      context.go(safeRedirect);
    } catch (error) {
      if (!mounted) return;
      final message = authErrorMessage(error);
      setState(() => _errorMessage = message);
      context.showErrorToast('Registration failed', description: message);
    } finally {
      if (mounted) {
        setState(() => _isSubmitting = false);
      }
    }
  }
}

String _authPath(String path, String? redirectTo) {
  final safeRedirect = getSafeRedirectTarget(redirectTo);

  if (safeRedirect == defaultAuthenticatedRoute) {
    return path;
  }

  return Uri(path: path, queryParameters: {'redirect': safeRedirect}).toString();
}
