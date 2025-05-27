import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// Alert types
type AlertType = 'info' | 'success' | 'warning' | 'error';

// Alert structure
interface Alert {
  id: string;
  type: AlertType;
  message: string;
}

// Alert context state
interface AlertState {
  alerts: Alert[];
}

// Alert context actions
type AlertAction =
  | { type: 'ADD_ALERT'; payload: Omit<Alert, 'id'> }
  | { type: 'REMOVE_ALERT'; payload: string };

// Alert context value
interface AlertContextValue extends AlertState {
  addAlert: (alert: Omit<Alert, 'id'>) => void;
  removeAlert: (id: string) => void;
}

// Create the context
const AlertContext = createContext<AlertContextValue | undefined>(undefined);

// Alert reducer
const alertReducer = (state: AlertState, action: AlertAction): AlertState => {
  switch (action.type) {
    case 'ADD_ALERT':
      return {
        ...state,
        alerts: [
          ...state.alerts,
          {
            id: Date.now().toString(),
            ...action.payload,
          },
        ],
      };
    case 'REMOVE_ALERT':
      return {
        ...state,
        alerts: state.alerts.filter((alert) => alert.id !== action.payload),
      };
    default:
      return state;
  }
};

// Alert provider
export const AlertProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(alertReducer, { alerts: [] });

  const addAlert = (alert: Omit<Alert, 'id'>) => {
    dispatch({ type: 'ADD_ALERT', payload: alert });
  };

  const removeAlert = (id: string) => {
    dispatch({ type: 'REMOVE_ALERT', payload: id });
  };

  return (
    <AlertContext.Provider
      value={{
        alerts: state.alerts,
        addAlert,
        removeAlert,
      }}
    >
      {children}
    </AlertContext.Provider>
  );
};

// Custom hook for using the alert context
export const useAlert = (): AlertContextValue => {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};