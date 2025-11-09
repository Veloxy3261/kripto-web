import React, { useState, useEffect, useRef } from 'react';
import { IoEye, IoEyeOffSharp } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import CryptoJS from 'crypto-js'; // <-- TETAP ADA
import { useAuth } from '../../authContext'; // <-- TAMBAHKAN INI
// HAPUS: import { fetchData } from '../../firestore';
import './login.css';

function LoginPage() {
  const [showed, setShowed] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // HAPUS: const [account, setAccount] = useState([]);
  const { login } = useAuth(); // <-- UBAH INI
  const navigate = useNavigate();

  const unameRef = useRef(null);
  const passRef = useRef(null);
  const circleRef = useRef(null);

  // efek animasi circle (opsional)
  const moveCircle = (targetRef) => {
    // ... (kode moveCircle tetap sama)
  };

  // HAPUS: const loadUsers = ...

  const handleLogin = async () => {
    if (!username || !password) {
      alert('Please fill in all fields');
      return;
    } else if (password.length < 8) {
      alert('Need longer password');
      return;
    }

    // SHA224 TETAP DI SINI (seperti kode asli Anda)
    const hashedUsername = CryptoJS.SHA224(username).toString();
    const hashedPassword = CryptoJS.SHA224(password).toString();

    try {
      // Kirim HASHED username dan HASHED password ke authContext
      // authContext akan menerimanya sebagai 'email' dan 'password'
      const data = await login(hashedUsername, hashedPassword);

      if (data.status === 'success') {
        alert('Login success');
        // 'login' dari context TIDAK DIPAKAI untuk set user di sini,
        // karena kita hanya memvalidasi hash
        navigate('/');
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred during login.');
    }
  };

  const showPassword = () => {
    // toggle status password
    setShowed(!showed);
  };

  useEffect(() => {
    // HAPUS: loadUsers();
    circleRef.current = document.querySelector('.circle');
  }, []);

  // ... (return JSX tetap sama)
  return (
    <>
      <div className="login">
        <h1 className="title">LOGIN DULU BRO</h1>
        <div className="inputContainer">
          <div className="inputdiv">
            <input
              type="text"
              name="username"
              id="uname"
              required
              value={username}
              ref={unameRef}
              onFocus={() => moveCircle(unameRef)}
              onChange={e => setUsername(e.target.value)}
            />
            <label htmlFor="uname">Username</label>
          </div>
          <div className="inputdiv">
            <input
              type={showed ? 'text' : 'password'}
              name="pass"
              id="pass"
              required
              value={password}
              ref={passRef}
              onFocus={() => moveCircle(passRef)}
              onChange={e => setPassword(e.target.value)}
            />
            <label htmlFor="pass">Password</label>
            <button
              type="button"
              className="material-symbols-outlined show"
              onClick={showPassword}
              onFocus={() => moveCircle(passRef)}
            >
              {showed ? <IoEye /> : <IoEyeOffSharp />}
            </button>
          </div>
        </div>
        <button className="loginButton" onClick={handleLogin}>
          <h3>Login</h3>
          <div className="buttonBackground"></div>
        </button>
        <Link to="/register">register</Link>
      </div>

      {/* elemen animasi lingkaran */}
      <div className="circle"></div>
    </>
  );
}

export default LoginPage;