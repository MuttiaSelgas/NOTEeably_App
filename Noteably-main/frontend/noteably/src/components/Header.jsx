import { Link } from 'react-router-dom';
import '../index.css'; // if styles are separate

const Header = () => {
    return (
        <header className="header">
        <Link to="/">
            <img src="/ASSETS/noteably_logo.png" alt="Noteably Logo" className="logo" />
        </Link>
        <div className="auth-buttons"> {/* This wraps both buttons */}
            <Link to="/register">
            <button className="auth-button register">Register</button>
            </Link>
            <Link to="/login">
            <button className="auth-button login">Log In</button>
            </Link>
        </div>
        </header>

    );
};

export default Header;
