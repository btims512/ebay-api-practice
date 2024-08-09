import React, { useState } from "react";
import axios from "axios";
import "./EbaySearch.less";

const EbaySearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        "https://cors-anywhere.herokuapp.com/https://svcs.sandbox.ebay.com/services/search/FindingService/v1",
        {
          params: {
            "SECURITY-APPNAME": process.env.REACT_APP_EBAY_API_KEY,
            "OPERATION-NAME": "findItemsByKeywords",
            "SERVICE-VERSION": "1.0.0",
            "GLOBAL-ID": "EBAY-US",
            "RESPONSE-DATA-FORMAT": "JSON",
            keywords: searchTerm,
          },
        }
      );

      setResults(
        response.data.findItemsByKeywordsResponse[0].searchResult[0].item || []
      );
      setError("");
    } catch (error) {
      setError("Error fetching data from eBay API");
      console.error(error);
    }
  };

  return (
    <div>
      <header className="ebay-header">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/EBay_logo.svg/320px-EBay_logo.svg.png"
          alt="eBay Logo"
          className="logo"
        />
        <div className="search-container">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search for anything"
          />
          <button onClick={handleSearch}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </div>
      </header>

      <main className="results-container">
        {error && <p>{error}</p>}
        <ul className="results-grid">
          {results.map((item) => (
            <ResultCard key={item.itemId?.[0] || Math.random()} item={item} />
          ))}
        </ul>
      </main>
    </div>
  );
};

const ResultCard = ({ item }) => (
  <li className="card">
    <img
      src={item.galleryURL?.[0] || "https://via.placeholder.com/150"}
      alt={item.title?.[0] || "No title available"}
    />
    <div className="card-details">
      <h3>{item.title?.[0] || "No title available"}</h3>
      <p className="price">
        {item.sellingStatus?.[0]?.currentPrice?.[0]?.__value__ || "N/A"}{" "}
        {item.sellingStatus?.[0]?.currentPrice?.[0]?.["@currencyId"] || ""}
      </p>
      <p className="condition">
        {item.condition?.[0]?.conditionDisplayName?.[0] || "Condition unknown"}
      </p>
      <a
        href={item.viewItemURL?.[0] || "#"}
        target="_blank"
        rel="noopener noreferrer"
        className="view-link"
      >
        View on eBay
      </a>
    </div>
  </li>
);

export default EbaySearch;
