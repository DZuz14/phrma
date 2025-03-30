import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Prescription } from '../prescriptions.types';
import { initialPrescriptions } from '../data/mockPrescriptions';

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

  // Updates prescription while preserving immutability
  const updatePrescription = (id: string, updates: Partial<Prescription>) => {
    setPrescriptions((prevPrescriptions) =>
      prevPrescriptions.map((prescription) =>
        prescription.id === id ? { ...prescription, ...updates } : prescription
      )
    );
  };

  return (
    <PrescriptionsContext.Provider
      value={{
        prescriptions,
        setPrescriptions,
        updatePrescription,
      }}
    >
      {children}
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
