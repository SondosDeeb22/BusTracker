//======================================================================================
//? Importing
//======================================================================================
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { apiClient } from '../../services/apiClient'

import { COLORS } from '../../styles/colorPalette'

//======================================================================================
//? interface
//======================================================================================
interface ActiveDriver {
  id: string
  name?: string
  status?: string
}

//======================================================================================
//? ActiveDrivers
//======================================================================================
const ActiveDrivers = () => {
  const { t } = useTranslation('homepage/operatingBuses')
  const { t: tGlobal } = useTranslation('translation')

  const [drivers, setDrivers] = useState<ActiveDriver[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  //======================================================================================
  //? Fetch only Active drivers
  //======================================================================================
  useEffect(() => {
    const getActiveDrivers = async () => {
      try {
        const response = await apiClient.get('/api/admin/drivers/active')

        const actualData = response.data.data || []
        setDrivers(actualData)
      } catch (err) {
        void err
        setError(tGlobal('common.errors.internal'))
      } finally {
        setLoading(false)
      }
    }

    getActiveDrivers()
  }, [t])

  //======================================================================================
  if (loading) {
    return (
      <div className="w-full">
        <div className="bg-white rounded-lg border-2 p-6 w-full" style={{ borderColor: COLORS.burgundy }}>
          <p className="text-gray-500">{t('loading')}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full">
        <div className="bg-white rounded-lg border-2 p-6 w-full" style={{ borderColor: COLORS.burgundy }}>
          <p className="text-gray-500">{t('errorPrefix')} {error}</p>
        </div>
      </div>
    )
  }

  //======================================================================================
  return (
    <div className="w-full">
      <div className="bg-white rounded-lg border-2 p-6 w-full" style={{ borderColor: COLORS.navbar }}>
        <p className="text-lg text-black font-semibold mb-4">
          {drivers.length} {t('activeDrivers')}
        </p>

        <div className="flex flex-col gap-3">
          {drivers.map((driver, index) => (
            <div
              key={index}
              className="px-4 py-2 rounded-lg text-white font-medium w-full min-w-0 truncate"
              style={{ backgroundColor: COLORS.burgundy }}
            >
              {driver.id} - {driver.name || ''}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

//======================================================================================
export default ActiveDrivers
