import { PrescriptionCabinet } from './PrescriptionCabinet';
import { PrescriptionFilters } from './PrescriptionFilters';
import { PrescriptionsProvider } from './context/PrescriptionsContext';
import { ErrorBoundary } from '@/components';
import { ScrollToTop } from '@/components/ScrollToTop';

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

/**
 * Prescriptions Component
 * Maintains prescription state and provides context
 * to child components
 */
export const Prescriptions: React.FC = () => {
  return (
    <ErrorBoundary>
      <PrescriptionsProvider>
        <PrescriptionsContent />
      </PrescriptionsProvider>
    </ErrorBoundary>
  );
};
