import React, { useState } from 'react';
import { usePrescriptions } from './context/PrescriptionsContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteAlert(true);
  };

  const handleConfirmDelete = () => {
    onDelete(prescription.id);
    onClose();
  };

  const handleAutoRefillChange = (checked: boolean) => {
    updatePrescription(prescription.id, { autoRefill: checked });
  };

  return (
    <>
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="bg-indigo-800/90 backdrop-blur-sm border-indigo-700 max-w-2xl">
          <DialogHeader className="border-b border-indigo-700/50 pb-4">
            <DialogTitle className="text-2xl font-semibold text-white">
              {prescription.name}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            {/* Left Column */}
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="bg-indigo-700/30 p-3 rounded-lg">
                  <p className="text-indigo-200 text-sm">Quantity</p>
                  <p className="text-white text-lg font-medium">
                    {prescription.quantity}
                  </p>
                </div>
                <div className="bg-indigo-700/30 p-3 rounded-lg">
                  <p className="text-indigo-200 text-sm">Date Filled</p>
                  <p className="text-white text-lg font-medium">
                    {prescription.dateFilled}
                  </p>
                </div>
                <div className="bg-indigo-700/30 p-3 rounded-lg">
                  <p className="text-indigo-200 text-sm">Refills</p>
                  <p className="text-white text-lg font-medium">
                    {prescription.refills}
                  </p>
                </div>
                <div className="bg-indigo-700/30 p-3 rounded-lg">
                  <p className="text-indigo-200 text-sm">Category</p>
                  <p className="text-white text-lg font-medium">
                    {prescription.category}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="bg-indigo-700/30 p-3 rounded-lg">
                  <p className="text-indigo-200 text-sm">Status</p>
                  <p className="text-white text-lg font-medium">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-sm ${
                        prescription.active
                          ? 'bg-green-500/20 text-green-300'
                          : 'bg-red-500/20 text-red-300'
                      }`}
                    >
                      {prescription.active ? 'Active' : 'Inactive'}
                    </span>
                  </p>
                </div>
                <div className="bg-indigo-700/30 p-3 rounded-lg">
                  <p className="text-indigo-200 text-sm">Instructions</p>
                  <p className="text-white text-lg font-medium">
                    {prescription.instructions}
                  </p>
                </div>
                <div className="bg-indigo-700/30 p-3 rounded-lg">
                  <p className="text-indigo-200 text-sm">Auto-refill</p>
                  <div className="flex items-center space-x-2 mt-2">
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
                        className={`text-lg font-medium ${
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
                </div>
                <div className="bg-indigo-700/30 p-3 rounded-lg">
                  <p className="text-indigo-200 text-sm">Notify Refill</p>
                  <p className="text-white text-lg font-medium">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-sm ${
                        prescription.notifyRefill
                          ? 'bg-purple-500/20 text-purple-300'
                          : 'bg-gray-500/20 text-gray-300'
                      }`}
                    >
                      {prescription.notifyRefill ? 'Yes' : 'No'}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-indigo-700/50">
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteClick}
              className="bg-red-600 hover:bg-red-700 gap-2 cursor-pointer"
            >
              <Trash2 className="h-5 w-5" />
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent className="bg-indigo-800/90 backdrop-blur-sm border-indigo-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              Are you sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-indigo-100">
              This will permanently delete {prescription.name}. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-indigo-600 text-white hover:bg-indigo-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 text-white hover:bg-red-700 gap-2 cursor-pointer"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
