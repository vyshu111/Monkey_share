import { useState, useEffect } from "react";
import "./Display.css";

const Display = ({ contract, account }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const getData = async () => {
    setLoading(true);
    setMessage("");
    let dataArray = [];
    const otherAddress = document.querySelector(".address").value;

    try {
      if (otherAddress) {
        dataArray = await contract.display(otherAddress);
      } else {
        dataArray = await contract.display(account);
      }

      if (dataArray.length > 0) {
        const formattedData = dataArray.map((item, index) => (
          <a href={`https://gateway.pinata.cloud/ipfs/${item}`} key={index} target="_blank" rel="noopener noreferrer">
            <img src={`https://gateway.pinata.cloud/ipfs/${item}`} alt={`IPFS Image ${index}`} className="image-list-item" />
          </a>
        ));
        setData(formattedData);
      } else {
        setMessage("No images to display.");
        setData([]);
      }
    } catch (error) {
      setMessage("Error fetching data. Please check the address or your account.");
      setData([]);
    }
    setLoading(false);
  };

  return (
    <div className="display-container">
      <div className="input-container">
        <input type="text" placeholder="Enter Address" className="address" />
        <button className="fetch-button" onClick={getData} disabled={loading}>
          {loading ? <div className="loading-spinner"></div> : "Get Data"}
        </button>
      </div>
      {message && <p className="message">{message}</p>}
      <div className="image-gallery">{data}</div>
    </div>
  );
};

export default Display;




