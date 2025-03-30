import type { FC } from 'react';
import { Prescriptions, ErrorBoundary } from '@/components';

/**
 * Main App Component
 */
const App: FC = () => {
  return (
    <ErrorBoundary>
      <Prescriptions />
    </ErrorBoundary>
  );
};

export default App;
