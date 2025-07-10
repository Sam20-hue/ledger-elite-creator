
export interface PasswordStrength {
  score: number;
  label: string;
  color: string;
  suggestions: string[];
}

export const checkPasswordStrength = (password: string): PasswordStrength => {
  let score = 0;
  const suggestions: string[] = [];

  // Length check
  if (password.length >= 8) {
    score += 1;
  } else {
    suggestions.push('Use at least 8 characters');
  }

  if (password.length >= 12) {
    score += 1;
  } else if (password.length >= 8) {
    suggestions.push('Consider using 12+ characters for better security');
  }

  // Uppercase check
  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    suggestions.push('Include uppercase letters (A-Z)');
  }

  // Lowercase check
  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    suggestions.push('Include lowercase letters (a-z)');
  }

  // Number check
  if (/\d/.test(password)) {
    score += 1;
  } else {
    suggestions.push('Include numbers (0-9)');
  }

  // Special character check
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 1;
  } else {
    suggestions.push('Include special characters (!@#$%^&*)');
  }

  // No common patterns
  const commonPatterns = ['123', 'abc', 'password', 'qwerty', '111', '000'];
  const hasCommonPattern = commonPatterns.some(pattern => 
    password.toLowerCase().includes(pattern)
  );
  
  if (!hasCommonPattern) {
    score += 1;
  } else {
    suggestions.push('Avoid common patterns like "123" or "abc"');
  }

  // No repeated characters
  if (!/(.)\1{2,}/.test(password)) {
    score += 1;
  } else {
    suggestions.push('Avoid repeating the same character multiple times');
  }

  // Determine strength label and color
  let label: string;
  let color: string;

  if (score <= 2) {
    label = 'Very Weak';
    color = 'text-red-600';
  } else if (score <= 4) {
    label = 'Weak';
    color = 'text-orange-500';
  } else if (score <= 6) {
    label = 'Fair';
    color = 'text-yellow-500';
  } else if (score <= 7) {
    label = 'Good';
    color = 'text-blue-500';
  } else {
    label = 'Strong';
    color = 'text-green-500';
  }

  return {
    score,
    label,
    color,
    suggestions: suggestions.slice(0, 3) // Limit to top 3 suggestions
  };
};
