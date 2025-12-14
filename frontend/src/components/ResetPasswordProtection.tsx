//====================================================================================================================================
//? Importing
//====================================================================================================================================

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { COLORS } from '../styles/colorPalette';

import { useSearchParams } from 'react-router-dom';

interface ResetPasswordProtectionProps {
  children: React.ReactNode;
}


//====================================================================================================================================
//? ResetPasswordProtection Component - Protects reset password page with token validation
//====================================================================================================================================

const ResetPasswordProtection: React.FC<ResetPasswordProtectionProps> = ({ children }) => {
  const navigate = useNavigate();
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    const checkToken = async () => {
      // direct user error messsage page in case if the token didn't exists
      if (!token) {
        setIsValid(false);
        setLoading(false);
        return;
      }
      try {
        // Make a HEAD request to check if resetPasswordToken is valid
        const response = await axios.head(`http://localhost:3001/api/auth/reset-password/${token}`, {
          withCredentials: true,
        });

        console.log('response is : =======================')
        console.log(response);
        if (response.status === 200) {// Token is valid
          setIsValid(true);

        }
      //-------------------------------------------------------------------------------------------
      } catch (error) {
        console.error('Error checking reset token:', error);
        setIsValid(false);
      } finally {
        setLoading(false);
      }
    };

    checkToken();
  }, [navigate, token]);

  // Show loading state while checking token ======================================================================
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-burgundy mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying reset token...</p>
        </div>
      </div>
    );
  }

  // Show error if token is invalid =========================================================================
  if (!isValid) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 
            className="text-2xl font-bold mb-4"
            style={{color: COLORS.burgundy}}
          >
            Invalid Reset Link
          </h1>
          <p className="text-gray-600 mb-6">
            Your reset link has expired or is invalid.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Please request a new password reset link.
          </p>
          <a 
            href="/forgot-password" 
            className="inline-block px-6 py-2 text-white rounded-md hover:bg-red-900"
            style={{backgroundColor: COLORS.burgundy}}
          >
            Request New Reset Link
          </a>
        </div>
      </div>
    );
  }

  // Render the reset password page if token is valid =======================================================================
  return <>{children}</>;
};
//====================================================================================================================================
export default ResetPasswordProtection;
