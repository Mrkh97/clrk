import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:forui/forui.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';

import 'shared/routing/app_router_provider.dart';

void main() {
  runApp(const ProviderScope(child: ClrkMobileApp()));
}

class ClrkMobileApp extends ConsumerWidget {
  const ClrkMobileApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = ref.watch(appRouterProvider);
    final theme = FThemes.neutral.light.touch;

    return MaterialApp.router(
      title: 'Clrk Mobile',
      debugShowCheckedModeBanner: false,
      routerConfig: router,
      theme: theme.toApproximateMaterialTheme(),
      supportedLocales: FLocalizations.supportedLocales,
      localizationsDelegates: const [
        ...FLocalizations.localizationsDelegates,
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      builder: (_, child) => FTheme(
        data: theme,
        child: FToaster(
          child: FTooltipGroup(child: child ?? const SizedBox.shrink()),
        ),
      ),
    );
  }
}
