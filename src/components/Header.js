import { Link } from 'react-router-dom';
import logo from '../images/logo.svg';
import { useState } from 'react';

function Header() {
  const [showSettings, setShowSettings] = useState(false);
  let hideTimeout = null;

  const handleMouseEnter = () => {
    clearTimeout(hideTimeout); // Отменяем таймер скрытия, если он запущен
    setShowSettings(true);
  };

  const handleMouseLeave = () => {
    hideTimeout = setTimeout(() => {
      setShowSettings(false);
    }, 2000); // Устанавливаем задержку в 2 секунды
  };

  return (
    <header className="header">
      <img className="header__logo" alt="header__logo" src={logo} />
      <p className="header__name">GameNet</p>
      <div className="header__links">
        <Link to="/home" className="header__link">Home</Link>
        <Link to="/feed" className="header__link">Feed</Link>
        <Link to="/founder" className="header__link">Founder</Link>
      </div>
      <nav className="navbar">
        <button className="navbar__icon navbar__icon_search"></button>
        <button className="navbar__icon navbar__icon_notifications"></button>
        <div
          className="navbar__icon navbar__icon_settings"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Попап настроек */}
          {showSettings && (
            <div className="settings-popup" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
              <Link to="/profile-settings" className="settings-popup__item">Profile Settings</Link>
              <Link to="/survey" className="settings-popup__item">Recommendation Survey</Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;
