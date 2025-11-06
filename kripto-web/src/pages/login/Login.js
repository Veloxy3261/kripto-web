import React, { useState, useEffect, useRef } from 'react';
import { IoEye, IoEyeOffSharp } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import CryptoJS from 'crypto-js';
import { useAuth } from '../../authContext';
import { fetchData } from '../../firestore';
import './login.css';

function LoginPage() {
  const [showed, setShowed] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [account, setAccount] = useState([]);
  const { login } = useAuth();
  const navigate = useNavigate();

  const unameRef = useRef(null);
  const passRef = useRef(null);
  const circleRef = useRef(null);

  // efek animasi circle (opsional)
  const moveCircle = (targetRef) => {
    if (!circleRef.current || !targetRef.current) return;
    const elementPos = targetRef.current.getBoundingClientRect();
    const circle = circleRef.current;
    circle.animate(
      {
        left: `${elementPos.left - circle.clientHeight / 2}px`,
        top: `${elementPos.top - circle.clientWidth / 2}px`,
      },
      { duration: 500, fill: 'forwards' }
    );
  };

  const loadUsers = async () => {
    const fetchedUsers = await fetchData('account');
    setAccount(fetchedUsers);
  };

  const handleLogin = async () => {
    if (!username || !password) {
      alert('Please fill in all fields');
      return;
    } else if (password.length < 8) {
      alert('Need longer password');
      return;
    }

    const hashedUsername = CryptoJS.SHA224(username).toString();
    const hashedPassword = CryptoJS.SHA224(password).toString();

    await loadUsers();

    if (account.some((acc) => acc.username === hashedUsername && acc.password === hashedPassword)) {
      alert('Login success');
      login(username);
      navigate('/');
    } else if (account.some((acc) => acc.username === hashedUsername)) {
      alert('Wrong password');
    } else {
      alert('Username not found');
    }
  };

  const showPassword = () => {
    // toggle status password
    setShowed(!showed);
  };

  useEffect(() => {
    loadUsers();
    circleRef.current = document.querySelector('.circle');
  }, []);

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
