'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Logo from '@/components/shared/Logo';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { adminLogin } from '@/lib/api/admin';
import { loginSchema, type LoginInput } from '@/lib/validations';
import { Spinner } from '@/components/ui';
import { cn } from '@/lib/utils';

export default function AdminLoginPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const token = useAuthStore((s) => s.token);
  const setAuth = useAuthStore((s) => s.setAuth);

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Redirect already-authenticated admins away from login
  useEffect(() => {
    if (token && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [token, isAuthenticated, router]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setServerError(null);
    try {
      const result = await adminLogin(data.email, data.password);
      setAuth(result.token, result.admin);
      router.replace('/dashboard');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign in failed. Please try again.';
      setServerError(message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-surface">
      {/* Brand */}
      <div className="mb-8 flex flex-col items-center">
        <Logo size="xl" className="mb-3" />
        <span className="text-xs font-semibold tracking-widest text-primary uppercase">
          Admin Portal
        </span>
      </div>

      {/* Login card */}
      <div
        data-testid="login-card"
        className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-border p-6"
      >
        <h2 className="text-lg font-semibold text-foreground mb-1">Administrator Sign In</h2>
        <p className="text-foreground-secondary text-sm mb-6">
          Restricted access — authorised personnel only
        </p>

        {/* Server error */}
        {serverError && (
          <div
            data-testid="login-error"
            role="alert"
            className="mb-4 flex items-start gap-2 rounded-lg bg-error-light px-3 py-2.5 text-sm text-error"
          >
            <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        <form
          data-testid="login-form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-4"
        >
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
              Email
            </label>
            <input
              {...register('email')}
              id="email"
              type="email"
              autoComplete="email"
              placeholder="admin@corpers-connect.ng"
              data-testid="email-input"
              className={cn(
                'w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors',
                errors.email ? 'border-error' : 'border-border'
              )}
            />
            {errors.email && (
              <p data-testid="email-error" className="mt-1 text-xs text-error">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
              Password
            </label>
            <div className="relative">
              <input
                {...register('password')}
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Enter your password"
                data-testid="password-input"
                className={cn(
                  'w-full border rounded-lg px-3 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors',
                  errors.password ? 'border-error' : 'border-border'
                )}
              />
              <button
                type="button"
                data-testid="password-toggle"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-secondary hover:text-foreground transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <p data-testid="password-error" className="mt-1 text-xs text-error">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            data-testid="submit-button"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
          >
            {isSubmitting ? (
              <>
                <Spinner size="sm" centered={false} />
                Signing in…
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
      </div>

      <p className="mt-8 text-xs text-foreground-secondary">
        © {new Date().getFullYear()} Corpers Connect Admin
      </p>
    </div>
  );
}
