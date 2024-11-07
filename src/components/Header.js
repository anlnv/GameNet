import logo from '../images/logo.svg';



function Header() {
    return (
        <header className="header">
            <img className="header__logo" alt="header__logo" src={logo} />
            <p className="header__name">GameNet</p>
        </header>
    )
}

export default Header;