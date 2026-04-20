import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:flutter_native_splash/flutter_native_splash.dart';
import 'package:forui/forui.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'features/auth/usecases/auth_controller.dart';
import 'shared/routing/app_router_provider.dart';
import 'shared/theme/app_theme.dart';
import 'shared/utils/shared_preferences_provider.dart';

Future<void> main() async {
  final widgetsBinding = WidgetsFlutterBinding.ensureInitialized();
  FlutterNativeSplash.preserve(widgetsBinding: widgetsBinding);

  final sharedPreferences = await SharedPreferences.getInstance();
  final container = ProviderContainer(
    overrides: [sharedPreferencesProvider.overrideWithValue(sharedPreferences)],
  );

  try {
    await container.read(authControllerProvider.future);
  } catch (_) {
    // Let the app continue into normal routing/auth handling.
  }

  runApp(
    UncontrolledProviderScope(
      container: container,
      child: const ClrkMobileApp(),
    ),
  );
  FlutterNativeSplash.remove();
}

class ClrkMobileApp extends ConsumerWidget {
  const ClrkMobileApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = ref.watch(appRouterProvider);
    final foruiTheme = FThemes.neutral.dark.touch;
    final materialTheme = AppTheme.dark();

    return MaterialApp.router(
      title: 'Clrk Mobile',
      debugShowCheckedModeBanner: false,
      routerConfig: router,
      theme: materialTheme,
      supportedLocales: FLocalizations.supportedLocales,
      localizationsDelegates: const [
        ...FLocalizations.localizationsDelegates,
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      builder: (_, child) => FTheme(
        data: foruiTheme,
        child: FToaster(
          child: FTooltipGroup(child: child ?? const SizedBox.shrink()),
        ),
      ),
    );
  }
}
