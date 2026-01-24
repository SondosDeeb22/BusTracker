//===============================================================================================
//? Importing
//===============================================================================================

import axios from 'axios';
import { COLORS } from '../../styles/colorPalette';
import { useTranslation } from 'react-i18next';

//===============================================================================================
//? Types
//===============================================================================================

type RemoveServicePatternProps = {
  open: boolean;
  backendBaseUrl: string;
  servicePatternId: string | null;
  title: string | null;
  onClose: () => void;
  onDeleted: (message: string) => void;
  onRefresh: () => Promise<void>;
};

//===============================================================================================
//? Component
//===============================================================================================

const RemoveServicePattern = ({
  open,
  backendBaseUrl,
  servicePatternId,
  title,
  onClose,
  onDeleted,
  onRefresh,
}: RemoveServicePatternProps) => {
  const { t } = useTranslation('servicePatterns');
  if (!open || !servicePatternId) {
    return null;
  }

  const label = title?.trim() ? title.trim() : servicePatternId;

  const onConfirm = async () => {
    const res = await axios.delete(`${backendBaseUrl}/api/admin/service-pattern/remove`, {
      withCredentials: true,
      data: { servicePatternId },
    });

    void res;
    onDeleted(t('success.removed'));
    onClose();
    await onRefresh();
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-3">{t('removeDialog.title')}</h2>
        <div className="text-gray-700 mb-6">{t('removeDialog.confirmText', { label })}</div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            {t('removeDialog.cancel')}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 text-white rounded-md"
            style={{ background: COLORS.burgundy }}
          >
            {t('removeDialog.confirm')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RemoveServicePattern;
