import React, { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { Prescription } from './prescriptions.types';
import { PrescriptionBottle } from './PrescriptionBottle';
import { PrescriptionDialog } from './PrescriptionDialog';
import { usePrescriptions } from './context/PrescriptionsContext';

/**
 * Prescription Cabinet Component
 * Displays a cabinet-like layout of prescription bottles
 * with detail view capabilities
 */
export const PrescriptionCabinet: React.FC = () => {
  const [selectedPrescription, setSelectedPrescription] =
    useState<Prescription | null>(null);
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
      className="bg-amber-50/95 backdrop-blur-sm rounded-xl shadow-2xl pb-10 pt-10
      border-2 border-indigo-400
      shadow-[inset_0_2px_40px_rgba(0,0,0,0.05)]"
    >
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-16 sm:gap-x-6 lg:gap-x-8">
          {prescriptions.map((prescription) => (
            <div key={prescription.id}>
              <PrescriptionBottle
                name={prescription.name}
                quantity={prescription.quantity}
                dateFilled={prescription.dateFilled}
                refills={prescription.refills}
                onClick={() => setSelectedPrescription(prescription)}
              />
              {/* Shelf */}
              <div>
                <div className="h-2 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded-t shadow-lg" />
                <div className="h-4 bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 rounded-b-lg -mt-[1px]" />
              </div>
            </div>
          ))}
        </div>
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
