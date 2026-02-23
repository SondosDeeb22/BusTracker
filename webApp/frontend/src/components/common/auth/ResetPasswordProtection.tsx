//====================================================================================================================================
//? Importing
//====================================================================================================================================

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useSearchParams } from 'react-router-dom';
import ErrorScreen from '../errors/ErrorScreen';

import { apiClient } from '../../../services/apiClient';

interface ResetPasswordProtectionProps {
  children: React.ReactNode;
}


//====================================================================================================================================
//? ResetPasswordProtection Component - Protects reset password page with token validation
//====================================================================================================================================

const ResetPasswordProtection: React.FC<ResetPasswordProtectionProps> = ({ children }) => {
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation('auth/common');
  
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
        const response = await apiClient.head(`/api/auth/reset-password/${token}`, {
          withCredentials: false,
          timeout: 8000,
        });

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
  }, [token]);

  // Show loading state while checking token ======================================================================
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-burgundy mx-auto mb-4"></div>
          <p className="text-gray-600">{t('resetProtection.loading')}</p>
        </div>
      </div>
    );
  }

  // Show error if token is invalid =========================================================================
  if (!isValid) {
    return (
      <ErrorScreen
        title={t('resetProtection.invalidTitle')}
        message={t('resetProtection.invalidMessage')}
        helpText={t('resetProtection.help')}
        actionHref="/forgot-password"
        actionLabel={t('resetProtection.requestNewLink')}
      />
    );
  }

  // Render the reset password page if token is valid =======================================================================
  return <>{children}</>;
};
//====================================================================================================================================
export default ResetPasswordProtection;
