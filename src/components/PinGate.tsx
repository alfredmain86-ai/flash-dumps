'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

const PIN_LENGTH = 8;
const COOKIE_NAME = 'flash_dumps_access';

function hasCookie(name: string): boolean {
  return document.cookie.split(';').some((c) => c.trim().startsWith(name + '='));
}

export default function PinGate({ children }: { children: React.ReactNode }) {
  const [locked, setLocked] = useState<boolean | null>(null);
  const [digits, setDigits] = useState<string[]>(Array(PIN_LENGTH).fill(''));
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    setLocked(!hasCookie(COOKIE_NAME));
  }, []);

  const submitPin = useCallback(async (pinDigits: string[]) => {
    const pin = pinDigits.join('');
    if (pin.length !== PIN_LENGTH) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/verify-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      });

      if (res.ok) {
        setLocked(false);
      } else {
        setError('Invalid PIN. Please try again.');
        setDigits(Array(PIN_LENGTH).fill(''));
        setTimeout(() => inputRefs.current[0]?.focus(), 50);
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newDigits = [...digits];

    if (value.length > 1) {
      // Handle paste
      const pasted = value.slice(0, PIN_LENGTH - index).split('');
      pasted.forEach((d, i) => {
        if (index + i < PIN_LENGTH) newDigits[index + i] = d;
      });
      setDigits(newDigits);
      const nextIndex = Math.min(index + pasted.length, PIN_LENGTH - 1);
      inputRefs.current[nextIndex]?.focus();

      if (newDigits.every((d) => d !== '')) {
        submitPin(newDigits);
      }
      return;
    }

    newDigits[index] = value;
    setDigits(newDigits);

    if (value && index < PIN_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (value && newDigits.every((d) => d !== '')) {
      submitPin(newDigits);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      const newDigits = [...digits];
      newDigits[index - 1] = '';
      setDigits(newDigits);
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'Enter') {
      submitPin(digits);
    }
  };

  // Still checking cookie
  if (locked === null) return null;

  // Unlocked
  if (!locked) return <>{children}</>;

  return (
    <>
      {/* Hidden content */}
      <div style={{ display: 'none' }}>{children}</div>

      {/* PIN overlay */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0F0F0F',
        }}
      >
        {/* Grain texture to match site */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.03,
            pointerEvents: 'none',
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
            backgroundRepeat: 'repeat',
            backgroundSize: '256px 256px',
          }}
        />

        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2rem',
            padding: '3rem 2rem',
            maxWidth: '480px',
            width: '100%',
          }}
        >
          {/* Logo */}
          <div
            style={{
              fontSize: '2rem',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              lineHeight: 1,
              fontFamily: 'var(--font-clash-display), Arial Black, sans-serif',
            }}
          >
            <span style={{ color: '#FF6B00' }}>FLASH</span>
            <span style={{ color: '#E8E4DF' }}> DUMPS</span>
          </div>

          {/* Subtitle */}
          <p
            style={{
              color: '#888',
              fontSize: '0.875rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            Enter access PIN
          </p>

          {/* PIN inputs */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {digits.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={PIN_LENGTH}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                autoFocus={i === 0}
                disabled={loading}
                aria-label={`PIN digit ${i + 1}`}
                style={{
                  width: '3rem',
                  height: '3.5rem',
                  textAlign: 'center',
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: '#E8E4DF',
                  background: 'rgba(255,255,255,0.05)',
                  border: `2px solid ${error ? '#EF4444' : digit ? '#FF6B00' : 'rgba(255,255,255,0.15)'}`,
                  borderRadius: '0.75rem',
                  outline: 'none',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                  caretColor: '#FF6B00',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#FF6B00';
                  e.target.style.boxShadow = '0 0 0 3px rgba(255,107,0,0.3)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = digit ? '#FF6B00' : 'rgba(255,255,255,0.15)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            ))}
          </div>

          {/* Error message */}
          {error && (
            <p
              style={{
                color: '#EF4444',
                fontSize: '0.875rem',
                fontWeight: 500,
              }}
            >
              {error}
            </p>
          )}

          {/* Enter button */}
          <button
            onClick={() => submitPin(digits)}
            disabled={loading || digits.some((d) => !d)}
            style={{
              width: '100%',
              maxWidth: '320px',
              padding: '0.875rem 2rem',
              fontSize: '1rem',
              fontWeight: 700,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              color: '#fff',
              background:
                loading || digits.some((d) => !d)
                  ? 'rgba(255,107,0,0.4)'
                  : '#FF6B00',
              border: 'none',
              borderRadius: '0.75rem',
              cursor:
                loading || digits.some((d) => !d) ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => {
              if (!loading && digits.every((d) => d)) {
                (e.target as HTMLButtonElement).style.background = '#E55F00';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading && digits.every((d) => d)) {
                (e.target as HTMLButtonElement).style.background = '#FF6B00';
              }
            }}
          >
            {loading ? 'Verifying...' : 'Enter'}
          </button>
        </div>
      </div>
    </>
  );
}
