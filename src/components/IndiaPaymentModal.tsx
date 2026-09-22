import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  X, 
  ShieldCheck, 
  Smartphone, 
  CreditCard, 
  Building2, 
  QrCode, 
  CheckCircle, 
  Lock, 
  ArrowRight,
  Receipt,
  Download,
  AlertCircle
} from 'lucide-react';

interface IndiaPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  planTitle?: string;
  amountInr?: number;
  onPaymentSuccess: (orderId: string, planTitle: string, amount: number) => void;
}

export const IndiaPaymentModal: React.FC<IndiaPaymentModalProps> = ({
  isOpen,
  onClose,
  planTitle = 'Onwrd Pro Athlete Membership',
  amountInr = 699,
  onPaymentSuccess,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('athlete@okhdfcbank');
  const [selectedUpiApp, setSelectedUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'cred' | 'qr'>('qr');
  const [selectedBank, setSelectedBank] = useState('HDFC');
  
  // Card form state
  const [cardNumber, setCardNumber] = useState('5123 4567 8901 2345');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('884');
  const [cardName, setCardName] = useState('Nagaraj R');

  // Transaction state
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'otp' | 'success'>('idle');
  const [otpCode, setOtpCode] = useState('749201');
  const [orderId, setOrderId] = useState('');

  if (!isOpen) return null;

  // Calculate GST (18%: 9% CGST + 9% SGST)
  const basePrice = Math.round((amountInr / 1.18) * 100) / 100;
  const totalGst = Math.round((amountInr - basePrice) * 100) / 100;
  const cgst = Math.round((totalGst / 2) * 100) / 100;
  const sgst = Math.round((totalGst / 2) * 100) / 100;

  const handleStartPayment = () => {
    const generatedId = `ONW-IN-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderId(generatedId);
    setPaymentStatus('processing');

    if (selectedMethod === 'card') {
      setTimeout(() => {
        setPaymentStatus('otp');
      }, 1200);
    } else {
      // UPI or Netbanking processing simulation
      setTimeout(() => {
        completeSuccess(generatedId);
      }, 2000);
    }
  };

  const handleVerifyOtp = () => {
    setPaymentStatus('processing');
    setTimeout(() => {
      completeSuccess(orderId);
    }, 1400);
  };

  const completeSuccess = (id: string) => {
    setPaymentStatus('success');
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF5500', '#FF8800', '#FFFFFF', '#10B981'],
    });
    onPaymentSuccess(id, planTitle, amountInr);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0F0F14] border border-[#252530] rounded-2xl shadow-2xl overflow-hidden my-8">
        
        {/* Header Strip */}
        <div className="bg-gradient-to-r from-[#181822] via-[#14141A] to-[#181822] px-6 py-4 border-b border-[#252530] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#FF5500]/10 border border-[#FF5500]/40 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-[#FF5500]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading text-lg tracking-wider text-white font-bold">
                  SECURE INDIA PAYMENT GATEWAY
                </span>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  256-BIT ENCRYPTED
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-mono">
                UPI &middot; RuPay &middot; NetBanking &middot; GST Compliant
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-[#20202B] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {paymentStatus === 'success' ? (
          /* Success Screen */
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 bg-emerald-500/20 border-2 border-emerald-500 rounded-full flex items-center justify-center mx-auto text-emerald-400 animate-bounce">
              <CheckCircle className="w-9 h-9" />
            </div>

            <div>
              <span className="text-xs font-mono font-bold tracking-widest text-[#FF5500] uppercase">
                PAYMENT CONFIRMED
              </span>
              <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-white mt-1">
                YOU'RE ONWRD BOUND!
              </h2>
              <p className="text-zinc-400 text-sm mt-1 max-w-md mx-auto">
                Thank you for powering your endurance goals. Your membership has been activated and unlocked instantly.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="bg-[#15151D] border border-zinc-800 rounded-xl p-4 text-left max-w-md mx-auto font-mono text-xs space-y-2">
              <div className="flex justify-between text-zinc-400">
                <span>Order Reference:</span>
                <span className="text-white font-bold">{orderId}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Item:</span>
                <span className="text-zinc-200">{planTitle}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Paid via:</span>
                <span className="text-zinc-200 uppercase">{selectedMethod} (India)</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>GST (18% SAC 998431):</span>
                <span className="text-zinc-200">₹{totalGst}</span>
              </div>
              <div className="pt-2 border-t border-zinc-800 flex justify-between text-sm font-bold text-white">
                <span>Total Amount:</span>
                <span className="text-[#FF5500]">₹{amountInr.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  window.print();
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-zinc-700 bg-[#16161F] text-zinc-300 hover:text-white text-xs font-semibold font-mono transition-colors"
              >
                <Download className="w-4 h-4 text-zinc-400" />
                <span>SAVE GST INVOICE</span>
              </button>
              <button
                onClick={onClose}
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#FF5500] hover:bg-[#FF6600] text-black text-xs font-heading font-extrabold tracking-wider uppercase transition-all orange-glow-sm"
              >
                <span>OPEN ATHLETE DASHBOARD</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : paymentStatus === 'otp' ? (
          /* OTP Verification Step */
          <div className="p-8 text-center space-y-5 max-w-md mx-auto">
            <div className="w-12 h-12 rounded-xl bg-[#FF5500]/10 border border-[#FF5500]/30 text-[#FF5500] flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-heading font-bold text-white">BANK 3D-SECURE VERIFICATION</h3>
              <p className="text-xs text-zinc-400 mt-1 font-mono">
                Enter the One Time Password (OTP) sent to your mobile ending with <span className="text-zinc-200 font-bold">**3210</span>
              </p>
            </div>

            <div className="bg-[#15151D] border border-zinc-800 p-4 rounded-xl space-y-3">
              <div className="flex justify-between text-xs text-zinc-400 font-mono">
                <span>Merchant: Onwrd Sports India</span>
                <span className="text-white font-bold">₹{amountInr}</span>
              </div>
              <input
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                className="w-full text-center text-2xl tracking-[0.5em] font-mono py-2 bg-[#0C0C10] border border-zinc-700 rounded-lg text-[#FF5500] focus:outline-none focus:border-[#FF5500]"
              />
              <p className="text-[11px] text-zinc-500">Demo OTP prefilled for instantaneous sandbox testing.</p>
            </div>

            <button
              onClick={handleVerifyOtp}
              className="w-full py-3 rounded-lg bg-[#FF5500] hover:bg-[#FF6600] text-black font-heading font-bold tracking-wider text-sm uppercase transition-all orange-glow-sm"
            >
              CONFIRM OTP & PAY ₹{amountInr}
            </button>
          </div>
        ) : paymentStatus === 'processing' ? (
          /* Processing Screen */
          <div className="p-12 text-center space-y-6">
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-zinc-800 animate-pulse"></div>
              <div className="absolute inset-0 rounded-full border-4 border-[#FF5500] border-t-transparent animate-spin"></div>
            </div>
            <div>
              <h3 className="text-xl font-heading font-bold text-white">CONNECTING TO NPCI & BANK</h3>
              <p className="text-xs text-zinc-400 font-mono mt-1">
                Authenticating transaction with your Indian banking network...
              </p>
              <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded bg-[#16161F] text-zinc-400 text-xs font-mono">
                <Lock className="w-3.5 h-3.5 text-[#FF5500]" />
                <span>Order Reference: {orderId}</span>
              </div>
            </div>
          </div>
        ) : (
          /* Standard Checkout Form */
          <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Left Payment Method Chooser (5 cols) */}
            <div className="md:col-span-5 space-y-3">
              <p className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
                Select Indian Payment Mode
              </p>

              {/* UPI Tab */}
              <button
                type="button"
                onClick={() => setSelectedMethod('upi')}
                className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                  selectedMethod === 'upi'
                    ? 'bg-[#1D1D27] border-[#FF5500] shadow-[0_0_12px_rgba(255,85,0,0.15)]'
                    : 'bg-[#131319] border-zinc-800/80 hover:bg-[#181820]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${selectedMethod === 'upi' ? 'bg-[#FF5500] text-black' : 'bg-zinc-800 text-zinc-400'}`}>
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white flex items-center gap-1.5">
                      <span>UPI & QR Code</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#FF5500]/20 text-[#FF5500] font-mono">0% Fee</span>
                    </div>
                    <p className="text-[11px] text-zinc-400">GPay, PhonePe, Paytm, CRED</p>
                  </div>
                </div>
                <span className={`w-3.5 h-3.5 rounded-full border ${selectedMethod === 'upi' ? 'border-[#FF5500] bg-[#FF5500]' : 'border-zinc-700'}`} />
              </button>

              {/* RuPay & Debit/Credit Cards */}
              <button
                type="button"
                onClick={() => setSelectedMethod('card')}
                className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                  selectedMethod === 'card'
                    ? 'bg-[#1D1D27] border-[#FF5500] shadow-[0_0_12px_rgba(255,85,0,0.15)]'
                    : 'bg-[#131319] border-zinc-800/80 hover:bg-[#181820]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${selectedMethod === 'card' ? 'bg-[#FF5500] text-black' : 'bg-zinc-800 text-zinc-400'}`}>
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white flex items-center gap-1.5">
                      <span>RuPay & Cards</span>
                    </div>
                    <p className="text-[11px] text-zinc-400">Domestic & International</p>
                  </div>
                </div>
                <span className={`w-3.5 h-3.5 rounded-full border ${selectedMethod === 'card' ? 'border-[#FF5500] bg-[#FF5500]' : 'border-zinc-700'}`} />
              </button>

              {/* Net Banking */}
              <button
                type="button"
                onClick={() => setSelectedMethod('netbanking')}
                className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                  selectedMethod === 'netbanking'
                    ? 'bg-[#1D1D27] border-[#FF5500] shadow-[0_0_12px_rgba(255,85,0,0.15)]'
                    : 'bg-[#131319] border-zinc-800/80 hover:bg-[#181820]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${selectedMethod === 'netbanking' ? 'bg-[#FF5500] text-black' : 'bg-zinc-800 text-zinc-400'}`}>
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">Net Banking</div>
                    <p className="text-[11px] text-zinc-400">SBI, HDFC, ICICI, Axis</p>
                  </div>
                </div>
                <span className={`w-3.5 h-3.5 rounded-full border ${selectedMethod === 'netbanking' ? 'border-[#FF5500] bg-[#FF5500]' : 'border-zinc-700'}`} />
              </button>

              {/* Indian Compliance Notice */}
              <div className="p-3 rounded-lg bg-[#14141B] border border-zinc-800 text-[11px] text-zinc-400 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>RBI compliant tokenized payment. Recurring auto-debit supported via UPI Autopay.</span>
              </div>
            </div>

            {/* Right Form Body (7 cols) */}
            <div className="md:col-span-7 bg-[#13131A] border border-zinc-800 rounded-xl p-5 flex flex-col justify-between space-y-4">
              
              {/* UPI Tab Body */}
              {selectedMethod === 'upi' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-zinc-300 uppercase">Scan QR or Enter UPI VPA</span>
                    <span className="text-[10px] text-[#FF5500] font-mono">Instant confirmation</span>
                  </div>

                  {/* QR Code view toggle */}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedUpiApp('qr')}
                      className={`flex-1 py-1.5 text-xs font-semibold rounded border text-center font-mono ${
                        selectedUpiApp === 'qr'
                          ? 'bg-[#FF5500]/15 border-[#FF5500] text-[#FF5500]'
                          : 'bg-[#181822] border-zinc-800 text-zinc-400'
                      }`}
                    >
                      Dynamic UPI QR
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedUpiApp('gpay')}
                      className={`flex-1 py-1.5 text-xs font-semibold rounded border text-center font-mono ${
                        selectedUpiApp === 'gpay'
                          ? 'bg-[#FF5500]/15 border-[#FF5500] text-[#FF5500]'
                          : 'bg-[#181822] border-zinc-800 text-zinc-400'
                      }`}
                    >
                      UPI ID / VPA
                    </button>
                  </div>

                  {selectedUpiApp === 'qr' ? (
                    <div className="flex flex-col items-center justify-center p-4 bg-[#0B0B0E] border border-zinc-800 rounded-xl space-y-3">
                      {/* Stylized QR Code with Onwrd Brand Logo Center */}
                      <div className="relative p-2 bg-white rounded-lg shadow-md">
                        <svg viewBox="0 0 100 100" className="w-36 h-36">
                          {/* Corner alignment markers */}
                          <rect x="5" y="5" width="25" height="25" fill="#0A0A0C" />
                          <rect x="8" y="8" width="19" height="19" fill="#FFFFFF" />
                          <rect x="12" y="12" width="11" height="11" fill="#FF5500" />

                          <rect x="70" y="5" width="25" height="25" fill="#0A0A0C" />
                          <rect x="73" y="8" width="19" height="19" fill="#FFFFFF" />
                          <rect x="77" y="12" width="11" height="11" fill="#FF5500" />

                          <rect x="5" y="70" width="25" height="25" fill="#0A0A0C" />
                          <rect x="8" y="73" width="19" height="19" fill="#FFFFFF" />
                          <rect x="12" y="77" width="11" height="11" fill="#FF5500" />

                          {/* Data points */}
                          <rect x="36" y="8" width="8" height="6" fill="#141418" />
                          <rect x="48" y="10" width="6" height="8" fill="#141418" />
                          <rect x="58" y="8" width="6" height="6" fill="#141418" />

                          <rect x="10" y="36" width="6" height="8" fill="#141418" />
                          <rect x="22" y="38" width="8" height="6" fill="#141418" />
                          <rect x="36" y="36" width="28" height="28" fill="#141418" />
                          {/* Center brand mark */}
                          <rect x="42" y="42" width="16" height="16" rx="3" fill="#FF5500" />
                          <path d="M46 53L51 47L46 41H49L54 47L49 53H46Z" fill="#FFFFFF" />

                          <rect x="70" y="36" width="10" height="6" fill="#141418" />
                          <rect x="84" y="38" width="8" height="8" fill="#141418" />

                          <rect x="36" y="70" width="8" height="8" fill="#141418" />
                          <rect x="48" y="74" width="10" height="6" fill="#141418" />
                          <rect x="62" y="70" width="6" height="10" fill="#141418" />
                          <rect x="74" y="72" width="8" height="8" fill="#141418" />
                          <rect x="86" y="70" width="6" height="6" fill="#141418" />
                        </svg>
                      </div>
                      <div className="text-center font-mono">
                        <p className="text-xs text-white font-bold">Scan with GPay / PhonePe / Paytm</p>
                        <p className="text-[10px] text-zinc-400">UPI ID: onwrdsports@icici</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <label className="text-[11px] font-mono text-zinc-400 block mb-1">Enter Virtual Payment Address (VPA)</label>
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="e.g. yourname@upi"
                          className="w-full px-3 py-2 bg-[#0E0E12] border border-zinc-700 rounded-lg text-sm text-white font-mono focus:border-[#FF5500] focus:outline-none"
                        />
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {['@okhdfcbank', '@paytm', '@ybl', '@axl', '@ibl'].map((handle) => (
                          <button
                            key={handle}
                            type="button"
                            onClick={() => {
                              const prefix = upiId.split('@')[0] || 'athlete';
                              setUpiId(`${prefix}${handle}`);
                            }}
                            className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 hover:bg-[#FF5500]/20 hover:text-[#FF5500] font-mono transition-colors"
                          >
                            {handle}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* App quick icons */}
                  <div className="flex items-center justify-center gap-4 pt-1 opacity-70">
                    <span className="text-[10px] font-mono text-zinc-400">Supports:</span>
                    <span className="text-xs font-bold text-white">Google Pay</span>
                    <span className="text-xs font-bold text-purple-400">PhonePe</span>
                    <span className="text-xs font-bold text-sky-400">Paytm</span>
                    <span className="text-xs font-bold text-emerald-400">BHIM</span>
                  </div>
                </div>
              )}

              {/* Card Tab Body */}
              {selectedMethod === 'card' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-mono text-zinc-400">Card Number</label>
                    <span className="text-[10px] font-bold text-orange-400 font-mono">RuPay Supported</span>
                  </div>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0E0E12] border border-zinc-700 rounded-lg text-sm text-white font-mono focus:border-[#FF5500] focus:outline-none"
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-mono text-zinc-400 block mb-1">Expires (MM/YY)</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full px-3 py-2 bg-[#0E0E12] border border-zinc-700 rounded-lg text-sm text-white font-mono focus:border-[#FF5500] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-mono text-zinc-400 block mb-1">CVV / CVC</label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full px-3 py-2 bg-[#0E0E12] border border-zinc-700 rounded-lg text-sm text-white font-mono focus:border-[#FF5500] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-zinc-400 block mb-1">Cardholder Name</label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full px-3 py-2 bg-[#0E0E12] border border-zinc-700 rounded-lg text-sm text-white font-mono focus:border-[#FF5500] focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Netbanking Tab Body */}
              {selectedMethod === 'netbanking' && (
                <div className="space-y-3">
                  <label className="text-[11px] font-mono text-zinc-400 block">Popular Indian Banks</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Bank', 'Punjab National'].map((bank) => (
                      <button
                        key={bank}
                        type="button"
                        onClick={() => setSelectedBank(bank)}
                        className={`p-2 rounded-lg text-xs font-semibold border text-left transition-all ${
                          selectedBank === bank
                            ? 'bg-[#FF5500]/15 border-[#FF5500] text-white'
                            : 'bg-[#181822] border-zinc-800 text-zinc-400 hover:text-white'
                        }`}
                      >
                        {bank}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Cost Summary & Pay Button */}
              <div className="pt-3 border-t border-zinc-800/80 space-y-2">
                <div className="flex justify-between text-xs font-mono text-zinc-400">
                  <span>Plan:</span>
                  <span className="text-zinc-200">{planTitle}</span>
                </div>
                <div className="flex justify-between text-xs font-mono text-zinc-400">
                  <span>Base Fee:</span>
                  <span>₹{basePrice}</span>
                </div>
                <div className="flex justify-between text-xs font-mono text-zinc-400">
                  <span>18% GST (CGST 9% + SGST 9%):</span>
                  <span>₹{totalGst}</span>
                </div>
                <div className="flex justify-between text-sm font-bold font-mono text-white pt-1 border-t border-zinc-800">
                  <span>Total Payable:</span>
                  <span className="text-[#FF5500] text-base">₹{amountInr.toLocaleString('en-IN')}</span>
                </div>

                <button
                  type="button"
                  id="submit-payment-btn"
                  onClick={handleStartPayment}
                  className="w-full mt-2 py-3 rounded-xl bg-[#FF5500] hover:bg-[#FF6600] text-black font-heading font-extrabold text-base tracking-wider uppercase transition-all orange-glow flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  <span>PAY ₹{amountInr.toLocaleString('en-IN')} VIA {selectedMethod.toUpperCase()}</span>
                </button>
              </div>

            </div>

          </div>
        )}

        {/* Footer info strip */}
        <div className="bg-[#0C0C10] px-6 py-2.5 border-t border-[#20202A] text-center text-[11px] text-zinc-500 font-mono flex items-center justify-between">
          <span>ONWRD SPORTS TECH PVT LTD &middot; GSTIN: 29AABCO9984K1Z5</span>
          <span className="hidden sm:inline text-zinc-400">Bangalore, Karnataka 560001</span>
        </div>

      </div>
    </div>
  );
};
