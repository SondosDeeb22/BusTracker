import React from 'react';
import { isRouteErrorResponse, useRouteError } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ErrorScreen from './ErrorScreen';
import LanguageSwitcher from './LanguageSwitcher';
import { burgundy } from '../styles/colorPalette';

const RouterErrorElement: React.FC = () => {
  const error = useRouteError();
  const { t } = useTranslation('translation');

  const languageSwitcher = (
    <div className="absolute top-4 right-4 z-50">
      <div className="px-2 py-1 rounded-md" style={{ backgroundColor: burgundy }}>
        <LanguageSwitcher />
      </div>
    </div>
  );

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return (
        <ErrorScreen
          title={t('common.pages.errorScreen.notFound.title', { defaultValue: '404' })}
          message={t('common.pages.errorScreen.notFound.message', { defaultValue: 'Page not found' })}
          helpText={t('common.pages.errorScreen.notFound.helpText', {
            defaultValue: "The page you’re looking for doesn’t exist or was moved.",
          })}
          actionHref="/"
          actionLabel={t('common.pages.errorScreen.actions.home', { defaultValue: 'Home' })}
          showLanguageSwitcher={languageSwitcher}
        />
      );
    }

    return (
      <ErrorScreen
        title={String(error.status)}
        message={error.statusText}
        helpText={t('common.pages.errorScreen.generic.helpText', {
          defaultValue: 'Please try again or go back to the homepage.',
        })}
        actionHref="/"
        actionLabel={t('common.pages.errorScreen.actions.home', { defaultValue: 'Home' })}
        showLanguageSwitcher={languageSwitcher}
      />
    );
  }

  return (
    <ErrorScreen
      title={t('common.pages.errorScreen.generic.title', { defaultValue: 'Error' })}
      message={
        error instanceof Error
          ? error.message
          : t('common.pages.errorScreen.unexpected.message', { defaultValue: 'Unexpected error' })
      }
      helpText={t('common.pages.errorScreen.generic.helpText', {
        defaultValue: 'Please try again or go back to the homepage.',
      })}
      actionHref="/"
      actionLabel={t('common.pages.errorScreen.actions.home', { defaultValue: 'Home' })}
      showLanguageSwitcher={languageSwitcher}
    />
  );
};

export default RouterErrorElement;
