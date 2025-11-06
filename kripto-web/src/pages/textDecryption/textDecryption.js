import React, { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../../authContext";
import "./dashboard.css";

// Vigenère Cipher Functions
function isLetter(c) {
	return /[a-zA-Z]/.test(c);
}

function isUpperCase(c) {
	return /[A-Z]/.test(c);
}

function vigenereEncrypt(message, key) {
	let result = "";
	for (let i = 0, j = 0; i < message.length; i++) {
		const c = message.charAt(i);
		if (isLetter(c)) {
			if (isUpperCase(c)) {
				result += String.fromCharCode(
					((c.charCodeAt(0) - 65 + key.toUpperCase().charCodeAt(j) - 65) %
						26) +
						65
				); // A: 65
			} else {
				result += String.fromCharCode(
					((c.charCodeAt(0) - 97 + key.toLowerCase().charCodeAt(j) - 97) %
						26) +
						97
				); // a: 97
			}
			j = ++j % key.length;
		} else {
			result += c;
		}
	}
	return result;
}

function vigenereDecrypt(message, key) {
	let result = "";
	for (let i = 0, j = 0; i < message.length; i++) {
		const c = message.charAt(i);
		if (isLetter(c)) {
			if (isUpperCase(c)) {
				result += String.fromCharCode(
					((c.charCodeAt(0) -
						65 -
						(key.toUpperCase().charCodeAt(j) - 65) +
						26) %
						26) +
						65
				); // A: 65
			} else {
				result += String.fromCharCode(
					((c.charCodeAt(0) -
						97 -
						(key.toLowerCase().charCodeAt(j) - 97) +
						26) %
						26) +
						97
				); // a: 97
			}
			j = ++j % key.length;
		} else {
			result += c;
		}
	}
	return result;
}

// Playfair Cipher Functions
function createPlayfairMatrix(key) {
	let matrix = [];
	let seen = new Set();
	key = key.toUpperCase().replace(/[^A-Z]/g, "").replace(/J/g, "I"); // Remove non-alphabet, replace J with I

	// Create 5x5 matrix using the key and the rest of the alphabet
	for (let char of key) {
		if (!seen.has(char)) {
			seen.add(char);
			matrix.push(char);
		}
	}

	for (let i = 65; i <= 90; i++) {
		let char = String.fromCharCode(i);
		if (!seen.has(char) && char !== "J") {
			matrix.push(char);
			seen.add(char);
		}
	}
	return matrix;
}

// RC4 Encryption and Decryption
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

// Super Encryption using all three algorithms
function superEncrypt(text, key) {
	const vigenereEncrypted = vigenereEncrypt(text, key);
	return rc4(key, vigenereEncrypted);
}

function superDecrypt(text, key) {
	const rc4Decrypted = rc4(key, text);
	return vigenereDecrypt(rc4Decrypted, key);
}

const TextDecryption = () => {
	// States for Vigenere Cipher
	const [vigenereInput, setVigenereInput] = useState("");
	const [vigenereKey, setVigenereKey] = useState("");
	const [vigenereOutput, setVigenereOutput] = useState("");
	// BUGFIX: Removed isVigenereEncrypt state

	// States for RC4
	const [xorInput, setXorInput] = useState("");
	const [xorKey, setXorKey] = useState("");
	const [xorOutput, setXorOutput] = useState("");
	// BUGFIX: Removed isXorEncrypt state

	// States for Super Encryption
	const [superOutput, setSuperOutput] = useState("");

	const { user, logout } = useAuth();

	const [selectedOption, setSelectedOption] = useState("vigenere");

	if (!user) {
		return <Navigate to="/login" />;
	}

	// BUGFIX: handleVigenere now accepts a 'mode' parameter
	const handleVigenere = (mode) => {
		const result =
			mode === "encrypt"
				? vigenereEncrypt(vigenereInput, vigenereKey)
				: vigenereDecrypt(vigenereInput, vigenereKey);
		setVigenereOutput(result);
	};

	// BUGFIX: handleXor is simplified as RC4 encrypt/decrypt is the same
	const handleXor = () => {
		const result = rc4(xorKey, xorInput);
		setXorOutput(result);
	};

	const handleSuperEncrypt = () => {
		const result = superEncrypt(vigenereInput, vigenereKey);
		setSuperOutput(result);
	};

	const handleSuperDecrypt = () => {
		const result = superDecrypt(vigenereInput, vigenereKey);
		setSuperOutput(result);
	};

	return (
		<>
			<div className="container">
				<h1 className="header">Kriptono</h1>

				<select
					value={selectedOption}
					onChange={(e) => setSelectedOption(e.target.value)}
				>
					<option value="vigenere">Vigenere Cipher</option>
					<option value="rc4">RC4 Cipher</option>
					<option value="super">Super Encryption</option>
				</select>

				{selectedOption === "vigenere" && (
					<section>
						<h2>Vigenère Cipher</h2>
						<textarea
							placeholder="Input text"
							value={vigenereInput}
							onChange={(e) => setVigenereInput(e.target.value)}
						/>
						<input
							type="text"
							placeholder="Key"
							value={vigenereKey}
							onChange={(e) => setVigenereKey(e.target.value)}
						/>
						<div className="buttonCon">
							{/* BUGFIX: Pass 'encrypt' directly to handler */}
							<button
								className="loginButton"
								onClick={() => {
									handleVigenere("encrypt");
								}}
							>
								<h3>Encrypt</h3>
								<div className="buttonBackground"></div>
							</button>
							{/* BUGFIX: Pass 'decrypt' directly to handler */}
							<button
								className="loginButton"
								onClick={() => {
									handleVigenere("decrypt");
								}}
							>
								<h3>Decrypt</h3>
								<div className="buttonBackground"></div>
							</button>
						</div>
						<textarea
							readOnly
							value={vigenereOutput}
							placeholder="Output will appear here"
						/>
					</section>
				)}

				{selectedOption === "rc4" && (
					<section>
						<h2>RC4 Cipher</h2>
						<textarea
							placeholder="Input text"
							value={xorInput}
							onChange={(e) => setXorInput(e.target.value)}
						/>
						<input
							type="text"
							placeholder="Key"
							value={xorKey}
							onChange={(e) => setXorKey(e.target.value)}
						/>
						<div className="buttonCon">
							{/* BUGFIX: Just call handleXor, no state needed */}
							<button
								className="loginButton"
								onClick={handleXor}
							>
								<h3>Encrypt</h3>
								<div className="buttonBackground"></div>
							</button>
							{/* BUGFIX: Just call handleXor, no state needed */}
							<button
								className="loginButton"
								onClick={handleXor}
							>
								<h3>Decrypt</h3>
								<div className="buttonBackground"></div>
							</button>
						</div>
						<textarea
							readOnly
							value={xorOutput}
							placeholder="Output will appear here"
						/>
					</section>
				)}

				{selectedOption === "super" && (
					<section>
						<h2>Super Encryption</h2>
						<textarea
							placeholder="Input text"
							value={vigenereInput}
							onChange={(e) => setVigenereInput(e.target.value)}
						/>
						<input
							type="text"
							placeholder="Key"
							value={vigenereKey}
							onChange={(e) => setVigenereKey(e.target.value)}
						/>
						<div className="buttonCon">
							{/* This section was already correct */}
							<button
								className="loginButton"
								onClick={handleSuperEncrypt}
							>
								<h3>Encrypt</h3>
								<div className="buttonBackground"></div>
							</button>
							<button
								className="loginButton"
								onClick={handleSuperDecrypt}
							>
								<h3>Decrypt</h3>
								<div className="buttonBackground"></div>
							</button>
						</div>
						<textarea
							readOnly
							value={superOutput}
							placeholder="Output will appear here"
						/>
					</section>
				)}
			</div>

			<Link to="/">
				<button className="loginButton logout">
					Back
					<div className="buttonBackground"></div>
				</button>
			</Link>
		</>
	);
};

export default TextDecryption;