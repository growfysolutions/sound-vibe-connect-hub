
import { supabase } from '@/integrations/supabase/client';

// Security configuration
export const SECURITY_CONFIG = {
  PASSWORD_MIN_LENGTH: 8,
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
  CSRF_TOKEN_HEADER: 'X-CSRF-Token',
  SECURE_HEADERS: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Referrer-Policy': 'strict-origin-when-cross-origin'
  }
};

// Rate limiting for API calls
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export const checkRateLimit = (key: string, maxRequests: number = 10, windowMs: number = 60000): boolean => {
  const now = Date.now();
  const limit = rateLimitMap.get(key);
  
  if (!limit || now > limit.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (limit.count >= maxRequests) {
    return false;
  }
  
  limit.count++;
  return true;
};

// Session management
export const validateSession = async (): Promise<boolean> => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    return !error && !!session;
  } catch {
    return false;
  }
};

// User role validation
export const validateUserRole = async (requiredRole: string): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data: roles } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id);

    return roles?.some(r => r.role === requiredRole) || false;
  } catch {
    return false;
  }
};

// Secure storage helpers
export const secureStorage = {
  setItem: (key: string, value: string) => {
    try {
      localStorage.setItem(key, btoa(value));
    } catch (error) {
      console.error('Failed to store item securely:', error);
    }
  },
  
  getItem: (key: string): string | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? atob(item) : null;
    } catch (error) {
      console.error('Failed to retrieve item securely:', error);
      return null;
    }
  },
  
  removeItem: (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove item securely:', error);
    }
  }
};

// Security headers utility
export const getSecurityHeaders = (): Record<string, string> => {
  return { ...SECURITY_CONFIG.SECURE_HEADERS };
};

// Audit logging
export const auditLog = async (action: string, details?: any) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    console.log('Security Audit:', {
      timestamp: new Date().toISOString(),
      userId: user?.id,
      action,
      details: details || {},
      userAgent: navigator.userAgent,
      ip: 'client-side' // IP would be logged server-side
    });
  } catch (error) {
    console.error('Audit logging failed:', error);
  }
};
