import React, { createContext, useContext, useEffect, useState } from 'react';
import Purchases, { CustomerInfo, LOG_LEVEL } from 'react-native-purchases';
import { REVENUECAT_CONFIG, isRevenueCatConfigured } from '../utils/revenueCatConfig';

interface RevenueCatContextType {
  isConfigured: boolean;
  customerInfo: CustomerInfo | null;
  isLoading: boolean;
  refreshCustomerInfo: () => Promise<void>;
}

const RevenueCatContext = createContext<RevenueCatContextType>({
  isConfigured: false,
  customerInfo: null,
  isLoading: true,
  refreshCustomerInfo: async () => {},
});

export const useRevenueCat = () => {
  const context = useContext(RevenueCatContext);
  if (!context) {
    throw new Error('useRevenueCat must be used within a RevenueCatProvider');
  }
  return context;
};

interface RevenueCatProviderProps {
  children: React.ReactNode;
}

export const RevenueCatProvider: React.FC<RevenueCatProviderProps> = ({ children }) => {
  const [isConfigured, setIsConfigured] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeRevenueCat = async () => {
      try {
        const configured = isRevenueCatConfigured();
        setIsConfigured(configured);

        if (!configured) {
          console.log(
            'RevenueCat is not configured. Please set your API keys in utils/revenueCatConfig.ts or environment variables.'
          );
          setIsLoading(false);
          return;
        }

        // Set log level for debugging in development
        if (REVENUECAT_CONFIG.enableDebugLogs) {
          Purchases.setLogLevel(LOG_LEVEL.DEBUG);
        }

        // Configure the Purchases SDK
        Purchases.configure({
          apiKey: REVENUECAT_CONFIG.apiKey,
        });

        // Get initial customer info
        const info = await Purchases.getCustomerInfo();
        setCustomerInfo(info);
      } catch (error) {
        console.error('Error initializing RevenueCat:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeRevenueCat();
  }, []);

  const refreshCustomerInfo = async () => {
    if (!isConfigured) {
      return;
    }
    
    try {
      const info = await Purchases.getCustomerInfo();
      setCustomerInfo(info);
    } catch (error) {
      console.error('Error refreshing customer info:', error);
    }
  };

  return (
    <RevenueCatContext.Provider
      value={{
        isConfigured,
        customerInfo,
        isLoading,
        refreshCustomerInfo,
      }}
    >
      {children}
    </RevenueCatContext.Provider>
  );
};
