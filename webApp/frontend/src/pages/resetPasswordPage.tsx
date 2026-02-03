import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import loginPicture from '../assets/loginPicture.png';
import busTrackerLogo from '../assets/busTrackerlogo.png';
import { burgundy } from '../styles/colorPalette';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

import { useSearchParams } from 'react-router-dom';



const ResetPassword = () => {
  const { t } = useTranslation('auth/resetPasswordPage');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await axios.patch(`http://localhost:3001/api/auth/reset-password/${token}`, 
        { newPassword, confirmPassword },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: false, // Important: include cookies
        }
      );
      
      // Password reset successful, navigate to login
      navigate('/');
      return;

    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const backendMessageKey = error.response?.data?.message as string | undefined;

        if (backendMessageKey) {
          setError(t(backendMessageKey, { ns: 'translation' }));
        } else {
          setError(t('common.errors.internal', { ns: 'translation' }));
        }

        // If 401 error, token is invalid/expired
        if (status === 401) {
          setTimeout(() => navigate('/forgot-password'), 2000);
        }
      } else {
        setError(t('common.errors.internal', { ns: 'translation' }));
      }
      console.error('Error occurred while resetting password:', error);

    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="min-h-screen flex relative">

      {/* button to change the language  */}
        <div className="absolute top-4 right-4 z-50">
          <div className="px-2 py-1 rounded-md" style={{ backgroundColor: burgundy }}>
            <LanguageSwitcher />
          </div>
        </div>

      {/* Left side - Login form ===========================================================================*/}
      <div className="relative w-full lg:w-1/2 flex items-center justify-center p-8" style={{marginTop:'-20px'}}>
      
        
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <img className='w-40 h-40 mx-auto' src={busTrackerLogo}/>
            <h1 className="text-4xl font-bold mb-2" style={{color: burgundy}}>{t('university')}</h1>
            <h1 className="text-4xl font-bold mb-2" style={{color: burgundy}}>{t('appName')}</h1>
            <p className="text-2xl font-bold mb-2 mt-5" style={{color: burgundy}}>{t('adminLogin')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            
            <p className="block text-sm font-semibold  text-gray-700 mb-2">{t('prompt')}</p>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-semibold  text-gray-700 mb-2">
                {t('newPasswordLabel')}
              </label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent outline-none transition focus:ring-red-900"
                placeholder={t('newPasswordPlaceholder')}
                required
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold  text-gray-700 mb-2">
                {t('confirmPasswordLabel')}
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent outline-none transition focus:ring-red-900"
                placeholder={t('confirmPasswordPlaceholder')}
                required
              />
            </div>


            <button
              type="submit"
              className="w-full text-white py-3 px-4 rounded-lg transition duration-200 font-medium"
              style={{backgroundColor: burgundy}}
              disabled={loading}
            >
                {t('resetPassword')}
            </button>
          </form>

          
        </div>
      </div>

      {/* Right side - Image =======================================================================================*/}
      <div className="hidden lg:block lg:w-2/3 relative">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${loginPicture})` }}
        >
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
