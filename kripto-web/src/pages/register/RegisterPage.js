import React, { useState, useEffect, useRef } from 'react';
import './register.css';
import { IoEye, IoEyeOffSharp } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { sendData, fetchData } from '../../firestore';
import CryptoJS from 'crypto-js';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVal, setPasswordVal] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showPassVal, setShowPassVal] = useState(false);
  const [account, setAccount] = useState([]);

  const navigate = useNavigate();
  const unameRef = useRef(null);
  const passRef = useRef(null);
  const passValRef = useRef(null);
  const circleRef = useRef(null);

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

  const Register = async () => {
    if (!username || !password || !passwordVal) {
      alert('Please fill in all fields');
      return;
    } else if (password.length < 8 || passwordVal.length < 8) {
      alert('Need longer password');
      return;
    } else if (password !== passwordVal) {
      alert('Password and confirmation did not match');
      return;
    }

    const hashedUsername = CryptoJS.SHA224(username).toString();
    const hashedPassword = CryptoJS.SHA224(password).toString();

    await loadUsers();

    if (account.some(acc => acc.username === hashedUsername)) {
      alert('Username already exists');
      return;
    }

    const inputAccount = {
      username: hashedUsername,
      password: hashedPassword,
    };

    await sendData('account', inputAccount);
    alert('User added successfully!');
    navigate('/login');
  };

  useEffect(() => {
    loadUsers();
    circleRef.current = document.querySelector('.circle');
  }, []);

  return (
    <>
      <div className="register">
        <h1 className="title">REGISTER</h1>
        <div className="inputContainer">
          {/* Username */}
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

          {/* Password */}
          <div className="inputdiv">
            <input
              type={showPass ? "text" : "password"}
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
              onClick={() => setShowPass(!showPass)}
              onFocus={() => moveCircle(passRef)}
            >
              {showPass ? <IoEye /> : <IoEyeOffSharp />}
            </button>
          </div>

          {/* Password Validation */}
          <div className="inputdiv">
            <input
              type={showPassVal ? "text" : "password"}
              name="passVal"
              id="passVal"
              required
              value={passwordVal}
              ref={passValRef}
              onFocus={() => moveCircle(passValRef)}
              onChange={e => setPasswordVal(e.target.value)}
            />
            <label htmlFor="passVal">Confirm Password</label>
            <button
              type="button"
              className="material-symbols-outlined show"
              onClick={() => setShowPassVal(!showPassVal)}
              onFocus={() => moveCircle(passValRef)}
            >
              {showPassVal ? <IoEye /> : <IoEyeOffSharp />}
            </button>
          </div>
        </div>

        {/* Register Button */}
        <button className="registerButton" onClick={Register}>
          <h3>Register</h3>
          <div className="buttonBackground"></div>
        </button>

        <Link to="/login">login</Link>
      </div>

      {/* Animated circle */}
      <div className="circle"></div>
    </>
  );
}

export default RegisterPage;
