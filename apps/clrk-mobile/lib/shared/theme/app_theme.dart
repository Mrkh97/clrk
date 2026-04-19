import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppColors {
  static const background = Color(0xFF101113);
  static const backgroundElevated = Color(0xFF17181C);
  static const surface = Color(0xCC1B1C22);
  static const surfaceHeavy = Color(0xE6191A20);
  static const surfaceSoft = Color(0x991B1C22);
  static const border = Color(0x33FFFFFF);
  static const borderStrong = Color(0x4DFFFFFF);
  static const foreground = Color(0xFFF7F7F5);
  static const mutedForeground = Color(0xFF9B9CA6);
  static const brand = Color(0xFFFF6B4A);
  static const brandSoft = Color(0x33FF6B4A);
  static const success = Color(0xFF67D1A1);
  static const warning = Color(0xFFF0B34C);
  static const error = Color(0xFFFF6E78);
}

class AppTheme {
  static ThemeData dark() {
    final base = ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      scaffoldBackgroundColor: AppColors.background,
      colorScheme: const ColorScheme.dark(
        primary: AppColors.brand,
        onPrimary: Color(0xFF130F0D),
        secondary: Color(0xFF23242B),
        onSecondary: AppColors.foreground,
        surface: AppColors.backgroundElevated,
        onSurface: AppColors.foreground,
        error: AppColors.error,
        onError: AppColors.foreground,
      ),
    );

    final textTheme = GoogleFonts.manropeTextTheme(base.textTheme).copyWith(
      displayLarge: GoogleFonts.getFont(
        'Doto',
        fontSize: 40,
        fontWeight: FontWeight.w700,
        color: AppColors.foreground,
        letterSpacing: -1.2,
      ),
      displayMedium: GoogleFonts.getFont(
        'Doto',
        fontSize: 32,
        fontWeight: FontWeight.w700,
        color: AppColors.foreground,
        letterSpacing: -0.8,
      ),
      headlineLarge: GoogleFonts.manrope(
        fontSize: 28,
        fontWeight: FontWeight.w700,
        color: AppColors.foreground,
      ),
      headlineMedium: GoogleFonts.manrope(
        fontSize: 22,
        fontWeight: FontWeight.w700,
        color: AppColors.foreground,
      ),
      titleLarge: GoogleFonts.manrope(
        fontSize: 18,
        fontWeight: FontWeight.w700,
        color: AppColors.foreground,
      ),
      titleMedium: GoogleFonts.manrope(
        fontSize: 16,
        fontWeight: FontWeight.w600,
        color: AppColors.foreground,
      ),
      bodyLarge: GoogleFonts.manrope(
        fontSize: 16,
        fontWeight: FontWeight.w500,
        color: AppColors.foreground,
        height: 1.4,
      ),
      bodyMedium: GoogleFonts.manrope(
        fontSize: 14,
        fontWeight: FontWeight.w500,
        color: AppColors.foreground,
        height: 1.45,
      ),
      bodySmall: GoogleFonts.manrope(
        fontSize: 12,
        fontWeight: FontWeight.w500,
        color: AppColors.mutedForeground,
        height: 1.45,
      ),
      labelLarge: GoogleFonts.spaceMono(
        fontSize: 11,
        fontWeight: FontWeight.w700,
        color: AppColors.foreground,
        letterSpacing: 1.8,
      ),
      labelMedium: GoogleFonts.spaceMono(
        fontSize: 10,
        fontWeight: FontWeight.w700,
        color: AppColors.mutedForeground,
        letterSpacing: 1.8,
      ),
      labelSmall: GoogleFonts.spaceMono(
        fontSize: 9,
        fontWeight: FontWeight.w700,
        color: AppColors.mutedForeground,
        letterSpacing: 1.5,
      ),
    );

    return base.copyWith(
      textTheme: textTheme,
      dividerColor: AppColors.border,
      cardColor: AppColors.surface,
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: AppColors.surfaceSoft,
        hintStyle: textTheme.bodyMedium?.copyWith(color: AppColors.mutedForeground),
        labelStyle: textTheme.labelMedium,
        enabledBorder: _outlineBorder(AppColors.border),
        focusedBorder: _outlineBorder(AppColors.brand),
        errorBorder: _outlineBorder(AppColors.error),
        focusedErrorBorder: _outlineBorder(AppColors.error),
        contentPadding: const EdgeInsets.symmetric(horizontal: 18, vertical: 18),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.brand,
          foregroundColor: const Color(0xFF1A1613),
          minimumSize: const Size.fromHeight(54),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(999)),
          textStyle: GoogleFonts.spaceMono(
            fontSize: 11,
            fontWeight: FontWeight.w700,
            letterSpacing: 1.8,
          ),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          minimumSize: const Size.fromHeight(54),
          side: const BorderSide(color: AppColors.borderStrong),
          foregroundColor: AppColors.foreground,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(999)),
          textStyle: GoogleFonts.spaceMono(
            fontSize: 11,
            fontWeight: FontWeight.w700,
            letterSpacing: 1.6,
          ),
        ),
      ),
      textButtonTheme: TextButtonThemeData(
        style: TextButton.styleFrom(
          foregroundColor: AppColors.foreground,
          textStyle: GoogleFonts.spaceMono(
            fontSize: 11,
            fontWeight: FontWeight.w700,
            letterSpacing: 1.4,
          ),
        ),
      ),
      iconTheme: const IconThemeData(color: AppColors.foreground),
    );
  }

  static BoxDecoration glassPanel({bool heavy = false, BorderRadius? radius}) {
    return BoxDecoration(
      borderRadius: radius ?? BorderRadius.circular(28),
      gradient: LinearGradient(
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
        colors: heavy
            ? const [Color(0xE61B1C22), Color(0xCC111216)]
            : const [Color(0xCC1E2026), Color(0x99131418)],
      ),
      border: Border.all(
        color: heavy ? AppColors.borderStrong : AppColors.border,
      ),
      boxShadow: const [
        BoxShadow(
          color: Color(0x66000000),
          blurRadius: 28,
          offset: Offset(0, 16),
        ),
      ],
    );
  }

  static BoxDecoration softPanel({BorderRadius? radius}) {
    return BoxDecoration(
      color: AppColors.surfaceSoft,
      borderRadius: radius ?? BorderRadius.circular(24),
      border: Border.all(color: AppColors.border),
    );
  }

  static LinearGradient backgroundGradient() {
    return const LinearGradient(
      begin: Alignment.topLeft,
      end: Alignment.bottomRight,
      colors: [
        Color(0xFF111216),
        Color(0xFF0A0B0D),
        Color(0xFF15161B),
      ],
      stops: [0, 0.45, 1],
    );
  }

  static TextStyle monoLabel(BuildContext context, {Color? color}) {
    return Theme.of(context)
            .textTheme
            .labelMedium
            ?.copyWith(color: color ?? AppColors.mutedForeground) ??
        GoogleFonts.spaceMono(
          fontSize: 10,
          fontWeight: FontWeight.w700,
          color: color ?? AppColors.mutedForeground,
          letterSpacing: 1.8,
        );
  }
}

OutlineInputBorder _outlineBorder(Color color) {
  return OutlineInputBorder(
    borderRadius: BorderRadius.circular(24),
    borderSide: BorderSide(color: color, width: 1.1),
  );
}
