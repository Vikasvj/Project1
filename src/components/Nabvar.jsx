import { Link } from 'react-router-dom';
import {useAuth} from "../context/AuthContext";
const Navbar = () => {
  const {user,logout}= useAuth();
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
            {!user && <Link to="/login" style={{ color: 'white' }}>Login</Link>}
           {!user &&  <Link to="/register" style={{ color: 'white' }}>Register</Link>}
            {user && <Link to="/profile" style={{ color: 'white' }}>Profile</Link>}
            {user && <button onClick={logout}>Logout</button>}
        </nav>
    );
};

export default Navbar;