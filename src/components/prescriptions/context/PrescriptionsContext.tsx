import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useRef,
} from 'react';
import { Prescription } from '../prescriptions.types';
import { initialPrescriptions } from '../data/mockPrescriptions';
import { toast } from 'sonner';
import { AlertCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/sonner';

/**
 * Context provides prescription data management with separate
 * original and filtered states to enable filter resets
 */
interface PrescriptionsContextType {
  prescriptions: Prescription[];
  setPrescriptions: (prescriptions: Prescription[]) => void;
  updatePrescription: (id: string, updates: Partial<Prescription>) => void;
}

/**
 * Create context with undefined default value
 * This allows components to check if they are within a provider
 */
const PrescriptionsContext = createContext<
  PrescriptionsContextType | undefined
>(undefined);

/**
 * Main provider component that maintains prescription state
 */
export const PrescriptionsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [prescriptions, setPrescriptions] =
    useState<Prescription[]>(initialPrescriptions);
  const toastShownRef = useRef(false);
  const hasCheckedRef = useRef(false);

  // Updates prescription while preserving immutability
  const updatePrescription = (id: string, updates: Partial<Prescription>) => {
    setPrescriptions((prevPrescriptions) =>
      prevPrescriptions.map((prescription) =>
        prescription.id === id ? { ...prescription, ...updates } : prescription
      )
    );
  };
  /**
   * Refill Warnings: Show toast if there are any prescriptions with less than 5 units remaining
   */
  useEffect(() => {
    // Don't run until prescriptions are loaded
    if (!prescriptions || prescriptions.length === 0 || hasCheckedRef.current)
      return;

    const lowQuantityMeds = prescriptions
      .filter((p) => p.quantity < 5 && p.active)
      .map((p) => `${p.name}: ${p.quantity}`);

    if (lowQuantityMeds.length > 0 && !toastShownRef.current) {
      toast.warning('Low Quantity Alert', {
        classNames: {
          title: 'text-lg pl-8',
          description: 'text-lg pl-4',
        },
        action: (
          <div className="absolute -top-2 -right-2">
            <Button
              size="icon"
              className="rounded-full bg-indigo-600 hover:bg-indigo-700 text-white"
              onClick={() => {
                toast.dismiss();
                toastShownRef.current = false;
              }}
            >
              <X className="w-8 h-8" />
            </Button>
          </div>
        ),
        icon: <AlertCircle className="w-8 h-8" />,
        description: (
          <div className="mt-2 tracking-wide text-lg">
            <ul className="list-decimal pl-8 space-y-2">
              {lowQuantityMeds.map((med, index) => (
                <li key={index}>{med}</li>
              ))}
            </ul>
          </div>
        ),
        duration: Infinity,
      });

      toastShownRef.current = true;
    }

    hasCheckedRef.current = true;
  }, [prescriptions]);

  return (
    <PrescriptionsContext.Provider
      value={{
        prescriptions,
        setPrescriptions,
        updatePrescription,
      }}
    >
      {children}
      <Toaster />
    </PrescriptionsContext.Provider>
  );
};

// Hook enforces usage within provider boundary
export const usePrescriptions = () => {
  const context = useContext(PrescriptionsContext);
  if (context === undefined) {
    throw new Error(
      'usePrescriptions must be used within a PrescriptionsProvider'
    );
  }
  return context;
};
