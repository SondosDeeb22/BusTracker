//======================================================================================
//? Importing
//======================================================================================
import  { useState, useEffect } from 'react'
import axios from 'axios'
import { COLORS } from '../../styles/colorPalette'
import { useTranslation } from 'react-i18next'

// interface 
interface Route {
  title: string
  color: string
}

//======================================================================================

const OperatingBuses = () => {
  const { t } = useTranslation('homepage/operatingBuses')
  const { t: tGlobal } = useTranslation('translation')
  const [routes, setRoutes] = useState<Route[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const getOperatingRoutes = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/user/routes/operating')

        //console.log('API Response:', response.data)
        const actualData = response.data.data || []
        setRoutes(actualData)
        //console.log(response.data)
        //console.log([response.data] )
        //console.log(routes);
      } catch (err) {
        void err;
        setError(tGlobal('common.errors.internal'))
      } finally {
        setLoading(false)
      }
    }

    getOperatingRoutes()
  }, [t])

  if (loading) {
    return (
      <div className="bg-white rounded-lg border-2 p-6" style={{ borderColor: COLORS.burgundy }}>
        <p className="text-gray-500">{t('loading')}</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border-2 p-6" style={{ borderColor: COLORS.burgundy }}>
        <p className="text-gray-500">{t('errorPrefix')} {error}</p>
      </div>
    )
  }

  return (
    // view the Number of operating buses =================================================================================
    <div className="flex items-center justify-start m-20 ml-40">
      <div className="bg-white rounded-lg border-2 p-6" style={{ borderColor: COLORS.navbar }}>
        <p className="text-lg text-black font-semibold mb-4">
          {routes.length} {t('busesOperating')}
        </p>

        {/* view the title of operating buses -----------------------------------------       */}
        <div className="flex flex-col gap-3">
          {routes.map((route, index) => (
            <div
              key={index}
              className="px-4 py-2 rounded-lg text-white font-medium w-70"
              style={{ backgroundColor: route.color }} // ,width: 'fit-content'
            >
              {route.title}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}


//======================================================================================

export default OperatingBuses