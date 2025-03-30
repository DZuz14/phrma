import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  Component,
  ErrorInfo,
} from 'react';
import { toast } from 'sonner';
import { AlertCircle, X, ArrowUp, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
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

// ============================================================================
// Types & Interfaces
// ============================================================================

interface Prescription {
  id: string;
  name: string;
  quantity: number;
  dateFilled: string;
  refills: number;
  category: string;
  active: boolean;
  instructions: string;
  autoRefill: boolean;
  autoRefillEligible: boolean;
  notifyRefill: boolean;
}

// ============================================================================
// Main App Component
// ============================================================================

/**
 * App Component
 * Main entry point that wraps the application with error boundary and context
 */
export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <PrescriptionsProvider>
        <PrescriptionsContent />
      </PrescriptionsProvider>
    </ErrorBoundary>
  );
};

// ============================================================================
// Initial Data
// ============================================================================

const initialPrescriptions: Prescription[] = [
  {
    id: '1',
    name: 'Lisinopril',
    quantity: 30,
    dateFilled: '2023-09-01',
    refills: 2,
    category: 'Blood Pressure',
    active: true,
    autoRefillEligible: true,
    autoRefill: true,
    instructions: 'Take 1 tablet daily',
    notifyRefill: true,
  },
  {
    id: '2',
    name: 'Metformin',
    quantity: 3,
    dateFilled: '2023-09-15',
    refills: 0,
    category: 'Diabetes',
    active: true,
    autoRefillEligible: false,
    autoRefill: false,
    instructions: 'Take 2 tablets daily',
    notifyRefill: true,
  },
  {
    id: '3',
    name: 'Atorvastatin',
    quantity: 15,
    dateFilled: '2023-08-20',
    refills: 1,
    category: 'Cholesterol',
    active: true,
    autoRefillEligible: true,
    autoRefill: true,
    instructions: 'Take 1 tablet at night',
    notifyRefill: false,
  },
  {
    id: '4',
    name: 'Sertraline',
    quantity: 4,
    dateFilled: '2023-09-10',
    refills: 3,
    category: 'Mental Health',
    active: true,
    autoRefillEligible: false,
    autoRefill: false,
    instructions: 'Take 1 tablet in the morning',
    notifyRefill: true,
  },
  {
    id: '5',
    name: 'Omeprazole',
    quantity: 28,
    dateFilled: '2023-09-05',
    refills: 2,
    category: 'Digestive',
    active: true,
    autoRefillEligible: true,
    autoRefill: false,
    instructions: 'Take 1 capsule before breakfast',
    notifyRefill: false,
  },
  {
    id: '6',
    name: 'Levothyroxine',
    quantity: 2,
    dateFilled: '2023-09-12',
    refills: 1,
    category: 'Thyroid',
    active: true,
    autoRefillEligible: false,
    autoRefill: false,
    instructions: 'Take on empty stomach in morning',
    notifyRefill: true,
  },
  {
    id: '7',
    name: 'Amlodipine',
    quantity: 45,
    dateFilled: '2023-08-25',
    refills: 4,
    category: 'Blood Pressure',
    active: true,
    autoRefillEligible: true,
    autoRefill: true,
    instructions: 'Take 1 tablet daily with food',
    notifyRefill: false,
  },
  {
    id: '8',
    name: 'Gabapentin',
    quantity: 60,
    dateFilled: '2023-09-03',
    refills: 0,
    category: 'Pain Management',
    active: false,
    autoRefillEligible: false,
    autoRefill: false,
    instructions: 'Take 1 capsule three times daily',
    notifyRefill: true,
  },
  {
    id: '9',
    name: 'Montelukast',
    quantity: 7,
    dateFilled: '2023-09-08',
    refills: 5,
    category: 'Allergy',
    active: true,
    autoRefillEligible: true,
    autoRefill: true,
    instructions: 'Take 1 tablet at bedtime',
    notifyRefill: true,
  },
  {
    id: '10',
    name: 'Escitalopram',
    quantity: 3,
    dateFilled: '2024-03-15',
    refills: 1,
    category: 'Mental Health',
    active: true,
    autoRefillEligible: true,
    autoRefill: true,
    instructions: 'Take 1 tablet daily in the morning',
    notifyRefill: true,
  },
  {
    id: '11',
    name: 'Hydrochlorothiazide',
    quantity: 4,
    dateFilled: '2024-03-20',
    refills: 2,
    category: 'Blood Pressure',
    active: true,
    autoRefillEligible: true,
    autoRefill: true,
    instructions: 'Take 1 tablet daily with water',
    notifyRefill: true,
  },
];

