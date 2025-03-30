import React, { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { Prescription } from './prescriptions.types';
import { PrescriptionBottle } from './PrescriptionBottle';
import { PrescriptionDialog } from './PrescriptionDialog';
import { chunk, getChunkSize } from '@/lib/utils';
import { useWindowSize } from '@/hooks/useWindowSize';
import { usePrescriptions } from './context/PrescriptionsContext';

/**
 * Prescription Cabinet Component
 * Displays a cabinet-like layout of prescription bottles
 * with detail view capabilities
 */
export const PrescriptionCabinet: React.FC = () => {
  const [selectedPrescription, setSelectedPrescription] =
    useState<Prescription | null>(null);
  const [width] = useWindowSize();
  const { prescriptions, setPrescriptions } = usePrescriptions();

  /**
   * Remove a prescription from the cabinet
   * @param id - The ID of the prescription to remove
   */
  const handleRemove = useCallback(
    (id: string) => {
      const prescription = prescriptions.find((p) => p.id === id);
      setPrescriptions(prescriptions.filter((p) => p.id !== id));
      toast.success('Prescription deleted', {
        description: `${prescription?.name} has been removed from your cabinet`,
      });
    },
    [prescriptions, setPrescriptions]
  );

  return (
    <div
      className="bg-amber-50/95 backdrop-blur-sm rounded-xl shadow-2xl pb-6 pt-10
      border-4 border-indigo-200
      shadow-[inset_0_2px_40px_rgba(0,0,0,0.05)]"
    >
      <div className="flex flex-col gap-16">
        {/* Prescription Bottles */}
        {chunk(prescriptions, getChunkSize(width)).map((row, rowIndex) => (
          <div key={rowIndex} className="relative">
            <div className="px-4 sm:px-6 lg:px-8">
              <div
                className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 
                gap-4 sm:gap-6 lg:gap-8 mb-0"
              >
                {/* Prescription Bottle */}
                {row.map((prescription) => (
                  <PrescriptionBottle
                    key={prescription.id}
                    name={prescription.name}
                    quantity={prescription.quantity}
                    dateFilled={prescription.dateFilled}
                    refills={prescription.refills}
                    onClick={() => setSelectedPrescription(prescription)}
                  />
                ))}
              </div>
            </div>
            {/* Shelf Divider */}
            <div className="absolute -bottom-6 left-0 right-0">
              <div className="h-2 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded-t shadow-lg" />
              <div className="h-4 bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 rounded-b-lg -mt-[1px]" />
            </div>
          </div>
        ))}
      </div>

      {/* Prescription Detail Modal */}
      {selectedPrescription && (
        <PrescriptionDialog
          prescription={selectedPrescription}
          onClose={() => setSelectedPrescription(null)}
          onDelete={handleRemove}
        />
      )}
    </div>
  );
};
