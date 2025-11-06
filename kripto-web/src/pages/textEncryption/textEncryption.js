import React, { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../../authContext";
import "./dashboard.css";

// =======================
// Vigenere Cipher (ASCII MODE)
// =======================
function vigenereEncrypt(message, key) {
  let result = "";
  for (let i = 0; i < message.length; i++) {
    const charCode = message.charCodeAt(i);
    const keyCode = key.charCodeAt(i % key.length);
    // Geser dalam rentang 0–255 agar semua karakter ASCII bisa dienkripsi
    const encryptedCode = (charCode + keyCode) % 256;
    result += String.fromCharCode(encryptedCode);
  }
  return result;
}

function vigenereDecrypt(message, key) {
  let result = "";
  for (let i = 0; i < message.length; i++) {
    const charCode = message.charCodeAt(i);
    const keyCode = key.charCodeAt(i % key.length);
    const decryptedCode = (charCode - keyCode + 256) % 256;
    result += String.fromCharCode(decryptedCode);
  }
  return result;
}

// =======================
// RC4 Cipher
// =======================
function rc4(key, message) {
  let S = Array.from({ length: 256 }, (_, i) => i);
  let j = 0;
  for (let i = 0; i < 256; i++) {
    j = (j + S[i] + key.charCodeAt(i % key.length)) % 256;
    [S[i], S[j]] = [S[j], S[i]];
  }

  let i = 0;
  j = 0;
  let result = "";
  for (let k = 0; k < message.length; k++) {
    i = (i + 1) % 256;
    j = (j + S[i]) % 256;
    [S[i], S[j]] = [S[j], S[i]];
    result += String.fromCharCode(
      message.charCodeAt(k) ^ S[(S[i] + S[j]) % 256]
    );
  }
  return result;
}

// =======================
// Hybrid (Vigenere + RC4)
// =======================
function superEncrypt(text, key) {
  const vigenereEncrypted = vigenereEncrypt(text, key);
  return rc4(key, vigenereEncrypted);
}
function superDecrypt(text, key) {
  const rc4Decrypted = rc4(key, text);
  return vigenereDecrypt(rc4Decrypted, key);
}

// =======================
// Main Component
// =======================
const TextEncryptionPage = () => {
  const { user } = useAuth();
  const [text, setText] = useState("");
  const [key, setKey] = useState("");
  const [result, setResult] = useState("");
  const [algorithm, setAlgorithm] = useState("vigenere");
  const [mode, setMode] = useState("encrypt");

  if (!user) {
    return <Navigate to="/login" />;
  }

  const handleProcess = () => {
    if (!key) {
      setResult("Harap isi kunci terlebih dahulu!");
      return;
    }

    let output = "";
    switch (algorithm) {
      case "vigenere":
        output =
          mode === "encrypt"
            ? vigenereEncrypt(text, key)
            : vigenereDecrypt(text, key);
        break;
      case "rc4":
        output = rc4(key, text); // RC4 sama untuk encrypt & decrypt
        break;
      case "super":
        output =
          mode === "encrypt"
            ? superEncrypt(text, key)
            : superDecrypt(text, key);
        break;
      default:
        output = "Invalid algorithm selected.";
    }
    setResult(output);
  };

  return (
    <div className="container" style={{ maxWidth: "700px", margin: "0 auto" }}>
      <h1 className="header" style={{ marginBottom: "20px" }}>
        Super Enkripsi
      </h1>

      <div
        className="formSection"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          width: "100%",
        }}
      >
        <textarea
          placeholder="Masukkan teks di sini..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{
            width: "100%",
            minHeight: "100px",
            padding: "10px",
            borderRadius: "10px",
          }}
        />

        <input
          type="text"
          placeholder="Masukkan key"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "10px",
          }}
        />

        <label>⚙️ Pilih Algoritma</label>
        <select
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "10px",
          }}
        >
          <option value="vigenere">Vigenere Cipher</option>
          <option value="rc4">RC4 Cipher</option>
          <option value="super">Vigenere + RC4 (Hybrid)</option>
        </select>

        <label></label>
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "10px",
          }}
        >
          <option value="encrypt">Encrypt</option>
          <option value="decrypt">Decrypt</option>
        </select>

        <button
          className="loginButton"
          onClick={handleProcess}
          style={{
            width: "100%",
            marginTop: "10px",
            padding: "10px",
            fontSize: "16px",
            borderRadius: "10px",
          }}
        >
          <h3>{mode === "encrypt" ? "Enkripsi" : "Dekripsi"}</h3>
          <div className="buttonBackground"></div>
        </button>

        <textarea
          readOnly
          value={result}
          placeholder="Hasil akan muncul di sini..."
          style={{
            width: "100%",
            minHeight: "100px",
            padding: "10px",
            borderRadius: "10px",
            backgroundColor: "#f5f5f5",
            color: "#333",
          }}
        />
      </div>

      <Link to="/">
        <button
          className="loginButton logout"
          style={{ marginTop: "25px", width: "100%" }}
        >
          Kembali
          <div className="buttonBackground"></div>
        </button>
      </Link>
    </div>
  );
};

export default TextEncryptionPage;
