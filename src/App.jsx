import React from 'react';
import { Toaster } from 'react-hot-toast';

// Import our main components
import MainLayout from './components/layout/MainLayout.jsx';
import { ErrorProvider, ErrorBoundary } from './contexts/ErrorContext.jsx';

function App() {
  return (
    <ErrorBoundary>
      <ErrorProvider>
        <MainLayout>
          {/* Toast notifications */}
          <Toaster 
            position="top-right"
            toastOptions={{
              style: {
                background: 'rgba(0, 20, 40, 0.9)',
                color: '#00D4FF',
                border: '1px solid rgba(0, 212, 255, 0.3)',
                borderRadius: '8px',
                backdropFilter: 'blur(10px)',
                fontFamily: 'Rajdhani, sans-serif',
              },
              success: {
                iconTheme: {
                  primary: '#00D4FF',
                  secondary: 'rgba(0, 20, 40, 0.9)',
                },
              },
              error: {
                style: {
                  background: 'rgba(40, 0, 0, 0.9)',
                  color: '#ff6b6b',
                  border: '1px solid rgba(255, 0, 0, 0.3)',
                },
                iconTheme: {
                  primary: '#ff6b6b',
                  secondary: 'rgba(40, 0, 0, 0.9)',
                },
              },
            }}
          />
        </MainLayout>
      </ErrorProvider>
    </ErrorBoundary>
  );
}

export default App;
