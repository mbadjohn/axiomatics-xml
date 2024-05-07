import React, { useState } from "react";
import { Tree } from "react-d3-tree";
import { convertXmlToTree } from "../../utils/xmlConverter";
import "./App.css";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

const App: React.FC = () => {
  const [xmlData, setXmlData] = useState<Document | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<any | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(
            reader.result as string,
            "text/xml"
          );
          const errors = xmlDoc.getElementsByTagName("parsererror");
          if (errors.length > 0) {
            // Assuming the first parsererror contains the needed information
            const errorDetails =
              errors[0].textContent || "Unknown error occurred.";
            setErrorMessage("Error parsing XML: Invalid XML format.");
            setErrorDetails(`Details: ${errorDetails}`);
            setXmlData(null);
            setUploadSuccess(false);
          } else {
            setXmlData(xmlDoc);
            setErrorMessage(null);
            setErrorDetails(null);
            setUploadSuccess(true);
            setTimeout(() => {
              setUploadSuccess(false);
            }, 5000); // 5000 milliseconds = 5 seconds
          }
        } catch (error) {
          if (error instanceof Error) {
            setXmlData(null);
            setErrorMessage("Error: " + error.message);
          } else {
            // If it's not an Error object, set a generic error message
            setErrorMessage("An error occurred");
          }
        }
      };

      reader.onerror = () => {
        setErrorMessage("Error reading file");
        setErrorDetails("An error occurred while trying to read the file.");
        setXmlData(null);
        setUploadSuccess(false);
      };
      reader.readAsText(file);
    }
  };

  console.log(errorDetails);
  console.log(errorMessage);

  const resetViewer = () => {
    setXmlData(null);
    setErrorMessage(null);
    setUploadSuccess(false);
  };

  const treeData = xmlData ? convertXmlToTree(xmlData.documentElement) : null;

  return (
    <div className="container">
      <div className="header">
        {/* <img src={logo} alt="XML Viewer Logo" className="logo"/> */}
        <h1>XML Viewer</h1>
        <h3>
          Welcome to the XML Viewer! This tool allows you to easily upload and
          visualize any XML document in a structured tree format. Simply upload
          your XML file using the button below, and the contents will be
          displayed hierarchically below. This viewer helps you better
          understand and navigate complex XML data structures at a glance. If
          you need to start over, just click the "Clear Screen" button to reset
          the view.
        </h3>
        <div>
          <label htmlFor="file-upload" className="custom-file-upload">
            Upload XML
          </label>
          <input
            id="file-upload"
            type="file"
            onChange={handleFileChange}
            accept=".xml"
            className="file-input"
            style={{ display: "none" }}
          />
          <button onClick={resetViewer} className="reset-button">
            Clear Screen
          </button>
        </div>
      </div>
      <div className="content">
        {uploadSuccess && (
          <div className="notification">File uploaded successfully!</div>
        )}
        {errorMessage && (
          <ErrorMessage message={errorMessage} details={errorDetails} />
        )}
        {treeData && (
          <div className="tree-container">
            <Tree
              data={treeData}
              orientation="vertical"
              translate={{ x: 200, y: 50 }}
              zoomable={true}
              collapsible={true}
              transitionDuration={500}
              zoom={0.7}
              nodeSize={{ x: 140, y: 100 }} // Adjust dimensions as needed
              separation={{ siblings: 4.0, nonSiblings: 4.5 }} // Increase separation
            />
          </div>
        )}
      </div>
      <div className="footer">
        <p>Developed for Axiomatics</p>
      </div>
    </div>
  );
};

export default App;
