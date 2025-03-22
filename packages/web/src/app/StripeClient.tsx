"use client";
import "client-only";

import React from "react";
import type { Stripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

export default function StripeClient({
  children,
  stripePromise
}: Readonly<{
  children: React.ReactNode;
  stripePromise: Promise<Stripe | null>;
}>) {
  const options = {
    clientSecret: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
}
