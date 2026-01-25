//====================================================================================================================================
//? Importing
//====================================================================================================================================

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { burgundy } from '../styles/colorPalette';

import LanguageSwitcher from '../components/LanguageSwitcher';

import { useSearchParams } from 'react-router-dom';
import ErrorScreen from './ErrorScreen';

interface SetPasswordProtectionProps {
  children: React.ReactNode;
}


//====================================================================================================================================
//? Set Password Protection Component - Protects set password page with token validation
//====================================================================================================================================

const SetPasswordProtection: React.FC<SetPasswordProtectionProps> = ({ children }) => {
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
        const response = await axios.head(`http://localhost:3001/api/auth/set-password/${token}`, {
          withCredentials: true,
        });

        if (response.status === 200) {// Token is valid
          setIsValid(true);

        }
      //-------------------------------------------------------------------------------------------
      } catch (error) {
        console.error('Error checking set token:', error);
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
          <p className="text-gray-600">{t('setProtection.loading')}</p>
        </div>
      </div>
    );
  }

  // Show error if token is invalid =========================================================================
  if (!isValid) {
    return (
      <ErrorScreen
        title={t('setProtection.invalidTitle')}
        message={t('setProtection.invalidMessage')}
        helpText={t('setProtection.help')}
        actionHref="/forgot-password"
        actionLabel={t('setProtection.requestNewLink')}
        showLanguageSwitcher={(
          <div className="absolute top-4 right-4 z-50">
            <div className="px-2 py-1 rounded-md" style={{ backgroundColor: burgundy }}>
              <LanguageSwitcher />
            </div>
          </div>
        )}
      />
    );
  }

  // Render the reset password page if token is valid =======================================================================
  return <>{children}</>;
};
//====================================================================================================================================
export default SetPasswordProtection;
