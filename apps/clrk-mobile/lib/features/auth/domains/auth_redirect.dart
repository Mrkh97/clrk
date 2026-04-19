const defaultAuthenticatedRoute = '/dashboard';

const _disallowedPostAuthRoutes = {
  '/login',
  '/register',
};

String getSafeRedirectTarget(String? redirect) {
  if (redirect != null && redirect.startsWith('/') && !redirect.startsWith('//')) {
    final uri = Uri.tryParse(redirect);
    final path = uri?.path ?? redirect;

    if (_disallowedPostAuthRoutes.contains(path)) {
      return defaultAuthenticatedRoute;
    }

    return redirect;
  }

  return defaultAuthenticatedRoute;
}
