import React, { useState } from 'react';
import { usePrescriptions } from './context/PrescriptionsContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { Prescription } from './prescriptions.types';
import { toast } from 'sonner';

interface PrescriptionDialogProps {
  prescription: Prescription;
  onClose: () => void;
  onDelete: (id: string) => void;
}

/**
 * Prescription Dialog Component
 * Displays detailed information about a prescription
 * and allows for closing the dialog and deleting the prescription
 */
export const PrescriptionDialog: React.FC<PrescriptionDialogProps> = ({
  prescription: initialPrescription,
  onClose,
  onDelete,
}) => {
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const { updatePrescription, prescriptions } = usePrescriptions();

  // Get the latest prescription data from context
  const prescription =
    prescriptions.find((p) => p.id === initialPrescription.id) ||
    initialPrescription;

  // Not the real delete, just a confirmation dialog will be shown
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteAlert(true);
  };

  // Real delete, will be called after confirmation
  const handleConfirmDelete = () => {
    try {
      onDelete(prescription.id);
      onClose();
    } catch (error) {
      onClose();
      toast.error('Failed to delete prescription');
    }
  };

  // Triggers when the auto-refill checkbox is checked or unchecked
  const handleAutoRefillChange = (checked: boolean) => {
    try {
      updatePrescription(prescription.id, { autoRefill: checked });
    } catch (error) {
      toast.error('Failed to update auto-refill status');
    }
  };

  return (
    <>
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="bg-indigo-800/90 backdrop-blur-sm border-indigo-700 max-w-[95vw] sm:max-w-2xl mx-auto">
          <DialogHeader className="border-b border-indigo-700/50 pb-2 sm:pb-4">
            <DialogTitle className="text-lg sm:text-2xl font-semibold text-white">
              {prescription.name}
            </DialogTitle>
            <DialogDescription className="text-indigo-200 text-xs sm:text-sm">
              View and manage prescription details
            </DialogDescription>
          </DialogHeader>

          {/* Prescription Details rendered in a grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 py-4 sm:py-6">
            {/* Left Column Details */}
            <div className="space-y-4">
              <div className="space-y-4">
                <DetailCard label="Quantity" text={prescription.quantity} />
                <DetailCard
                  label="Date Filled"
                  text={prescription.dateFilled}
                />
                <DetailCard label="Refills" text={prescription.refills} />
                <DetailCard label="Category" text={prescription.category} />
              </div>
            </div>

            {/* Right Column Details */}
            <div className="space-y-4">
              <div className="space-y-4">
                {/* Status Card */}
                <DetailCard label="Status">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs sm:text-sm ${
                      prescription.active
                        ? 'bg-green-500/20 text-green-300'
                        : 'bg-red-500/20 text-red-300'
                    }`}
                  >
                    {prescription.active ? 'Active' : 'Inactive'}
                  </span>
                </DetailCard>
                {/* Instructions Card */}
                <DetailCard
                  label="Instructions"
                  text={prescription.instructions}
                />
                {/* Auto-refill Card */}
                <DetailCard label="Auto-refill">
                  <div className="flex items-center space-x-2 mt-1 sm:mt-2">
                    {prescription.autoRefillEligible ? (
                      <Checkbox
                        id="auto-refill"
                        checked={prescription.autoRefill}
                        onCheckedChange={handleAutoRefillChange}
                        disabled={!prescription.autoRefillEligible}
                        className="data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                      />
                    ) : (
                      <label
                        htmlFor="auto-refill"
                        className={`text-sm sm:text-lg font-medium ${
                          prescription.autoRefillEligible
                            ? 'text-white'
                            : 'text-gray-400'
                        }`}
                      >
                        {prescription.autoRefillEligible
                          ? 'Enabled'
                          : 'Not Eligible'}
                      </label>
                    )}
                  </div>
                </DetailCard>
                {/* Notify Refill Card */}
                <DetailCard label="Notify Refill">
                  <p className="text-white text-sm sm:text-lg font-medium">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs sm:text-sm ${
                        prescription.notifyRefill
                          ? 'bg-purple-500/20 text-purple-300'
                          : 'bg-gray-500/20 text-gray-300'
                      }`}
                    >
                      {prescription.notifyRefill ? 'Yes' : 'No'}
                    </span>
                  </p>
                </DetailCard>
              </div>
            </div>
          </div>

          {/* Delete Button */}
          <div className="flex justify-end gap-2 mt-2 sm:mt-6 pt-2 sm:pt-4 border-t border-indigo-700/50">
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteClick}
              className="bg-red-600 hover:bg-red-700 gap-2 cursor-pointer text-xs sm:text-base px-2 sm:px-4 py-1 sm:py-2"
            >
              <Trash2 className="h-3 w-3 sm:h-5 sm:w-5" />
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog opens when the delete button is clicked initially */}
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent className="bg-indigo-800/90 backdrop-blur-sm border-indigo-700 max-w-[95vw] sm:max-w-md mx-4">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white text-lg md:text-xl">
              Are you sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-indigo-100 text-sm">
              This will permanently delete {prescription.name}. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-indigo-600 text-white hover:bg-indigo-700 text-sm md:text-base">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 text-white hover:bg-red-700 gap-2 cursor-pointer text-sm md:text-base"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

interface DetailCardProps {
  label: string;
  text?: string | number;
  children?: React.ReactNode;
}

/**
 * Prescription Detail Card Component
 * Displays a label and either a text or children content.
 * For use in the PrescriptionDialog component only.
 */
const DetailCard: React.FC<DetailCardProps> = ({ label, text, children }) => (
  <div className="space-y-1 bg-indigo-700/30 p-2 sm:p-3 rounded-lg border border-indigo-600/50">
    <p className="text-indigo-200 text-xs sm:text-sm">{label}:</p>
    {text ? (
      <p className="text-white text-sm sm:text-lg font-medium">{text}</p>
    ) : (
      children
    )}
  </div>
);
