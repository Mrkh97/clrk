import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';

import '../../../shared/components/app_button.dart';
import '../../../shared/components/app_text_field.dart';
import '../../../shared/extensions/build_context_extensions.dart';
import '../../../shared/theme/app_theme.dart';
import '../domains/auth_redirect.dart';
import '../usecases/auth_controller.dart';

class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({this.redirectTo, super.key});

  final String? redirectTo;

  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();

  bool _isSubmitting = false;
  String? _errorMessage;

  @override
  void dispose() {
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
        Text('WELCOME BACK', style: AppTheme.monoLabel(context)),
        const SizedBox(height: 12),
        Text('Resume the money flow.', style: theme.textTheme.headlineMedium),
        const SizedBox(height: 10),
        Text(
          'Pick up where you left off and move straight into your protected dashboard, optimizer, and receipt review workspace.',
          style: theme.textTheme.bodyMedium?.copyWith(
            color: AppColors.mutedForeground,
          ),
        ),
        const SizedBox(height: 28),
        Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
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
                hint: 'Enter your password',
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
                    border: Border.all(
                      color: AppColors.error.withValues(alpha: 0.35),
                    ),
                  ),
                  child: Text(
                    _errorMessage!,
                    style: theme.textTheme.bodySmall?.copyWith(
                      color: AppColors.error,
                    ),
                  ),
                ),
              ],
              const SizedBox(height: 20),
              AppButton(
                label: _isSubmitting ? 'Signing In...' : 'Sign In',
                onPress: _isSubmitting ? null : _handleSubmit,
              ),
            ],
          ),
        ),
        const SizedBox(height: 22),
        Row(
          children: [
            Text(
              'New to clrk?',
              style: theme.textTheme.bodySmall?.copyWith(
                color: AppColors.mutedForeground,
              ),
            ),
            TextButton(
              onPressed: () {
                context.go(_authPath('/register', widget.redirectTo));
              },
              child: const Text('Create Account'),
            ),
          ],
        ),
      ],
    );
  }

  Future<void> _handleSubmit() async {
    final safeRedirect = getSafeRedirectTarget(widget.redirectTo);
    final email = _emailController.text.trim();
    final password = _passwordController.text;

    if (email.isEmpty || password.isEmpty) {
      setState(() => _errorMessage = 'Email and password are required.');
      return;
    }

    setState(() {
      _isSubmitting = true;
      _errorMessage = null;
    });

    try {
      await ref
          .read(authControllerProvider.notifier)
          .signIn(email: email, password: password);
      if (!mounted) return;
      context.go(safeRedirect);
    } catch (error) {
      if (!mounted) return;
      final message = authErrorMessage(error);
      setState(() => _errorMessage = message);
      context.showErrorToast('Sign in failed', description: message);
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

  return Uri(
    path: path,
    queryParameters: {'redirect': safeRedirect},
  ).toString();
}
