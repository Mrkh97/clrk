import 'package:hooks_riverpod/hooks_riverpod.dart';

import '../../../shared/utils/shared_preferences_provider.dart';

final onboardingControllerProvider =
    NotifierProvider<OnboardingController, bool>(OnboardingController.new);

class OnboardingController extends Notifier<bool> {
  static const _hasSeenIntroKey = 'has_seen_mobile_intro';

  @override
  bool build() {
    final sharedPreferences = ref.read(sharedPreferencesProvider);
    return sharedPreferences.getBool(_hasSeenIntroKey) ?? false;
  }

  Future<void> completeIntro() async {
    if (state) {
      return;
    }

    state = true;
    await ref.read(sharedPreferencesProvider).setBool(_hasSeenIntroKey, true);
  }
}