// ============================================================================
// Context & Provider
// ============================================================================

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
const PrescriptionsProvider: React.FC<{ children: ReactNode }> = ({
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
   * To disable warnings during demos, set DISABLE_REFILL_WARNINGS to true
   */
  const DISABLE_REFILL_WARNINGS = true; // <-- Toggle this to true/false
  useEffect(() => {
    if (DISABLE_REFILL_WARNINGS) return;

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
const usePrescriptions = () => {
  const context = useContext(PrescriptionsContext);
  if (context === undefined) {
    throw new Error(
      'usePrescriptions must be used within a PrescriptionsProvider'
    );
  }
  return context;
};

// ============================================================================
// Main Components
// ============================================================================

/**
 * PrescriptionsContent Component
 * Displays a cabinet-like layout of prescription bottles
 * with detail view capabilities and filters
 */
const PrescriptionsContent: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-violet-500 to-indigo-600">
      <div className="flex flex-col max-w-7xl mx-auto gap-4 p-4 md:p-8">
        <PrescriptionFilters />
        <PrescriptionCabinet />
        <ScrollToTop />
      </div>
    </div>
  );
};

// ============================================================================
// Filter Components
// ============================================================================

/**
 * Prescription Filters Component
 * Allows filtering prescriptions by category and status
 */
const PrescriptionFilters: React.FC = () => {
  const { setPrescriptions } = usePrescriptions();
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterActive, setFilterActive] = useState<boolean | null>(null);

  /**
   * Memoized categories array
   * Combines 'All' with unique categories from prescriptions
   */
  const categories = useMemo(
    () => ['All', ...new Set(initialPrescriptions.map((p) => p.category))],
    []
  );

  // Apply filters whenever any filter state changes
  useEffect(() => {
    try {
      let result = [...initialPrescriptions];

      // Apply category filter
      if (filterCategory !== 'All') {
        result = result.filter((p) => p.category === filterCategory);
      }
      // Apply status filter
      if (filterActive !== null) {
        result = result.filter((p) => p.active === filterActive);
      }
      // Sort alphabetically
      result.sort((a, b) => a.name.localeCompare(b.name));
      setPrescriptions(result);
    } catch (error) {
      console.error('Filter application error:', error);
      toast.error('Failed to apply filters');
      handleResetFilters();
    }
  }, [filterCategory, filterActive, setPrescriptions]);

  // When the reset button is clicked, reset the filters to the initial state
  const handleResetFilters = () => {
    try {
      setFilterCategory('All');
      setFilterActive(null);
      setPrescriptions(
        [...initialPrescriptions].sort((a, b) => a.name.localeCompare(b.name))
      );
    } catch (error) {
      console.error('Filter reset error:', error);
      toast.error('Failed to reset filters');
    }
  };

  return (
    <div className="bg-indigo-800 rounded-lg shadow-lg mb-4 md:mb-6 p-3 md:p-4 border-2 border-indigo-400">
      <h2 className="text-white/90 font-medium tracking-tight text-base md:text-lg mb-3">
        Prescription Filters
      </h2>
      <div className="h-px bg-gradient-to-r from-transparent via-indigo-100/75 to-transparent mb-4" />

      <div className="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4 items-start sm:items-center">
        {/* Category Filter */}
        <div className="w-full sm:w-auto space-y-1 md:space-y-1.5">
          <Label
            htmlFor="category-filter"
            className="text-white/90 text-sm md:text-base"
          >
            Category:
          </Label>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger
              id="category-filter"
              className="w-full sm:w-[180px] bg-indigo-600 text-white border-indigo-600 text-sm md:text-base"
            >
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Category</SelectLabel>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter */}
        <div className="w-full sm:w-auto space-y-1 md:space-y-1.5">
          <Label
            htmlFor="status-filter"
            className="text-white/90 text-sm md:text-base"
          >
            Status:
          </Label>
          <Select
            value={filterActive === null ? 'All' : filterActive.toString()}
            onValueChange={(value) =>
              setFilterActive(value === 'All' ? null : value === 'true')
            }
          >
            <SelectTrigger
              id="status-filter"
              className="w-full sm:w-[180px] bg-indigo-600 text-white border-indigo-600 text-sm md:text-base"
            >
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Status</SelectLabel>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">Inactive</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Reset Filters Button */}
        <div className="mt-2 w-full sm:w-auto space-y-1 md:space-y-1.5">
          <Label className="text-transparent">Reset</Label>
          <button
            onClick={handleResetFilters}
            className="w-full sm:w-[120px] h-[40px] bg-indigo-600 text-white text-sm rounded hover:bg-indigo-500 transition-colors border-2 border-indigo-400 flex items-center justify-center cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// Cabinet & Bottle Components
// ============================================================================

/**
 * Prescription Cabinet Component
 * Displays a cabinet-like layout of prescription bottles
 * with detail view capabilities
 */
const PrescriptionCabinet: React.FC = () => {
  const [selectedPrescription, setSelectedPrescription] =
    useState<Prescription | null>(null);
  const { prescriptions, setPrescriptions } = usePrescriptions();

  /**
   * Remove a prescription from the cabinet
   * @param id - The ID of the prescription to remove
   */
  const handleRemove = useCallback(
    (id: string) => {
      try {
        const prescription = prescriptions.find((p) => p.id === id);
        if (!prescription) {
          throw new Error('Prescription not found');
        }
        setPrescriptions(prescriptions.filter((p) => p.id !== id));
        toast.success('Prescription deleted', {
          description: `${prescription.name} has been removed from your cabinet`,
        });
      } catch (error) {
        toast.error('Failed to delete prescription', {
          description:
            error instanceof Error
              ? error.message
              : 'An unexpected error occurred',
        });
      }
    },
    [prescriptions, setPrescriptions]
  );

  return (
    <div
      className="bg-amber-50/95 backdrop-blur-sm rounded-xl shadow-2xl pb-10 pt-10
      border border-amber-100/80 shadow-[inset_0_2px_40px_rgba(0,0,0,0.05)] rounded-lg shadow-lg mb-4 md:mb-6 border-4 border-indigo-400"
    >
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-16 sm:gap-x-6 lg:gap-x-8">
          {/* All prescriptions pill bottles rendered in a grid */}
          {prescriptions.map((prescription) => (
            <div key={prescription.id}>
              <PrescriptionBottle
                name={prescription.name}
                quantity={prescription.quantity}
                dateFilled={prescription.dateFilled}
                refills={prescription.refills}
                onClick={() => setSelectedPrescription(prescription)}
              />
              {/* Shelf: Aesthetic divider between bottles */}
              <div>
                <div className="h-2 bg-gradient-to-r from-stone-200 via-stone-100 to-stone-200 rounded-t shadow-lg" />
                <div className="h-4 bg-gradient-to-r from-stone-300 via-stone-200 to-stone-300 rounded-b-lg -mt-[1px]" />
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

interface PrescriptionBottleProps {
  name: string;
  quantity: number;
  dateFilled: string;
  refills: number;
  onClick?: () => void;
}

/**
 * Prescription Bottle Component
 *
 * This component represents a prescription bottle with a name, quantity, date filled, and refills.
 * It displays the prescription details in a bottle-like format with a cap, body, and label.
 *
 */
const PrescriptionBottle: React.FC<PrescriptionBottleProps> = ({
  name,
  quantity,
  dateFilled,
  refills,
  onClick,
}) => {
  return (
    <div onClick={onClick} className="w-full flex justify-center">
      <div className="w-44 relative cursor-pointer flex flex-col items-center transition-transform hover:scale-105 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
        {/* Bottle Cap */}
        <div className="w-full h-7 bg-indigo-500 rounded-t-xl shadow-inner border-b border-indigo-600" />

        {/* Bottle Body */}
        <div className="w-full h-[280px] flex flex-col justify-center items-center bg-orange-300/80 border border-orange-100 rounded-b-xl shadow-xl">
          {/* Label */}
          <div className="w-4/5 p-4 bg-white/90 backdrop-blur-md rounded-md border border-gray-200 shadow-lg">
            {/* Prescription Name */}
            <p
              className="font-bold text-md tracking-tight truncate text-indigo-700"
              title={name}
            >
              {name}
            </p>

            {/* Prescription Details */}
            <div className="mt-4">
              <Detail label="Quantity" value={quantity} />
              <Detail
                label="Filled"
                value={new Date(dateFilled).toLocaleDateString()}
              />
              <Detail
                label="Refills"
                value={refills}
                className={refills === 0 ? 'text-red-500' : 'text-indigo-500'}
                showDivider={false}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface DetailProps {
  label: string;
  value: string | number;
  showDivider?: boolean;
  className?: string;
}

/**
 * Detail Component
 *
 * This component displays a label and value pair with optional divider
 * and custom styling. For use in PrescriptionBottle component only.
 */
const Detail = ({
  label,
  value,
  showDivider = true,
  className = 'text-indigo-500',
}: DetailProps) => {
  return (
    <>
      <div className="mb-3">
        <div className="text-indigo-500 tracking-wider uppercase text-[10px]">
          {label}:
        </div>
        <div className={`font-semibold text-sm mt-1 ${className}`}>{value}</div>
      </div>
      {showDivider && <div className="h-px bg-indigo-200 mb-3" />}
    </>
  );
};

// ============================================================================
// Dialog & Detail Components
// ============================================================================

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
const PrescriptionDialog: React.FC<PrescriptionDialogProps> = ({
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
        <DialogContent className="bg-indigo-800/90 backdrop-blur-sm border-indigo-700 max-w-[95vw] sm:max-w-2xl mx-auto max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader className="border-b border-indigo-700/50 pb-2 sm:pb-4">
            <DialogTitle className="text-lg sm:text-2xl font-semibold text-white">
              {prescription.name}
            </DialogTitle>
            <DialogDescription className="text-indigo-200 text-xs sm:text-sm">
              View and manage prescription details
            </DialogDescription>
          </DialogHeader>

          {/* Prescription Details rendered in a grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 py-4">
            {/* Left Column Details */}
            <div className="space-y-4">
              <DetailCard label="Quantity" text={prescription.quantity} />
              <DetailCard label="Date Filled" text={prescription.dateFilled} />
              <DetailCard label="Refills" text={prescription.refills} />
              <DetailCard label="Category" text={prescription.category} />
            </div>

            {/* Right Column Details */}
            <div className="space-y-4">
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
              <DetailCard
                label="Instructions"
                text={prescription.instructions}
              />
              <DetailCard label="Auto-refill">
                <div className="flex items-center space-x-2">
                  {prescription.autoRefillEligible ? (
                    <Checkbox
                      id="auto-refill"
                      checked={prescription.autoRefill}
                      onCheckedChange={handleAutoRefillChange}
                      disabled={!prescription.autoRefillEligible}
                      className="data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                    />
                  ) : (
                    <span className="text-white/50 text-sm">Not Eligible</span>
                  )}
                </div>
              </DetailCard>
              <DetailCard label="Notify Refill">
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs sm:text-sm ${
                    prescription.notifyRefill
                      ? 'bg-purple-500/20 text-purple-300'
                      : 'bg-gray-500/20 text-gray-300'
                  }`}
                >
                  {prescription.notifyRefill ? 'Yes' : 'No'}
                </span>
              </DetailCard>
            </div>
          </div>

          {/* Delete Button */}
          <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-indigo-700/50">
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent className="bg-indigo-800/90 backdrop-blur-sm border-indigo-700 max-w-[95vw] sm:max-w-md mx-auto">
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

// ============================================================================
// Utility Components
// ============================================================================

const SCROLL_THRESHOLD = 300;

/**
 * ScrollToTop Component
 * A button that appears when scrolling down and smoothly scrolls to top when clicked
 */
const ScrollToTop: React.FC = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Handle scroll visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > SCROLL_THRESHOLD);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Button
      onClick={scrollToTop}
      className={`fixed bottom-6 right-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-3 shadow-lg transition-all duration-300 ${
        showScrollTop
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
      aria-label="Scroll to top"
    >
      <ArrowUp className="h-5 w-5" />
    </Button>
  );
};

// ============================================================================
// Error Handling
// ============================================================================

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-indigo-500 to-indigo-400 p-6 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-lg w-full">
            <h2 className="text-2xl font-bold text-indigo-600 mb-4">
              Oops! Something went wrong
            </h2>
            <p className="text-gray-600 mb-6">
              The application encountered an unexpected error. Please try
              refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
