import { Link } from 'react-router-dom';

const Navbar = () => {
    const navStyle = {
        display: 'flex',
        gap: '20px',
        padding: '1rem',
        background: '#333',
        color: 'white'
    };

    return (
        <nav style={navStyle}>
           <Link to="/" style={{ color: 'white' }}>Home</Link>
            <Link to="/login" style={{ color: 'white' }}>Login</Link>
            <Link to="/register" style={{ color: 'white' }}>Register</Link>
        </nav>
    );
};

export default Navbar;