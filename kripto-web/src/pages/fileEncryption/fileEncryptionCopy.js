import "./dashboard.css";
import React, { useEffect, useState, useRef } from "react";
import CryptoJS from "crypto-js";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../../authContext";

function FileEncryption() {
	const [selectedFile, setSelectedFile] = useState(null);
	const [encryptedData, setEncryptedData] = useState("");
	const [secretKey, setSecretKey] = useState("");
	const [fileName, setFileName] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const isCancelledRef = useRef(false);
	const [encryptionExplanation, setEncryptionExplanation] = useState("");

	const { user, logout } = useAuth();
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

	const handleCancel = () => {
		isCancelledRef.current = true;
		setIsLoading(false);
	};

	return (
		<>
			<div className="container">
				<h1 className="header">File Encryption</h1>
				{isLoading && (
					<div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
						<div className="flex flex-col justify-center bg-secondary-bg p-6 shadow-md text-center rounded-2xl">
							<div className="loader mx-auto">
								<div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
								<p className="text-text-primary">
									Proses sedang berjalan...
								</p>
							</div>
							<div>
								<button
									className="mt-4 px-4 py-2 font-bold text-text-secondary rounded bg-accent-bg hover:bg-accent-hover"
									onClick={handleCancel}
								>
									Cancel
								</button>
							</div>
						</div>
					</div>
				)}
				<div className="w-full max-w-2xl p-8 bg-secondary-bg rounded-3xl shadow-md mx-5 relative flex">
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
			<Link to="/file-decryption">
				<button class="loginButton logout">
					File decryption
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
}

export default FileEncryption;
