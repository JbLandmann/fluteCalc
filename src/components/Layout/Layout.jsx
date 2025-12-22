import { Outlet, NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LanguageSelector from '../LanguageSelector/LanguageSelector'

function Layout() {
  const { t } = useTranslation()

  return (
    <div className="container">
      <header>
        <h1 dangerouslySetInnerHTML={{ __html: t('app_title') }} />
        <LanguageSelector />
        <nav className="tabs">
          <NavLink 
            to="/flutecraft/xiao" 
            className={({ isActive }) => `tab-button ${isActive ? 'active' : ''}`}
          >
            {t('tab_xiao')}
          </NavLink>
          <NavLink 
            to="/flutecraft/acoustical" 
            className={({ isActive }) => `tab-button ${isActive ? 'active' : ''}`}
          >
            {t('tab_acoustical')}
          </NavLink>
          <NavLink 
            to="/flutecraft/benade" 
            className={({ isActive }) => `tab-button ${isActive ? 'active' : ''}`}
          >
            {t('tab_benade')}
          </NavLink>
        </nav>
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

export default Layout
