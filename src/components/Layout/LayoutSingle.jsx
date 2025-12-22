import { Outlet } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LanguageSelector from '../LanguageSelector/LanguageSelector'

function LayoutSingle() {
  const { t } = useTranslation()

  return (
    <div className="container">
      <header>
        <h1>{t('app_title')}</h1>
        <LanguageSelector />
      </header>

      <main className="tab-content">
        <Outlet />
      </main>

      <footer>
        <p>{t('footer')}</p>
      </footer>
    </div>
  )
}

export default LayoutSingle
