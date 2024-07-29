import { useState } from "react";
import axios from "axios";
import "./FileUpload.css";

const FileUpload = ({ contract, account }) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("No image selected");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (file) {
      setLoading(true);
      setMessage("");
      try {
        const formData = new FormData();
        formData.append("file", file);

        const resFile = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            pinata_api_key: "93dea91f800122409069",
            pinata_secret_api_key: "da25029ae966760bc88368d5f46767f3f05374da614b7295b9ed7ad665e1d140",
            "Content-Type": "multipart/form-data",
          },
        });

        const imgHash = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;
        await contract.add(account, imgHash);
        setMessage("Image successfully uploaded!");
        setFileName("No image selected");
        setFile(null);
      } catch (e) {
        setMessage("Unable to upload image to Pinata.");
      } finally {
        setLoading(false);
      }
    } else {
      setMessage("Please select an image file.");
    }
  };

  const retrieveFile = (e) => {
    const data = e.target.files[0];
    if (data) {
      setFile(data);
      setFileName(data.name);
    }
  };

  return (
    <div className="file-upload-container">
      <form className="form" onSubmit={handleSubmit}>
        <label htmlFor="file-upload" className="file-upload-label">
          Choose Image
        </label>
        <input
          type="file"
          id="file-upload"
          name="data"
          onChange={retrieveFile}
          disabled={!account}
          className="file-input"
        />
        <span className="file-name-display">{fileName}</span>
        <button type="submit" className="upload-button" disabled={!file || loading}>
          {loading ? <span className="spinner"></span> : "Upload File"}
        </button>
      </form>
      {message && <p className={`message ${message.startsWith("Unable") ? "error" : "success"}`}>{message}</p>}
    </div>
  );
};

export default FileUpload;



