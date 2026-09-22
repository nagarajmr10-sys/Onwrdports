import React, { useState, useEffect } from 'react';
import { Navbar, NavTabType } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { TrainingPlans } from './components/TrainingPlans';
import { AutomatedPlanGenerator } from './components/AutomatedPlanGenerator';
import { GadgetSync } from './components/GadgetSync';
import { ActivitiesView } from './components/ActivitiesView';
import { IndiaPricingView } from './components/IndiaPricingView';
import { IndiaPaymentModal } from './components/IndiaPaymentModal';
import { ActivityDetailModal } from './components/ActivityDetailModal';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';
import { 
  INITIAL_ATHLETE, 
  INITIAL_PMC_DATA, 
  INITIAL_ACTIVITIES, 
  INITIAL_TRAINING_PLANS, 
  INITIAL_GADGETS, 
  INITIAL_HR_ZONES, 
  WEEKLY_VOLUME_DATA, 
  TODAY_SCHEDULED_WORKOUT,
  WEEKLY_RESTING_HR_DATA 
} from './data/mockSportsData';
import { 
  Activity, 
  TrainingPlan, 
  GadgetConnection, 
  AthleteProfile,
  Workout 
} from './types';
import { CheckCircle2, RotateCw } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTabType>('dashboard');
  const [athlete, setAthlete] = useState<AthleteProfile>(() => {
    const saved = localStorage.getItem('onwrd_athlete_profile') || localStorage.getItem('onward_athlete_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_ATHLETE;
      }
    }
    return INITIAL_ATHLETE;
  });

  const [activities, setActivities] = useState<Activity[]>(INITIAL_ACTIVITIES);
  const [plans, setPlans] = useState<TrainingPlan[]>(INITIAL_TRAINING_PLANS);
  const [gadgets, setGadgets] = useState<GadgetConnection[]>(INITIAL_GADGETS);
  const [pmcData, setPmcData] = useState(INITIAL_PMC_DATA);
  const [todayWorkout, setTodayWorkout] = useState<Workout>(TODAY_SCHEDULED_WORKOUT);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  // Payment state
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentPlanTitle, setPaymentPlanTitle] = useState('Onwrd Pro Athlete Membership');
  const [paymentAmountInr, setPaymentAmountInr] = useState(699);
  const [isProUser, setIsProUser] = useState(false);

  // Auth state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Sync state
  const [isSyncing, setIsSyncing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Quick Sync Handler
  const handleQuickSync = () => {
    setIsSyncing(true);
    showToast('Connecting to Garmin Connect & Strava API...');

    setTimeout(() => {
      setIsSyncing(false);
      setGadgets((prev) =>
        prev.map((g) =>
          g.connected
            ? { ...g, lastSync: 'Just now', syncHistoryCount: g.syncHistoryCount + 1 }
            : g
        )
      );
      showToast('All connected gadgets synchronized successfully!');
    }, 1800);
  };

  // Toggle gadget connection
  const handleToggleGadget = (id: string) => {
    setGadgets((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          const newStatus = !g.connected;
          showToast(`${g.brand} ${newStatus ? 'connected successfully' : 'disconnected'}.`);
          return {
            ...g,
            connected: newStatus,
            lastSync: newStatus ? 'Just now' : 'Not paired',
          };
        }
        return g;
      })
    );
  };

  // Import FIT file
  const handleImportFitActivity = (newAct: Activity) => {
    setActivities((prev) => [newAct, ...prev]);
    setAthlete((prev) => ({
      ...prev,
      weeklyCompletedKm: Math.round((prev.weeklyCompletedKm + newAct.distanceKm) * 10) / 10,
    }));
    showToast(`Imported ${newAct.title} (${newAct.distanceKm} km) into your athlete log!`);
  };

  // Push workout to watch
  const handlePushToWatch = (workoutTitle: string) => {
    showToast(`Workout "${workoutTitle}" sent to Garmin Edge & Forerunner!`);
  };

  // Open payment for specific plan
  const handleSelectPlanToBuy = (plan: TrainingPlan) => {
    setPaymentPlanTitle(plan.title);
    setPaymentAmountInr(plan.priceInr);
    setIsPaymentModalOpen(true);
  };

  // Open payment for general Pro upgrade
  const handleOpenUpgradeModal = () => {
    setPaymentPlanTitle('Onwrd Pro Athlete Membership (Monthly)');
    setPaymentAmountInr(699);
    setIsPaymentModalOpen(true);
  };

  // Select tier from pricing page
  const handleSelectTier = (title: string, amount: number) => {
    setPaymentPlanTitle(title);
    setPaymentAmountInr(amount);
    setIsPaymentModalOpen(true);
  };

  // Successful payment callback
  const handlePaymentSuccess = (orderId: string, title: string, amount: number) => {
    setIsProUser(true);
    // Mark matching plan as enrolled if relevant
    setPlans((prev) =>
      prev.map((p) => (p.title === title ? { ...p, isEnrolled: true } : p))
    );
    showToast(`Payment of ₹${amount} confirmed! (${orderId}) Welcome to Onwrd Pro.`);
  };

  // Applying mathematical plan
  const handleApplyGeneratedPlan = (generatedPlan: any, newTodayWorkout: Workout) => {
    setTodayWorkout(newTodayWorkout);
    // Update athlete VO2max to match the mathematical VDOT
    setAthlete((prev) => {
      const updated = {
        ...prev,
        vo2Max: Math.round(generatedPlan.vdot),
      };
      localStorage.setItem('onwrd_athlete_profile', JSON.stringify(updated));
      return updated;
    });
    showToast(`Active plan updated: "${generatedPlan.title}" applied to your Garmin schedule!`);
    // Navigate to dashboard to see active workout
    setActiveTab('dashboard');
  };

  // Auth login callback
  const handleLoginSuccess = (newAthlete: AthleteProfile) => {
    setAthlete(newAthlete);
    localStorage.setItem('onwrd_athlete_profile', JSON.stringify(newAthlete));
    showToast(`Welcome ${newAthlete.name}! Profile calibrated (VDOT ${newAthlete.vo2Max}).`);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-[#EDEDED] flex flex-col font-sans carbon-grid">
      
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        athlete={athlete}
        isSyncing={isSyncing}
        onQuickSync={handleQuickSync}
        onOpenUpgradeModal={handleOpenUpgradeModal}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        isProUser={isProUser}
      />

      {/* Floating Status Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#161622] border border-[#FF5500] text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-fade-in font-mono text-xs orange-glow-sm">
          <CheckCircle2 className="w-4 h-4 text-[#FF5500] flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main View Area */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <Dashboard
            athlete={athlete}
            pmcData={pmcData}
            activities={activities}
            todayWorkout={todayWorkout}
            hrZones={INITIAL_HR_ZONES}
            weeklyVolume={WEEKLY_VOLUME_DATA}
            restingHrData={WEEKLY_RESTING_HR_DATA}
            onSelectActivity={(act) => setSelectedActivity(act)}
            onNavigateToPlans={() => setActiveTab('math_plans')}
            onNavigateToGadgets={() => setActiveTab('gadgets')}
            onOpenUpgradeModal={handleOpenUpgradeModal}
            isProUser={isProUser}
          />
        )}

        {activeTab === 'math_plans' && (
          <AutomatedPlanGenerator
            onApplyGeneratedPlan={handleApplyGeneratedPlan}
            athleteAge={32}
            initialVdot={athlete.vo2Max}
          />
        )}

        {activeTab === 'plans' && (
          <TrainingPlans
            plans={plans}
            onSelectPlanToBuy={handleSelectPlanToBuy}
            onPushToWatch={handlePushToWatch}
          />
        )}

        {activeTab === 'gadgets' && (
          <GadgetSync
            gadgets={gadgets}
            onToggleGadget={handleToggleGadget}
            onSyncAll={handleQuickSync}
            isSyncing={isSyncing}
            onImportFitActivity={handleImportFitActivity}
          />
        )}

        {activeTab === 'activities' && (
          <ActivitiesView
            activities={activities}
            onSelectActivity={(act) => setSelectedActivity(act)}
            onNavigateToGadgets={() => setActiveTab('gadgets')}
          />
        )}

        {activeTab === 'pricing' && (
          <IndiaPricingView
            onSelectTier={handleSelectTier}
            isProUser={isProUser}
          />
        )}
      </main>

      {/* Activity Details Modal */}
      <ActivityDetailModal
        activity={selectedActivity}
        onClose={() => setSelectedActivity(null)}
      />

      {/* Indian Payment Gateway Modal (UPI, RuPay, Netbanking) */}
      <IndiaPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        planTitle={paymentPlanTitle}
        amountInr={paymentAmountInr}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Athlete Authentication & Onboarding Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        currentAthlete={athlete}
      />

      {/* Footer */}
      <Footer onNavigate={(tab) => setActiveTab(tab)} />

    </div>
  );
}
