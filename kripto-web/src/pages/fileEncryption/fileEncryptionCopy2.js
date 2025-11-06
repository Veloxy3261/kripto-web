import React, { useState } from "react";
import CryptoJS from "crypto-js"; // For AES encryption/decryption
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../../authContext";
import "./dashboard.css";

const FileEncryption = () => {
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

	const handleFileChange = (e) => {
		const file = e.target.files[0];
		setSelectedFile(file);
		setFileName(`${Math.random().toString(36).substring(2, 12)}.txt`);
		setEncryptedData("");
	};

	const handleEncryption = () => {
		if (!selectedFile) {
			alert("Silakan pilih file terlebih dahulu.");
			return;
		}

		if (!secretKey) {
			alert("Silakan masukkan kunci rahasia.");
			return;
		}

		setIsLoading(true);
		isCancelledRef.current = false;

		const reader = new FileReader();
		reader.onload = async () => {
			if (isCancelledRef.current) {
				setIsLoading(false);
				return;
			}
			const wordArray = CryptoJS.lib.WordArray.create(reader.result);
			const encrypted = CryptoJS.RC4.encrypt(
				wordArray,
				secretKey
			).toString();

			// Menggabungkan data terenkripsi dengan ekstensi file asli
			const fileExtension = selectedFile.name.split(".").pop();
			const outputData = `${encrypted}.${fileExtension}`;

			if (!isCancelledRef.current) {
				setEncryptedData(outputData);
				setEncryptionExplanation(
					"File telah dienkripsi menggunakan algoritma RC4. Data file dienkripsi dengan kunci rahasia dan disimpan dalam format teks."
				);

				// Upload to Firebase Storage
				try {
					const url = await uploadToFirebaseStorage(
						outputData,
						fileName
					);
					await uploadToHistories({
						fileName,
						cipherMethod: "file",
						downloadURL: url,
						secretKey,
					});
				} catch (error) {
					console.error("Error uploading file:", error);
					alert("Gagal mengunggah file.");
				}
			}
			setIsLoading(false);
		};
		reader.onerror = (error) => {
			console.error("Error reading file:", error);
			alert("Terjadi kesalahan saat membaca file.");
			setIsLoading(false);
		};
		reader.readAsArrayBuffer(selectedFile);
	};

	const handleDownload = () => {
		const blob = new Blob([encryptedData], {
			type: "text/plain;charset=utf-8",
		});
		const link = document.createElement("a");
		link.href = URL.createObjectURL(blob);
		link.download = `${fileName.split(".")[0]}.txt`;
		link.click();
	};

	return (
		<>
			<div className="container">
				<h1 className="header">Kripto K-nya Karten</h1>

				<div className="w-full max-w-2xl p-8 bg-secondary-bg rounded-3xl shadow-md mx-5 relative">
					<h2 className="mb-6 text-2xl font-bold text-center">
						Enkripsi File
					</h2>
					<input
						type="file"
						className="w-full px-4 py-2 mb-4 border border-border-color rounded bg-secondary-bg text-text-primary"
						onChange={handleFileChange}
						disabled={isLoading}
					/>
					<input
						type="text"
						placeholder="Masukkan Kunci Rahasia"
						className="w-full px-4 py-2 mb-4 border border-border-color rounded bg-secondary-bg text-text-primary"
						value={secretKey}
						onChange={(e) => setSecretKey(e.target.value)}
						disabled={isLoading}
					/>
					<button
						className="w-full px-4 py-2 font-bold text-text-secondary rounded bg-accent-bg hover:bg-accent-hover transition delay-100 mb-4"
						onClick={handleEncryption}
						disabled={isLoading}
					>
						Enkripsi File
					</button>
					{encryptedData && (
						<div className="w-full">
							<h3 className="mb-2 text-xl font-semibold">
								Data Terenkripsi:
							</h3>
							<textarea
								className="w-full p-4 mb-4 border border-border-color rounded bg-secondary-bg text-text-primary"
								rows="6"
								value={encryptedData}
								readOnly
							/>
							<div className="flex flex-col items-center">
								<button
									className="w-full px-4 py-2 font-bold text-text-secondary rounded bg-accent-bg hover:bg-accent-hover transition delay-100"
									onClick={handleDownload}
								>
									Download Encrypted Data as TXT
								</button>
							</div>
							{encryptionExplanation && (
								<div className="mt-4">
									<h3 className="mb-2 text-xl font-semibold">
										Penjelasan Enkripsi:
									</h3>
									<p className="text-justify">
										{encryptionExplanation}
									</p>
								</div>
							)}
						</div>
					)}
				</div>
			</div>

			<Link to="/">
				<button class="loginButton logout">
					Back
					<div class="buttonBackground"></div>
				</button>
			</Link>
		</>
	);
};

export default FileEncryption;
