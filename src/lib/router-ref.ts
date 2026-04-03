/**
 * Singleton router reference — lets non-component code (API client interceptors)
 * do client-side navigation without importing `useRouter` directly.
 *
 * Usage:
 *   1. Call `setRouterRef(router)` once from the root Providers component.
 *   2. Call `routerRef.push('/path')` anywhere else.
 */
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

let _router: AppRouterInstance | null = null;

export function setRouterRef(router: AppRouterInstance) {
  _router = router;
}

export function routerPush(path: string) {
  if (_router) {
    _router.push(path);
  } else {
    // Fallback before the router is registered (e.g. very early SSR edge case)
    if (typeof window !== 'undefined') window.location.href = path;
  }
}
