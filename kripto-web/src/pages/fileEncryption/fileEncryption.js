import React, { useState } from "react";
import twofish from "twofish";

const FileEncryption = () => {
  const [text, setText] = useState("");
  const [key, setKey] = useState("");
  const [result, setResult] = useState("");
  const [isEncrypt, setIsEncrypt] = useState(true);

  // Fungsi enkripsi
  const twofishEncrypt = (plainText, keyText) => {
    try {
      const keyBytes = new TextEncoder().encode(keyText.padEnd(32, "0")).slice(0, 32);
      const dataBytes = new TextEncoder().encode(plainText.padEnd(16, " "));
      const cipher = twofish.encrypt(keyBytes, dataBytes);
      return btoa(String.fromCharCode(...cipher));
    } catch (err) {
      console.error(err);
      return "❌ Error: Enkripsi gagal";
    }
  };

  // Fungsi dekripsi
  const twofishDecrypt = (cipherText, keyText) => {
    try {
      const keyBytes = new TextEncoder().encode(keyText.padEnd(32, "0")).slice(0, 32);
      const encryptedBytes = atob(cipherText)
        .split("")
        .map((c) => c.charCodeAt(0));
      const plainBytes = twofish.decrypt(keyBytes, encryptedBytes);
      return new TextDecoder().decode(Uint8Array.from(plainBytes)).trim();
    } catch (err) {
      console.error(err);
      return "❌ Error: Dekripsi gagal, pastikan key dan teks benar";
    }
  };

  const handleProcess = () => {
    if (!text || !key) {
      setResult("⚠️ Masukkan teks dan kunci terlebih dahulu.");
      return;
    }

    const output = isEncrypt
      ? twofishEncrypt(text, key)
      : twofishDecrypt(text, key);

    setResult(output);
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-gray-900 text-white rounded-2xl shadow-lg mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-400">
        🔐 Twofish File Encryption
      </h2>

      <label className="block mb-2 text-sm font-semibold text-gray-300">
        Masukkan Teks
      </label>
      <textarea
        className="w-full p-2 rounded-md bg-gray-800 text-white mb-4 border border-gray-700"
        rows="3"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Tulis teks yang ingin dienkripsi atau didekripsi..."
      />

      <label className="block mb-2 text-sm font-semibold text-gray-300">
        Masukkan Kunci
      </label>
      <input
        type="text"
        className="w-full p-2 rounded-md bg-gray-800 text-white mb-4 border border-gray-700"
        value={key}
        onChange={(e) => setKey(e.target.value)}
        placeholder="Masukkan kunci rahasia"
      />

      <div className="flex items-center justify-between mb-4">
        <button
          className={`px-4 py-2 rounded-md font-semibold transition ${
            isEncrypt ? "bg-blue-600" : "bg-gray-700"
          }`}
          onClick={() => setIsEncrypt(true)}
        >
          Enkripsi
        </button>
        <button
          className={`px-4 py-2 rounded-md font-semibold transition ${
            !isEncrypt ? "bg-green-600" : "bg-gray-700"
          }`}
          onClick={() => setIsEncrypt(false)}
        >
          Dekripsi
        </button>
      </div>

      <button
        onClick={handleProcess}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition"
      >
        Jalankan {isEncrypt ? "Enkripsi" : "Dekripsi"}
      </button>

      <div className="mt-6">
        <label className="block mb-2 text-sm font-semibold text-gray-300">
          Hasil:
        </label>
        <textarea
          readOnly
          className="w-full p-2 rounded-md bg-gray-800 text-green-300 border border-gray-700"
          rows="4"
          value={result}
        />
      </div>
    </div>
  );
};

export default FileEncryption;
