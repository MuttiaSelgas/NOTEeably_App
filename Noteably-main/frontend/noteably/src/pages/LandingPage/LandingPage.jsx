import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';
import Header from '../../components/Header';


function LandingPage() {
    return (
        <div className="landing-container">
            <Header />

            <main className="main-content">
                <div className="content-box">
                    <img src="/ASSETS/welcome.png" alt="Welcome" className="welcome-image" />
                    <p className="cta-text">Sign in to make study life easier, one feature at a time!</p>
                    <Link to="/register">
                        <button className="Lregister-button">Register</button>
                    </Link>
                </div>
            </main>
        </div>
    );
}

export default LandingPage;
