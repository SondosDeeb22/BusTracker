// ================================================


// type for auth request
export type AuthRequest = {
  body?: any;
  cookies?: Record<string, string | undefined>;
  ip?: string | undefined;
  params?: any;
  query?: any;
};

// ================================================
// type for auth response
export type AuthResponse = {
  setCookie: (...args: any[]) => void;
  clearCookie: (...args: any[]) => void;
};
