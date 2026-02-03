import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import loginPicture from '../assets/loginPicture.png';
import busTrackerLogo from '../assets/busTrackerlogo.png';
import { burgundy } from '../styles/colorPalette';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';



const Login = () => {
  const { t } = useTranslation('auth/loginPage');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await axios.post('http://localhost:3001/api/auth/login', 
        { email, password },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true, // Important: include cookies
        }
      );
      //if user is not admin, prevent access ---------------------------------------------------------------------
      try {
        const checkAuthority = await axios.get('http://localhost:3001/api/auth/user-info', {
          withCredentials: true // Important: include cookies
        });
        
        const userData = checkAuthority.data.data;
        console.log(userData);
        console.log(userData.userRole);

        if (userData.userRole !== 'admin') {
          try {
          await axios.post(
            'http://localhost:3001/api/auth/logout',
            {},
            { withCredentials: true }
          );
          navigate('/', { replace: true });
          setError(t('common.errors.forbidden', { ns: 'translation' }));
         }catch(error){
          setError(t('common.errors.internal', { ns: 'translation' }))
         }
       
        }else{
          //if userRole is admin direct to homepage----------------------------------------------------------
          navigate('/homepage');
        }
      } catch (error) {
        console.log(error);
        setError(t('common.errors.internal', { ns: 'translation' }))
      }

      

    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        if (status === 404) {
          setError(t('auth.login.userNotFound', { ns: 'translation' }));
        } else if (status === 401) {
          setError(t('auth.login.invalidCredentials', { ns: 'translation' }));
        } else if (status === 500) {
          setError(t('common.errors.internal', { ns: 'translation' }));
        } else {
          setError(t('common.errors.internal', { ns: 'translation' }));
        }
      } else {
        setError(t('common.errors.internal', { ns: 'translation' }));
      }
      console.error('Login error:', error);

    } finally {
      setLoading(false);
    }
  };

  return (
    // =============================================================================================================
    // =============================================================================================================
    
    <div className="min-h-screen flex relative">
      
      {/* Left side - Login form ========================================================*/}
      {/* <div className="w-full lg:w-1/2 flex items-center justify-center p-8"> */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8" style={{marginTop:'-20px'}}>
        
        {/* button to change the language  */}
        <div className="absolute top-4 right-4 z-50">
          <div className="px-2 py-1 rounded-md" style={{ backgroundColor: burgundy }}>
            <LanguageSwitcher />
          </div>
        </div>


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
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                {t('emailLabel')}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent outline-none transition focus:ring-red-900"
                placeholder={t('emailPlaceholder')}
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold  text-gray-700 mb-2">
                {t('passwordLabel')}
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent outline-none transition focus:ring-red-900"
                placeholder={t('passwordPlaceholder')}
                required
              />
            </div>

            <div className="flex items-center justify-between">
           
              <a href="/forgot-password" className="text-sm font-semibold text-black transition hover:text-red-900">
                {t('forgotPassword')}
              </a>
            </div>

            <button
              type="submit"
              className="w-full text-white py-3 px-4 rounded-lg transition duration-200 font-medium"
              style={{backgroundColor: burgundy}}
              disabled={loading}
            >
              {loading ? t('signingIn') : t('login')}
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

export default Login;
