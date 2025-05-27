import React, { useEffect } from 'react';
import { useAlert } from '../context/AlertContext';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

const Alerts: React.FC = () => {
  const { alerts, removeAlert } = useAlert();
  
  useEffect(() => {
    // Auto dismiss alerts after 5 seconds
    if (alerts.length > 0) {
      const timer = setTimeout(() => {
        removeAlert(alerts[0].id);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [alerts, removeAlert]);
  
  if (alerts.length === 0) return null;
  
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md w-full">
      {alerts.map((alert) => {
        let bgColor, textColor, borderColor, Icon;
        
        switch (alert.type) {
          case 'success':
            bgColor = 'bg-green-50';
            textColor = 'text-green-800';
            borderColor = 'border-green-400';
            Icon = CheckCircle;
            break;
          case 'error':
            bgColor = 'bg-red-50';
            textColor = 'text-red-800';
            borderColor = 'border-red-400';
            Icon = AlertCircle;
            break;
          case 'warning':
            bgColor = 'bg-yellow-50';
            textColor = 'text-yellow-800';
            borderColor = 'border-yellow-400';
            Icon = AlertCircle;
            break;
          default:
            bgColor = 'bg-blue-50';
            textColor = 'text-blue-800';
            borderColor = 'border-blue-400';
            Icon = Info;
        }
        
        return (
          <div
            key={alert.id}
            className={`${bgColor} ${borderColor} border-l-4 p-4 rounded-r-md shadow-md flex items-start justify-between slide-up`}
          >
            <div className="flex">
              <div className={`flex-shrink-0 ${textColor}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="ml-3">
                <p className={`text-sm font-medium ${textColor}`}>{alert.message}</p>
              </div>
            </div>
            <button
              onClick={() => removeAlert(alert.id)}
              className={`ml-4 ${textColor} hover:${textColor} focus:outline-none`}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Alerts;