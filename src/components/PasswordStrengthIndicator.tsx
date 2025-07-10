
import React from 'react';
import { checkPasswordStrength, PasswordStrength } from '@/utils/passwordStrength';
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';

interface PasswordStrengthIndicatorProps {
  password: string;
  className?: string;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ 
  password, 
  className = '' 
}) => {
  const strength: PasswordStrength = checkPasswordStrength(password);

  if (!password) return null;

  const getStrengthIcon = () => {
    if (strength.score <= 4) {
      return <AlertTriangle className="h-4 w-4" />;
    } else if (strength.score <= 6) {
      return <Shield className="h-4 w-4" />;
    } else {
      return <CheckCircle className="h-4 w-4" />;
    }
  };

  const getProgressWidth = () => {
    return `${(strength.score / 8) * 100}%`;
  };

  const getProgressColor = () => {
    if (strength.score <= 2) return 'bg-red-500';
    if (strength.score <= 4) return 'bg-orange-500';
    if (strength.score <= 6) return 'bg-yellow-500';
    if (strength.score <= 7) return 'bg-blue-500';
    return 'bg-green-500';
  };

  return (
    <div className={`mt-2 space-y-2 ${className}`}>
      {/* Strength indicator */}
      <div className="flex items-center gap-2">
        <div className={strength.color}>
          {getStrengthIcon()}
        </div>
        <span className={`text-sm font-medium ${strength.color}`}>
          Password Strength: {strength.label}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-300 ${getProgressColor()}`}
          style={{ width: getProgressWidth() }}
        />
      </div>

      {/* Suggestions */}
      {strength.suggestions.length > 0 && (
        <div className="text-xs text-muted-foreground">
          <p className="font-medium mb-1">Suggestions:</p>
          <ul className="space-y-1">
            {strength.suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start gap-1">
                <span className="text-gray-400">•</span>
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PasswordStrengthIndicator;
