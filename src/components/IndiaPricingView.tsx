import React, { useState } from 'react';
import { 
  Check, 
  ShieldCheck, 
  Smartphone, 
  CreditCard, 
  Building2, 
  HelpCircle, 
  Sparkles,
  Award,
  Zap,
  FileCheck
} from 'lucide-react';

interface IndiaPricingViewProps {
  onSelectTier: (title: string, amount: number) => void;
  isProUser: boolean;
}

export const IndiaPricingView: React.FC<IndiaPricingViewProps> = ({
  onSelectTier,
  isProUser,
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const plans = [
    {
      id: 'starter',
      name: 'ATHLETE STARTER',
      subtitle: 'Basic logging & standard telemetry',
      price: 0,
      priceLabel: 'FREE FOREVER',
      features: [
        'Sync up to 2 gadgets (Garmin & Strava)',
        'Basic weekly mileage & heart rate zones',
        'Standard activity feed & GPX export',
        'Community race leaderboards',
      ],
      isCurrent: !isProUser,
      ctaLabel: 'CURRENT FREE PLAN',
      isPopular: false,
    },
    {
      id: 'pro',
      name: 'ONWRD PRO ATHLETE',
      subtitle: 'For serious marathoners, triathletes & cyclists',
      price: billingCycle === 'monthly' ? 699 : 5999,
      priceLabel: billingCycle === 'monthly' ? '₹699 / month' : '₹5,999 / year (Save 28%)',
      periodNote: billingCycle === 'annual' ? 'Equivalent to ₹499/mo' : 'Cancel anytime',
      features: [
        'Unlimited gadget sync (Garmin, Coros, Wahoo, Apple)',
        'Full TrainingPeaks-style PMC (CTL, ATL, TSB Form)',
        'Direct 1-click structured workout push to your watch',
        'Indian elevation & humidity pacing calculators',
        'Aerobic decoupling & HR drift analytics',
        'Instant UPI & RuPay recurring or one-time payment',
        'Official 18% GST tax invoice for reimbursement',
      ],
      isCurrent: isProUser,
      ctaLabel: isProUser ? 'ACTIVE PRO ATHLETE' : 'ACTIVATE VIA UPI / RUPAY',
      isPopular: true,
    },
    {
      id: 'elite',
      name: 'COACH & SQUAD ELITE',
      subtitle: 'For running clubs & multi-sport coaches',
      price: billingCycle === 'monthly' ? 1499 : 14999,
      priceLabel: billingCycle === 'monthly' ? '₹1,499 / month' : '₹14,999 / year',
      periodNote: 'Includes up to 15 athlete roster',
      features: [
        'Everything in Onwrd Pro for up to 15 athletes',
        'Squad PMC overview & team readiness dashboard',
        'Automated workout compliance tracking',
        'Dedicated coach WhatsApp support desk',
        'Whitelabel club branding for Indian races',
      ],
      isCurrent: false,
      ctaLabel: 'ACTIVATE COACH SQUAD',
      isPopular: false,
    },
  ];

  return (
    <div className="space-y-12 animate-fade-in">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4 pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF5500]/10 border border-[#FF5500]/30 text-[#FF5500] text-xs font-mono font-bold uppercase">
          <ShieldCheck className="w-4 h-4" />
          <span>INDIAN ENDURANCE ATHLETE PASS</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-heading font-extrabold text-white tracking-wide">
          TRANSPARENT INR PRICING & INSTANT UPI
        </h1>
        <p className="text-zinc-400 text-sm sm:text-base">
          Power your journey to the Tata Mumbai Marathon, Ironman Goa 70.3, or Tour of Nilgiris with elite endurance analytics. No foreign card transaction markups.
        </p>

        {/* Monthly vs Annual Toggle */}
        <div className="inline-flex items-center p-1.5 rounded-xl bg-[#121217] border border-zinc-800 text-xs font-mono font-semibold">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-2 rounded-lg transition-all ${
              billingCycle === 'monthly'
                ? 'bg-[#FF5500] text-black font-bold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setBillingCycle('annual')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
              billingCycle === 'annual'
                ? 'bg-[#FF5500] text-black font-bold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <span>Annual (Save 28%)</span>
            <span className="px-1.5 py-0.5 rounded bg-black/40 text-[10px] text-amber-300">BEST VALUE</span>
          </button>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`rounded-2xl p-6 flex flex-col justify-between transition-all ${
              plan.isPopular
                ? 'bg-gradient-to-b from-[#181824] to-[#121217] border-2 border-[#FF5500] shadow-[0_0_30px_rgba(255,85,0,0.15)] relative'
                : 'bg-[#121217] border border-zinc-800'
            }`}
          >
            {plan.isPopular && (
              <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 px-3.5 py-1 rounded-full bg-[#FF5500] text-black font-heading font-black text-xs uppercase tracking-wider shadow-md">
                MOST POPULAR FOR ATHLETES
              </div>
            )}

            <div>
              <div className="mb-4">
                <h3 className="text-xl font-heading font-extrabold text-white">{plan.name}</h3>
                <p className="text-xs text-zinc-400 mt-1">{plan.subtitle}</p>
              </div>

              <div className="py-4 border-y border-zinc-800/80 mb-6">
                <div className="text-3xl sm:text-4xl font-heading font-extrabold text-white">
                  {plan.price === 0 ? 'FREE' : `₹${plan.price.toLocaleString('en-IN')}`}
                </div>
                <div className="text-xs font-mono text-zinc-400 mt-0.5">
                  {plan.priceLabel} {plan.price > 0 && <span>&middot; {plan.periodNote}</span>}
                </div>
              </div>

              {/* Feature Checklist */}
              <div className="space-y-2.5">
                {plan.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-zinc-300">
                    <Check className="w-4 h-4 text-[#FF5500] flex-shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-zinc-800/50">
              {plan.isCurrent ? (
                <button
                  disabled
                  className="w-full py-3 rounded-xl bg-zinc-800 text-zinc-400 text-xs font-mono font-bold tracking-wider cursor-default"
                >
                  {plan.ctaLabel}
                </button>
              ) : (
                <button
                  onClick={() => onSelectTier(plan.name, plan.price)}
                  className={`w-full py-3 rounded-xl font-heading font-extrabold text-sm uppercase tracking-wider transition-all cursor-pointer ${
                    plan.isPopular
                      ? 'bg-[#FF5500] hover:bg-[#FF6600] text-black orange-glow-sm'
                      : 'bg-[#1C1C26] hover:bg-[#FF5500] hover:text-black text-white border border-zinc-700'
                  }`}
                >
                  {plan.ctaLabel}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Indian Payment Infrastructure Trust Strip */}
      <div className="bg-[#0F0F14] border border-zinc-800 rounded-2xl p-6 sm:p-8 max-w-6xl mx-auto">
        <h3 className="text-lg font-heading font-bold text-white text-center mb-6">
          ENGINEERED FOR SEAMLESS INDIAN TRANSACTIONS
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="p-4 bg-[#14141C] rounded-xl border border-zinc-850 space-y-2">
            <Smartphone className="w-7 h-7 text-[#FF5500] mx-auto" />
            <h4 className="text-sm font-bold text-white">Instant UPI & QR Code</h4>
            <p className="text-xs text-zinc-400">
              Pay via Google Pay, PhonePe, Paytm, BHIM, or scan dynamic UPI QR code with zero convenience fees.
            </p>
          </div>

          <div className="p-4 bg-[#14141C] rounded-xl border border-zinc-850 space-y-2">
            <CreditCard className="w-7 h-7 text-[#FF5500] mx-auto" />
            <h4 className="text-sm font-bold text-white">RuPay & Domestic Cards</h4>
            <p className="text-xs text-zinc-400">
              Full support for National Payments Corporation of India (NPCI) RuPay debit & credit cards with 3D Secure OTP.
            </p>
          </div>

          <div className="p-4 bg-[#14141C] rounded-xl border border-zinc-850 space-y-2">
            <FileCheck className="w-7 h-7 text-[#FF5500] mx-auto" />
            <h4 className="text-sm font-bold text-white">GST Invoicing & Input Credit</h4>
            <p className="text-xs text-zinc-400">
              Automatic itemized GST invoice with SAC code 998431 for corporate athletic reimbursement or club write-offs.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
