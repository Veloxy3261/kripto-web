import React from "react";
import "./App.css";
import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
	RouterProvider,
} from "react-router-dom";
import LoginPage from "./pages/login/Login";
import Example from "./pages/example/Example";
import RegisterPage from "./pages/register/RegisterPage";
import BackgroundCircle from "./pages/backgroundCircle/BackgroundCircle";
import { AuthProvider } from "./authContext"; // Import the AuthProvider
import Dashboard from "./pages/dashboard/dashboard";
import TextEncryption from "./pages/textEncryption/textEncryption";
import Stegano from "./pages/stegano/stegano";
import FileEncryption from "./pages/fileEncryption/fileEncryptionCopy";
import TextDecryption from "./pages/textDecryption/textDecryption";
import SteganoDecryption from "./pages/steganoDecryption/steganoDecryption";
import FileDecryption from "./pages/fileDecryption/fileDecryption";

function App() {
	const router = createBrowserRouter(
		createRoutesFromElements(
			<Route path="/" element={<BackgroundCircle />}>
				<Route index element={<Dashboard />} />
				<Route path="login" element={<LoginPage />} />
				<Route path="register" element={<RegisterPage />} />
				<Route path="text-encryption" element={<TextEncryption />} />
				<Route path="stegano-encryption" element={<Stegano />} />
				<Route path="file-encryption" element={<FileEncryption />} />
				<Route path="text-decryption" element={<TextDecryption />} />
				<Route
					path="stegano-decryption"
					element={<SteganoDecryption />}
				/>
				<Route path="file-decryption" element={<FileDecryption />} />
			</Route>
		)
	);

	return (
		<>
			<React.StrictMode>
				<AuthProvider>
					<RouterProvider router={router} />
				</AuthProvider>
			</React.StrictMode>
		</>
	);
}

export default App;
