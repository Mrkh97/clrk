import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';

import '../../../shared/components/app_button.dart';
import '../../../shared/theme/app_theme.dart';
import '../domains/auth_redirect.dart';
import '../usecases/onboarding_controller.dart';

class OnboardingIntroScreen extends ConsumerStatefulWidget {
  const OnboardingIntroScreen({this.redirectTo, super.key});

  final String? redirectTo;

  @override
  ConsumerState<OnboardingIntroScreen> createState() =>
      _OnboardingIntroScreenState();
}

class _OnboardingIntroScreenState extends ConsumerState<OnboardingIntroScreen> {
  bool _isContinuing = false;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      body: DecoratedBox(
        decoration: BoxDecoration(gradient: AppTheme.backgroundGradient()),
        child: SafeArea(
          child: Stack(
            children: [
              const Positioned(
                top: 64,
                right: -20,
                child: _GlowOrb(size: 200, color: AppColors.brandSoft),
              ),
              const Positioned(
                bottom: 120,
                left: -50,
                child: _GlowOrb(size: 240, color: Color(0x2213E7B2)),
              ),
              Center(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.all(20),
                  child: ConstrainedBox(
                    constraints: const BoxConstraints(maxWidth: 1120),
                    child: LayoutBuilder(
                      builder: (context, constraints) {
                        final wide = constraints.maxWidth >= 920;

                        final hero = Container(
                          padding: const EdgeInsets.all(28),
                          decoration: AppTheme.glassPanel(
                            heavy: true,
                            radius: BorderRadius.circular(36),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Container(
                                    width: 12,
                                    height: 12,
                                    decoration: const BoxDecoration(
                                      color: AppColors.brand,
                                      shape: BoxShape.circle,
                                    ),
                                  ),
                                  const SizedBox(width: 12),
                                  Text(
                                    'clrk',
                                    style: theme.textTheme.titleLarge,
                                  ),
                                ],
                              ),
                              const SizedBox(height: 28),
                              Text(
                                'PRIVATE MONEY OPS',
                                style: AppTheme.monoLabel(
                                  context,
                                  color: AppColors.brand,
                                ),
                              ),
                              const SizedBox(height: 16),
                              Text(
                                'Track spending, capture receipts, and move faster with a calmer finance workspace.',
                                style: theme.textTheme.displayMedium,
                              ),
                              const SizedBox(height: 18),
                              Text(
                                'clrk turns the messy part of personal money management into a guided mobile flow with live dashboards, optimizer insights, and camera-first receipt capture.',
                                style: theme.textTheme.bodyLarge?.copyWith(
                                  color: AppColors.mutedForeground,
                                ),
                              ),
                              const SizedBox(height: 28),
                              Wrap(
                                spacing: 12,
                                runSpacing: 12,
                                children: const [
                                  _SignalChip(
                                    label: 'RECEIPTS',
                                    value:
                                        'Camera-first capture and extraction',
                                  ),
                                  _SignalChip(
                                    label: 'DASHBOARD',
                                    value: 'See cash movement at a glance',
                                  ),
                                  _SignalChip(
                                    label: 'OPTIMIZER',
                                    value: 'Turn patterns into actions',
                                  ),
                                ],
                              ),
                              const SizedBox(height: 28),
                              Container(
                                padding: const EdgeInsets.all(22),
                                decoration: AppTheme.softPanel(
                                  radius: BorderRadius.circular(28),
                                ),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      'Built for quick daily check-ins and sharper weekly reviews.',
                                      style: theme.textTheme.titleLarge,
                                    ),
                                    const SizedBox(height: 14),
                                    const _FeatureRow(
                                      icon: Icons.bolt_rounded,
                                      title: 'Fast intake',
                                      text:
                                          'Snap receipts and keep the details moving without leaving the app.',
                                    ),
                                    const SizedBox(height: 12),
                                    const _FeatureRow(
                                      icon: Icons.query_stats_rounded,
                                      title: 'Clear signals',
                                      text:
                                          'Spot trends, totals, and changes before they turn into drift.',
                                    ),
                                    const SizedBox(height: 12),
                                    const _FeatureRow(
                                      icon: Icons.lock_open_rounded,
                                      title: 'Secure flow',
                                      text:
                                          'Protected routes keep the workspace behind your account session.',
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        );

                        final sidePanel = Container(
                          padding: const EdgeInsets.all(24),
                          decoration: AppTheme.glassPanel(
                            radius: BorderRadius.circular(32),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Text(
                                'Why people start here',
                                style: theme.textTheme.titleLarge,
                              ),
                              const SizedBox(height: 16),
                              const _MiniStat(
                                value: '01',
                                label:
                                    'See accounts, receipts, and planning in one mobile lane.',
                              ),
                              const SizedBox(height: 14),
                              const _MiniStat(
                                value: '02',
                                label:
                                    'Replace scattered notes with one deliberate workflow.',
                              ),
                              const SizedBox(height: 14),
                              const _MiniStat(
                                value: '03',
                                label:
                                    'Move into sign in or sign up whenever you are ready.',
                              ),
                              const SizedBox(height: 26),
                              AppButton(
                                label: _isContinuing
                                    ? 'Opening...'
                                    : 'Get Started',
                                icon: const Icon(
                                  Icons.arrow_forward_rounded,
                                  size: 18,
                                ),
                                onPress: _isContinuing ? null : _handleContinue,
                              ),
                            ],
                          ),
                        );

                        return wide
                            ? Row(
                                crossAxisAlignment: CrossAxisAlignment.center,
                                children: [
                                  Expanded(flex: 11, child: hero),
                                  const SizedBox(width: 20),
                                  Expanded(flex: 7, child: sidePanel),
                                ],
                              )
                            : Column(
                                crossAxisAlignment: CrossAxisAlignment.stretch,
                                children: [
                                  hero,
                                  const SizedBox(height: 20),
                                  sidePanel,
                                ],
                              );
                      },
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Future<void> _handleContinue() async {
    setState(() => _isContinuing = true);

    await ref.read(onboardingControllerProvider.notifier).completeIntro();

    if (!mounted) {
      return;
    }

    final safeRedirect = getSafeRedirectTarget(widget.redirectTo);
    context.go(
      safeRedirect == defaultAuthenticatedRoute
          ? '/auth'
          : Uri(
              path: '/auth',
              queryParameters: {'redirect': safeRedirect},
            ).toString(),
    );
  }
}

class _SignalChip extends StatelessWidget {
  const _SignalChip({required this.label, required this.value});

  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Container(
      constraints: const BoxConstraints(minWidth: 180, maxWidth: 220),
      padding: const EdgeInsets.all(16),
      decoration: AppTheme.softPanel(radius: BorderRadius.circular(24)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: AppTheme.monoLabel(context, color: AppColors.brand),
          ),
          const SizedBox(height: 10),
          Text(value, style: theme.textTheme.bodySmall),
        ],
      ),
    );
  }
}

class _FeatureRow extends StatelessWidget {
  const _FeatureRow({
    required this.icon,
    required this.title,
    required this.text,
  });

  final IconData icon;
  final String title;
  final String text;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          width: 42,
          height: 42,
          decoration: BoxDecoration(
            color: AppColors.brandSoft,
            borderRadius: BorderRadius.circular(16),
          ),
          child: Icon(icon, color: AppColors.brand),
        ),
        const SizedBox(width: 14),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title, style: theme.textTheme.titleMedium),
              const SizedBox(height: 4),
              Text(
                text,
                style: theme.textTheme.bodySmall?.copyWith(
                  color: AppColors.mutedForeground,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class _MiniStat extends StatelessWidget {
  const _MiniStat({required this.value, required this.label});

  final String value;
  final String label;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          value,
          style: theme.textTheme.displayMedium?.copyWith(
            color: AppColors.brand,
          ),
        ),
        const SizedBox(width: 14),
        Expanded(
          child: Text(
            label,
            style: theme.textTheme.bodyMedium?.copyWith(
              color: AppColors.mutedForeground,
            ),
          ),
        ),
      ],
    );
  }
}

class _GlowOrb extends StatelessWidget {
  const _GlowOrb({required this.size, required this.color});

  final double size;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return IgnorePointer(
      child: Container(
        width: size,
        height: size,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          gradient: RadialGradient(colors: [color, color.withValues(alpha: 0)]),
        ),
      ),
    );
  }
}
