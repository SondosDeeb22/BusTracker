// ============================================================
//? Importing
// ============================================================
import React from 'react';
import { useTranslation } from 'react-i18next';
import ErrorScreen from './ErrorScreen';
import LanguageSwitcher from '../LanguageSwitcher';
import { burgundy } from '../../../styles/colorPalette';

// ============================================================

const NotFoundPage: React.FC = () => {
  const { t } = useTranslation('translation');

  return (
    <ErrorScreen
      title={t('common.pages.errorScreen.notFound.title', { defaultValue: '404' })}
      message={t('common.pages.errorScreen.notFound.message', { defaultValue: 'Page not found' })}
      helpText={t('common.pages.errorScreen.notFound.helpText', {
        defaultValue: "The page you’re looking for doesn’t exist or was moved",
      })}
      actionHref="/"
      actionLabel={t('common.pages.errorScreen.actions.login', { defaultValue: 'login' })}
      showLanguageSwitcher={(
        <div className="absolute top-4 right-4 z-50">
          <div className="px-2 py-1 rounded-md" style={{ backgroundColor: burgundy }}>
            <LanguageSwitcher />
          </div>
        </div>
      )}
    />
  );
};

export default NotFoundPage;
