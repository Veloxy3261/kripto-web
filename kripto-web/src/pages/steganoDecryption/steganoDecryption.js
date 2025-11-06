import React, { useState } from "react";
import CryptoJS from "crypto-js"; // For AES encryption/decryption
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../../authContext";
import "./dashboard.css";

const SteganoDecryption = () => {
	// States
	const [vigenereInput, setVigenereInput] = useState("");
	const [vigenereKey, setVigenereKey] = useState("");
	const [vigenereOutput, setVigenereOutput] = useState("");
	const [isVigenereEncrypt, setIsVigenereEncrypt] = useState(true);

	const [aesInput, setAesInput] = useState("");
	const [aesKey, setAesKey] = useState("");
	const [aesOutput, setAesOutput] = useState("");
	const [isAESEncrypt, setIsAESEncrypt] = useState(true);

	const [superOutput, setSuperOutput] = useState("");

	const [stegImage, setStegImage] = useState(null);
	const [stegInput, setStegInput] = useState("");
	const [stegOutput, setStegOutput] = useState("");

	const [fileInput, setFileInput] = useState(null);
	const [fileKey, setFileKey] = useState("");
	const [fileOutput, setFileOutput] = useState(null);

	const [selectedFile, setSelectedFile] = useState(null);
	const [message, setMessage] = useState("");
	const [encryptedImageURL, setEncryptedImageURL] = useState(null);
	const [extractedMessage, setExtractedMessage] = useState(null);
	const [decryptedFileURL, setDecryptedFileURL] = useState(null);

	const { user, logout } = useAuth();

	const [selectedOption, setSelectedOption] = useState("vigenere");

	if (!user) {
		return <Navigate to="/login" />;
	}

	const handleSteganographyEncrypt = () => {
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

				const messageBits = Array.from(message).flatMap((char) =>
					char
						.charCodeAt(0)
						.toString(2)
						.padStart(8, "0")
						.split("")
						.map(Number)
				);
				const messageLengthBits = messageBits.length
					.toString(2)
					.padStart(32, "0")
					.split("")
					.map(Number);
				const totalBits = messageLengthBits.concat(messageBits);

				const opaquePixelIndices = [];
				for (let i = 0; i < data.length / 4; i++) {
					if (data[i * 4 + 3] !== 0) opaquePixelIndices.push(i);
				}

				for (let i = 0; i < totalBits.length; i++) {
					const pixelIndex = opaquePixelIndices[i];
					data[pixelIndex * 4] =
						(data[pixelIndex * 4] & ~1) | totalBits[i];
				}

				ctx.putImageData(imageData, 0, 0);

				canvas.toBlob((blob) => {
					const url = URL.createObjectURL(blob);
					setEncryptedImageURL(url);
				});
			};
			img.src = reader.result;
		};
		reader.readAsDataURL(selectedFile);
	};

	const handleSteganographyDecrypt = () => {
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

				const opaquePixelIndices = [];
				for (let i = 0; i < data.length / 4; i++) {
					if (data[i * 4 + 3] !== 0) opaquePixelIndices.push(i);
				}

				const lengthBits = [];
				for (let i = 0; i < 32; i++) {
					const pixelIndex = opaquePixelIndices[i];
					lengthBits.push(data[pixelIndex * 4] & 1);
				}

				const messageLength = parseInt(lengthBits.join(""), 2);

				const messageBits = [];
				for (let i = 32; i < 32 + messageLength; i++) {
					const pixelIndex = opaquePixelIndices[i];
					messageBits.push(data[pixelIndex * 4] & 1);
				}

				const extractedMessage = String.fromCharCode(
					...Array.from({ length: messageBits.length / 8 }, (_, i) =>
						parseInt(
							messageBits.slice(i * 8, i * 8 + 8).join(""),
							2
						)
					)
				);

				setExtractedMessage(extractedMessage);
			};
			img.src = reader.result;
		};
		reader.readAsDataURL(selectedFile);
	};

	return (
		<>
			<div className="container">
				<h1 className="header">Stegano Decryption</h1>

				<section>
					<h2>Steganography</h2>
					<input
						type="file"
						accept="image/*"
						onChange={(e) => setSelectedFile(e.target.files[0])}
					/>
					{/* <button onClick={handleSteganographyEncrypt}>Encrypt</button>
          <button onClick={handleSteganographyDecrypt}>Decrypt</button> */}
					<div className="buttonCon">
						<button
							class="loginButton"
							onClick={handleSteganographyDecrypt}
						>
							<h3>Decrypt</h3>
							<div class="buttonBackground"></div>
						</button>
					</div>
					{encryptedImageURL && (
						<a
							href={encryptedImageURL}
							download="encrypted_image.png"
						>
							Download Encrypted Image
						</a>
					)}
					{extractedMessage && (
						<p>Extracted Message: {extractedMessage}</p>
					)}
				</section>
			</div>
			<Link to="/stegano-encryption">
				<button class="loginButton logout">
					Stegano encryption
					<div class="buttonBackground"></div>
				</button>
			</Link>
			<Link to="/">
				<button class="loginButton logout">
					Back
					<div class="buttonBackground"></div>
				</button>
			</Link>
		</>
	);
};

export default SteganoDecryption;
