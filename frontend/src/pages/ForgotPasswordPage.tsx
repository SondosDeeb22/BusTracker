import { useState } from 'react';
import axios from 'axios';
import loginPicture from '../assets/loginPicture.png';
import busTrackerLogo from '../assets/busTrackerlogo.png';
import { burgundy } from '../styles/colorPalette';


const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [EmailSent, setEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);

  // function to send password reset links via gmail -------------------------------------------------------------------------------
  const sendResetEmail = async (targetEmail: string) => {
    setError('');
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3001/api/auth/forgot-password', 
        { email: targetEmail},
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        setEmailSent(true);
      }

      console.log(response);
      console.log(response.data);
      
      
    } catch (error) {
      setError('This email is not registered in our system. Please use the email associated with your account');
      console.error('email not registered in system error:', error);
    } finally {
      setLoading(false);
    }
  };
  //-------------------------------------------------------------------------------------------------------------------------

  // handle logic when user submits the email form 
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // stop default behaviour of reloading the page and let react handle submit logic
    if (!email) {
      setError('Please enter your email to continue.');
      return;
    }
    await sendResetEmail(email);
  };

  // handle logic when user asks for a Resend
  const handleResend = async () => {
    if (!email) {
      setError('Please enter your email to continue.');
      return;
    }
    await sendResetEmail(email);
  };

  //=====================================================================================================================================================================
  return (
    <div className="min-h-screen flex">
      {/* Left side - operation ========================================================*/}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8" style={{marginTop:'-20px'}}>
        
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <img className='w-40 h-40 mx-auto' src={busTrackerLogo}/>
            <h1 className="text-4xl font-bold mb-2" style={{color: burgundy}}>Near East University</h1>
            <h1 className="text-4xl font-bold mb-2" style={{color: burgundy}}>Bus Tracker</h1>
            <p className="text-2xl font-bold mb-2 mt-5" style={{color: burgundy}}>Admin Login</p>
          </div>


          {/* chagne the screen content accoring to the state of EmailSent--------------------------------------------------------------------------------- */}
          {!EmailSent ? (
            
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <h1 className="block font-semibold text-black mb-2 mt-10">Forgot your Password?</h1>
            <p className="block font-semibold text-gray-500 mb-8">No stress. Enter the email associated with your account and we'll send you a reset link to get you back on track</p>



            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent outline-none transition focus:ring-red-900"
                placeholder="Enter your email"
                required
              />
            </div>

        
            <button
              type="submit"
              className="w-full text-white py-3 px-4 rounded-lg transition duration-200 font-medium hover:bg-blue-500"
              style={{backgroundColor: burgundy}}
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Submit'}
            </button>
          </form>
        ) : (
          //------------------------------------------------------------------------------
          <>
          <div className="text-center">
            <p className="text-lg font-medium text-gray-700 mb-3">
              Please check your Email, We have sent a Password Reset link.
            </p>
            <p className="text-base font-medium text-gray-700">
              Didn't receive an email?{' '}
              <button
                type="button"
                onClick={handleResend}
                className="font-semibold hover:underline disabled:opacity-60"
                style={{color: burgundy}}
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Resend'}
              </button>
            </p>

          </div>
          </>
        )}

          
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

export default ForgotPassword;
