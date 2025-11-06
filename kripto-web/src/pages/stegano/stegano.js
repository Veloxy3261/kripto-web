import React, { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../../authContext";
import "./dashboard.css";

const Stegano = () => {
	const [message, setMessage] = useState("");
	const [key, setKey] = useState(3); // default shift Caesar
	const [selectedFile, setSelectedFile] = useState(null);
	const [encryptedImageURL, setEncryptedImageURL] = useState(null);
	const [extractedMessage, setExtractedMessage] = useState(null);

	const { user } = useAuth();
	if (!user) return <Navigate to="/login" />;

	// 🔐 Caesar Cipher Encryption
	const caesarEncrypt = (text, shift) => {
		return text
			.split("")
			.map((char) => {
				if (/[a-z]/.test(char)) {
					return String.fromCharCode(
						((char.charCodeAt(0) - 97 + shift) % 26) + 97
					);
				} else if (/[A-Z]/.test(char)) {
					return String.fromCharCode(
						((char.charCodeAt(0) - 65 + shift) % 26) + 65
					);
				}
				return char;
			})
			.join("");
	};

	// 🔓 Caesar Cipher Decryption
	const caesarDecrypt = (text, shift) => {
		return caesarEncrypt(text, (26 - shift) % 26);
	};

	// 🖼️ LSB Embed
	const handleSteganographyEncrypt = () => {
		if (!selectedFile || !message) {
			alert("Pilih gambar dan isi pesan terlebih dahulu!");
			return;
		}

		const encryptedMessage = caesarEncrypt(message, parseInt(key));
		const reader = new FileReader();

		reader.onload = () => {
			const img = new Image();
			img.onload = () => {
				const canvas = document.createElement("canvas");
				const ctx = canvas.getContext("2d");
				canvas.width = img.width;
				canvas.height = img.height;
				ctx.drawImage(img, 0, 0);

				const imageData = ctx.getImageData(0, 0, img.width, img.height);
				const data = imageData.data;

				// convert message to bits
				const messageBits = Array.from(encryptedMessage)
					.flatMap((char) =>
						char
							.charCodeAt(0)
							.toString(2)
							.padStart(8, "0")
							.split("")
							.map(Number)
					);

				const lengthBits = messageBits.length
					.toString(2)
					.padStart(32, "0")
					.split("")
					.map(Number);

				const totalBits = lengthBits.concat(messageBits);

				// hide bits in LSB
				for (let i = 0; i < totalBits.length; i++) {
					data[i * 4] = (data[i * 4] & ~1) | totalBits[i];
				}

				ctx.putImageData(imageData, 0, 0);

				canvas.toBlob((blob) => {
					const url = URL.createObjectURL(blob);
					setEncryptedImageURL(url);
					alert("Pesan berhasil disisipkan dan terenkripsi!");
				});
			};
			img.src = reader.result;
		};
		reader.readAsDataURL(selectedFile);
	};

	// 🧩 LSB Extract
	const handleSteganographyDecrypt = () => {
		if (!selectedFile) {
			alert("Pilih gambar terlebih dahulu!");
			return;
		}

		const reader = new FileReader();
		reader.onload = () => {
			const img = new Image();
			img.onload = () => {
				const canvas = document.createElement("canvas");
				const ctx = canvas.getContext("2d");
				canvas.width = img.width;
				canvas.height = img.height;
				ctx.drawImage(img, 0, 0);

				const imageData = ctx.getImageData(0, 0, img.width, img.height);
				const data = imageData.data;

				const lengthBits = [];
				for (let i = 0; i < 32; i++) {
					lengthBits.push(data[i * 4] & 1);
				}

				const messageLength = parseInt(lengthBits.join(""), 2);
				const messageBits = [];

				for (let i = 32; i < 32 + messageLength; i++) {
					messageBits.push(data[i * 4] & 1);
				}

				const extractedText = String.fromCharCode(
					...Array.from({ length: messageBits.length / 8 }, (_, i) =>
						parseInt(
							messageBits.slice(i * 8, i * 8 + 8).join(""),
							2
						)
					)
				);

				const decryptedText = caesarDecrypt(
					extractedText,
					parseInt(key)
				);
				setExtractedMessage(decryptedText);
				alert("Pesan berhasil diekstraksi dan didekripsi!");
			};
			img.src = reader.result;
		};
		reader.readAsDataURL(selectedFile);
	};

	return (
		<>
			<div className="container">
				<h1 className="header">LSB + Caesar Cipher Steganography</h1>

				<section>
					<textarea
						placeholder="Masukkan pesan rahasia..."
						value={message}
						onChange={(e) => setMessage(e.target.value)}
					/>

					<input
						type="number"
						min="1"
						max="25"
						value={key}
						onChange={(e) => setKey(e.target.value)}
						placeholder="Kunci Caesar Cipher"
					/>

					<input
						type="file"
						accept="image/*"
						onChange={(e) => setSelectedFile(e.target.files[0])}
					/>

					<div className="buttonCon">
						<button
							className="loginButton"
							onClick={handleSteganographyEncrypt}
						>
							<h3>Encrypt & Embed</h3>
							<div className="buttonBackground"></div>
						</button>

						<button
							className="loginButton"
							onClick={handleSteganographyDecrypt}
						>
							<h3>Extract & Decrypt</h3>
							<div className="buttonBackground"></div>
						</button>
					</div>

					{encryptedImageURL && (
						<a href={encryptedImageURL} download="stegano_lsb_caesar.png">
							Download Encrypted Image
						</a>
					)}

					{extractedMessage && (
						<p>
							<b>Extracted & Decrypted Message:</b> {extractedMessage}
						</p>
					)}
				</section>
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

export default Stegano;
