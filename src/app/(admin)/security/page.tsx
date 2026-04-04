'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { adminInitiate2FA, adminConfirm2FA, adminDisable2FA } from '@/lib/api/admin';
import { ShieldCheck, ShieldOff, QrCode, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Spinner } from '@/components/ui';
import Image from 'next/image';

type Step = 'idle' | 'setup-qr' | 'setup-confirm' | 'disable-confirm';

export default function SecurityPage() {
  const admin = useAuthStore((s) => s.admin);
  const setAuth = useAuthStore((s) => s.setAuth);
  const token = useAuthStore((s) => s.token);

  const [step, setStep] = useState<Step>('idle');
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const twoFactorEnabled = admin?.twoFactorEnabled ?? false;

  const resetState = () => {
    setStep('idle');
    setCode('');
    setError(null);
    setSuccess(null);
    setQrCode(null);
    setSecret(null);
  };

  const handleInitiateSetup = async () => {
    setError(null);
    setLoading(true);
    try {
      const data = await adminInitiate2FA();
      setQrCode(data.qrCode);
      setSecret(data.secret);
      setStep('setup-qr');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initiate 2FA setup');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await adminConfirm2FA(code.trim());
      // Update local admin state to reflect 2FA is now enabled
      if (admin && token) setAuth(token, { ...admin, twoFactorEnabled: true });
      setSuccess('Two-factor authentication has been enabled on your account.');
      resetState();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDisable = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await adminDisable2FA(code.trim());
      if (admin && token) setAuth(token, { ...admin, twoFactorEnabled: false });
      setSuccess('Two-factor authentication has been disabled.');
      resetState();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">Account Security</h1>
        <p className="text-sm text-foreground-secondary mt-1">
          Manage two-factor authentication for your admin account.
        </p>
      </div>

      {/* Status banner */}
      {success && (
        <div className="flex items-center gap-2 rounded-lg bg-success/10 px-4 py-3 text-sm text-success border border-success/20">
          <CheckCircle2 size={16} className="flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* 2FA Card */}
      <div className="bg-surface border border-border rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {twoFactorEnabled ? (
              <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-success" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center">
                <ShieldOff className="w-5 h-5 text-warning" />
              </div>
            )}
            <div>
              <p className="text-sm font-semibold text-foreground">
                Two-Factor Authentication
              </p>
              <p className="text-xs text-foreground-secondary">
                {twoFactorEnabled ? 'Enabled — your account is protected with TOTP' : 'Disabled — your account relies on password only'}
              </p>
            </div>
          </div>

          {step === 'idle' && (
            twoFactorEnabled ? (
              <button
                onClick={() => { setStep('disable-confirm'); setError(null); setSuccess(null); }}
                className="text-sm text-error hover:underline"
              >
                Disable
              </button>
            ) : (
              <button
                onClick={handleInitiateSetup}
                disabled={loading}
                className="flex items-center gap-1.5 text-sm bg-primary text-white px-3 py-1.5 rounded-lg hover:bg-primary/90 disabled:opacity-60"
              >
                {loading ? <Spinner size="sm" centered={false} /> : <QrCode size={14} />}
                Enable 2FA
              </button>
            )
          )}
        </div>

        {/* ── Setup step 1: QR code ── */}
        {step === 'setup-qr' && qrCode && secret && (
          <div className="border-t border-border pt-4 space-y-4">
            <p className="text-sm text-foreground-secondary">
              Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.), then enter the 6-digit code below to confirm.
            </p>
            <div className="flex justify-center">
              <Image src={qrCode} alt="2FA QR code" width={200} height={200} unoptimized />
            </div>
            <div className="text-center">
              <p className="text-xs text-foreground-muted mb-1">Or enter the secret key manually:</p>
              <code className="text-xs bg-surface-alt px-3 py-1 rounded font-mono break-all">
                {secret}
              </code>
            </div>
            <button
              onClick={() => setStep('setup-confirm')}
              className="w-full bg-primary text-white font-semibold py-2.5 rounded-lg hover:bg-primary/90 text-sm"
            >
              I&apos;ve scanned the code →
            </button>
            <button onClick={resetState} className="w-full text-sm text-foreground-secondary hover:text-foreground py-1">
              Cancel
            </button>
          </div>
        )}

        {/* ── Setup step 2: confirm code ── */}
        {step === 'setup-confirm' && (
          <form onSubmit={handleConfirmSetup} className="border-t border-border pt-4 space-y-4">
            <p className="text-sm text-foreground-secondary">
              Enter the 6-digit code from your authenticator app to activate 2FA.
            </p>
            {error && (
              <div className="flex items-start gap-2 rounded-lg bg-error-light px-3 py-2.5 text-sm text-error">
                <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="000000"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              className="w-full border border-border rounded-lg px-3 py-2.5 text-sm text-center font-mono tracking-[0.3em] focus:outline-none focus:ring-2 focus:ring-primary"
              autoFocus
            />
            <button
              type="submit"
              disabled={loading || code.length < 6}
              className="w-full flex items-center justify-center gap-2 bg-primary text-white font-semibold py-2.5 rounded-lg hover:bg-primary/90 disabled:opacity-60 text-sm"
            >
              {loading ? <Spinner size="sm" centered={false} /> : null}
              Activate 2FA
            </button>
            <button type="button" onClick={resetState} className="w-full text-sm text-foreground-secondary hover:text-foreground py-1">
              Cancel
            </button>
          </form>
        )}

        {/* ── Disable: confirm with current TOTP code ── */}
        {step === 'disable-confirm' && (
          <form onSubmit={handleDisable} className="border-t border-border pt-4 space-y-4">
            <p className="text-sm text-foreground-secondary">
              Enter your current 6-digit authenticator code to disable 2FA.
            </p>
            {error && (
              <div className="flex items-start gap-2 rounded-lg bg-error-light px-3 py-2.5 text-sm text-error">
                <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="000000"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              className="w-full border border-border rounded-lg px-3 py-2.5 text-sm text-center font-mono tracking-[0.3em] focus:outline-none focus:ring-2 focus:ring-primary"
              autoFocus
            />
            <button
              type="submit"
              disabled={loading || code.length < 6}
              className="w-full flex items-center justify-center gap-2 bg-error text-white font-semibold py-2.5 rounded-lg hover:bg-error/90 disabled:opacity-60 text-sm"
            >
              {loading ? <Spinner size="sm" centered={false} /> : null}
              Disable 2FA
            </button>
            <button type="button" onClick={resetState} className="w-full text-sm text-foreground-secondary hover:text-foreground py-1">
              Cancel
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
