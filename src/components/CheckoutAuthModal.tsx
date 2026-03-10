"use client";

import Link from "next/link";

interface CheckoutAuthModalProps {
  open: boolean;
  onClose: () => void;
}

const CALLBACK_URL = "/checkout";

export default function CheckoutAuthModal({ open, onClose }: CheckoutAuthModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      aria-modal="true"
      role="dialog"
      aria-labelledby="checkout-auth-title"
      onClick={onClose}
    >
      <div
        className="bg-bg rounded-lg shadow-xl max-w-md w-full p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-muted hover:text-text rounded focus:outline-none focus:ring-2 focus:ring-sage-2"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <h2 id="checkout-auth-title" className="font-sans text-xl font-semibold text-text pr-10">
          Sign in to checkout
        </h2>
        <p className="font-sans text-sm text-muted mt-2">
          Please sign in or create an account to proceed to checkout.
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <Link
            href={`/account/login?callbackUrl=${encodeURIComponent(CALLBACK_URL)}`}
            className="w-full inline-flex items-center justify-center gap-2 rounded-none bg-[#D0F198] text-[#2A2B2A] py-3.5 font-sans text-sm font-bold hover:opacity-90"
          >
            Sign in
          </Link>
          <Link
            href={`/account/register?callbackUrl=${encodeURIComponent(CALLBACK_URL)}`}
            className="w-full inline-flex items-center justify-center gap-2 rounded-none border border-border bg-bg text-text py-3.5 font-sans text-sm font-medium hover:bg-sage-1"
          >
            Create account
          </Link>
        </div>

        <p className="mt-4 font-sans text-xs text-muted text-center">
          New to Spinkit? Create an account to track orders and save addresses.
        </p>
      </div>
    </div>
  );
}
