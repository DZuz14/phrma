import { useEffect, useRef } from 'react';
import { PrescriptionCabinet } from './PrescriptionCabinet';
import { PrescriptionFilters } from './PrescriptionFilters';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import {
  PrescriptionsProvider,
  usePrescriptions,
} from './context/PrescriptionsContext';

/**
 * PrescriptionsContent Component
 * Displays a cabinet-like layout of prescription bottles
 * with detail view capabilities and filters
 */
const PrescriptionsContent: React.FC = () => {
  const { prescriptions } = usePrescriptions();
  const toastShownRef = useRef(false);

  // Show toast if there are any prescriptions with less than 5 units remaining
  useEffect(() => {
    if (toastShownRef.current) return;

    const lowQuantityMeds = prescriptions
      .filter((p) => p.quantity < 5 && p.active)
      .map((p) => `${p.name} (${p.quantity} remaining)`);

    if (lowQuantityMeds.length > 0) {
      toast.warning('Low Quantity Alert', {
        description: (
          <div className="mt-2">
            <p className="mb-2">The following medications are running low:</p>
            <ul className="list-disc pl-4 space-y-1">
              {lowQuantityMeds.map((med, index) => (
                <li key={index}>{med}</li>
              ))}
            </ul>
          </div>
        ),
        duration: Infinity,
        closeButton: true,
      });
      toastShownRef.current = true;
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-indigo-500 to-violet-600 p-6">
      <div className="max-w-4xl mx-auto">
        <PrescriptionFilters />
        <PrescriptionCabinet />
      </div>
      <Toaster />
    </div>
  );
};

/**
 * Prescriptions Component
 * Maintains prescription state and provides context
 * to child components
 */
export const Prescriptions: React.FC = () => {
  return (
    <PrescriptionsProvider>
      <PrescriptionsContent />
    </PrescriptionsProvider>
  );
};
