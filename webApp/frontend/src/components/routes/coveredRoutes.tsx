//======================================================================================
//? Importing
//======================================================================================
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { apiClient } from '../../services/apiClient'

import { COLORS } from '../../styles/colorPalette'
import { textColorForBackground } from '../../styles/colorHelper'

//======================================================================================
//? interface
//======================================================================================
interface CoveredRoute {
  id: string
  title?: string
  color?: string
  status?: string
}

//======================================================================================
//? CoveredRoutes
//======================================================================================
const CoveredRoutes = () => {
  const { t } = useTranslation('homepage/operatingBuses')
  const { t: tGlobal } = useTranslation('translation')

  const [routes, setRoutes] = useState<CoveredRoute[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  //======================================================================================
  //? Fetch only Covered routes
  //======================================================================================
  useEffect(() => {
    const getCoveredRoutes = async () => {
      try {
        const response = await apiClient.get('/api/user/routes/operating')

        const actualData = response.data.data || []
        setRoutes(actualData)
      } catch (err) {
        void err
        setError(tGlobal('common.errors.internal'))
      } finally {
        setLoading(false)
      }
    }

    getCoveredRoutes()
  }, [t])

  const cards = useMemo(() => {
    return routes.map((r) => {
      const bg = r.color || COLORS.burgundy
      const textColor = textColorForBackground(bg)

      return {
        id: r.id,
        title: r.title || '',
        bg,
        textColor,
      }
    })
  }, [routes])

  //======================================================================================
  if (loading) {
    return (
      <div className="w-full mb-20">
        <div className="bg-white rounded-lg border-2 p-6 w-full" style={{ borderColor: COLORS.burgundy }}>
          <p className="text-gray-500">{t('loading')}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full mb-20">
        <div className="bg-white rounded-lg border-2 p-6 w-full" style={{ borderColor: COLORS.burgundy }}>
          <p className="text-gray-500">{t('errorPrefix')} {error}</p>
        </div>
      </div>
    )
  }

  //======================================================================================
  return (
    <div className="w-full mb-20">
      <div className="bg-white rounded-lg border-2 p-6 w-full" style={{ borderColor: COLORS.navbar }}>
        <p className="text-lg text-black font-semibold mb-4">
          {routes.length} {t('coveredRoutes')}
        </p>

        {/* view the cards of covered routes -----------------------------------------       */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((route) => (
            <div
              key={route.id}
              className="rounded-lg px-4 py-3 font-semibold w-full min-w-0 border border-white/40"
              style={{ backgroundColor: route.bg, color: route.textColor }}
            >
              <div className="text-sm opacity-90">{route.id}</div>
              <div className="text-base break-words">{route.title}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

//======================================================================================
export default CoveredRoutes
