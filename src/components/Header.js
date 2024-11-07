import logo from '../images/logo.svg';

function Header() {
    return (
        <header className="header">
            <img className="header__logo" alt="header__logo" src={logo} />
            <p className="header__name">GameNet</p>
            <div className="header__links">
                <a href="/" className="header__link">Home</a>
                <a href="/" className="header__link">Discover</a>
                <a href="/" className="header__link">Esports</a>
                <a href="/" className="header__link">Game Events</a>
            </div>
            <nav className="navbar">
                <button className="navbar__icon navbar__icon_search"></button>
                <button className="navbar__icon navbar__icon_notifications"></button>
                <button className="navbar__icon navbar__icon_profile"></button>
            </nav>
        </header>
    )
}

export default Header;