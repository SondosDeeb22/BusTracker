//======================================================================================
//? Importing
//======================================================================================
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { apiClient } from '../../services/apiClient'

import { COLORS } from '../../styles/colorPalette'
import { textColorForBackground } from '../../styles/colorHelper'

//======================================================================================
//? Types
//======================================================================================

type TodayScheduleRoute = {
  routeName: string
  tabColorValue: number
  departureTimes: string[]
}

type TodayScheduleServicePattern = {
  servicePatternId: string
  title: string
  operatingTimes: string[]
  routes: TodayScheduleRoute[]
}

type TodayScheduleDay = {
  dayKey: string
  date: string
  servicePatterns: TodayScheduleServicePattern[]
}

//======================================================================================
//? TodayScheduleWidget
//======================================================================================
const TodayScheduleWidget = () => {
  const { t } = useTranslation('homepage/operatingBuses')
  const { t: tGlobal } = useTranslation('translation')

  const [days, setDays] = useState<TodayScheduleDay[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchToday = async () => {
      try {
        const response = await apiClient.get('/api/admin/schedule/today')
        const actualData = response.data.data || []
        setDays(actualData)
      } catch (err) {
        void err
        setError(tGlobal('common.errors.internal'))
      } finally {
        setLoading(false)
      }
    }

    fetchToday()
  }, [t])

  const servicePatterns = useMemo(() => {
    const firstDay = days[0]
    return firstDay?.servicePatterns || []
  }, [days])

  const headerDate = useMemo(() => {
    const firstDay = days[0]
    return firstDay?.date || ''
  }, [days])

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
          {headerDate ? t('todayScheduleWithDate', { date: headerDate }) : t('todaySchedule')}
        </p>

        {servicePatterns.length === 0 ? (
          <p className="text-gray-500">{t('noSchedulesToday')}</p>
        ) : (
          <div className="flex flex-col gap-5">
            {servicePatterns.map((sp) => (
              <div key={sp.servicePatternId || sp.title} className="border border-gray-200 rounded-lg p-4">
                <p className="text-base text-black font-semibold mb-3">{sp.title || sp.servicePatternId}</p>

                {sp.routes.length === 0 ? (
                  <p className="text-gray-500">{t('noRoutes')}</p>
                ) : (
                  <div className="flex flex-col gap-3">
                    {sp.routes.map((r) => {
                      const v = Number(r.tabColorValue) >>> 0
                      const bg = `#${(v & 0x00ffffff).toString(16).padStart(6, '0')}`
                      const textColor = textColorForBackground(bg)

                      return (
                        <div
                          key={r.routeName}
                          className="rounded-lg px-4 py-3 font-semibold w-full min-w-0 border border-white/40"
                          style={{ backgroundColor: bg, color: textColor }}
                        >
                          <div className="text-sm opacity-90">{r.routeName}</div>
                          <div className="text-base break-words">
                            {(r.departureTimes || []).join('  |  ')}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

//======================================================================================
export default TodayScheduleWidget
