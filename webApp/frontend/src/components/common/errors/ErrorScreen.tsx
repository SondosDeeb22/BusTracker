// ============================================================
//? Importing
// ============================================================
import React from 'react';
import { COLORS } from '../../../styles/colorPalette';
import BusLogoWhite from '../../../assets/BusLogoWhite.png';


// ========================================================
interface ErrorScreenProps {
  title: string;
  message: string;
  helpText?: string;
  actionHref?: string;
  actionLabel?: string;
  showLanguageSwitcher?: React.ReactNode;
}

const ErrorScreen: React.FC<ErrorScreenProps> = ({
  title,
  message,
  helpText,
  actionHref,
  actionLabel,
  showLanguageSwitcher,
}) => {
  return (
    <div className="relative flex items-center justify-center min-h-screen px-4" style={{ backgroundColor: '#faf7f7' }}>
      {showLanguageSwitcher}

      <div className="w-full max-w-lg rounded-2xl shadow-lg bg-white overflow-hidden" style = {{ border: `1px solid ${COLORS.burgundy}22` }}>
        <div className="px-6 py-6" style={{ backgroundColor: '#fff' }}>
          <div className="flex items-center justify-center mb-4">
            <div
              className="w-25 h-25 rounded-xl flex items-center justify-center"
              style={{ border: `1px solid ${COLORS.burgundy}22` }}
            >
              <img src={BusLogoWhite} alt="Bus logo" className="w-23 h-23 object-contain" />
            </div>
          </div>

          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2" style={{ color: COLORS.burgundy }}>
              {title}
            </h1>
            <p className="text-gray-700 mb-3">{message}</p>
            {helpText ? <p className="text-sm text-gray-500">{helpText}</p> : null}
          </div>
        </div>

        {actionHref && actionLabel ? (
          <div className="px-6 py-5 border-t bg-gray-50 flex items-center justify-center" style = {{ border: `1px solid ${COLORS.burgundy}22` }}>
            <a
              href={actionHref}
              className="inline-flex items-center justify-center px-6 py-2.5 text-white rounded-lg hover:bg-red-900 transition-colors"
              style={{ backgroundColor: COLORS.burgundy }}
            >
              {actionLabel}
            </a>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ErrorScreen;
