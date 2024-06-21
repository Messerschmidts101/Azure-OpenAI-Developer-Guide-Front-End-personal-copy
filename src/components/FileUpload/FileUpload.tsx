// ./src/components/FileUpload/FileUpload.tsx

import React, { useState } from "react";
import { BlobServiceClient } from "@azure/storage-blob";  // Import from @azure/storage-blob

const azureStorageConnectionString = process.env.REACT_APP_AZURE_STORAGE_CONNECTION_STRING;
const azureStorageContainerName = process.env.REACT_APP_AZURE_STORAGE_CONTAINER_NAME;

const FileUpload: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setSelectedFile(event.target.files[0]);
        }
    };

    const handleFileUpload = async () => {
        if (selectedFile && azureStorageConnectionString && azureStorageContainerName) {
            const blobServiceClient = new BlobServiceClient(azureStorageConnectionString);
            const containerClient = blobServiceClient.getContainerClient(azureStorageContainerName);
            const blockBlobClient = containerClient.getBlockBlobClient(selectedFile.name);

            try {
                await blockBlobClient.uploadBrowserData(selectedFile);
                console.log("File uploaded successfully");
            } catch (error) {
                console.error("Error uploading file:", error);
            }
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleFileUpload}>Upload</button>
        </div>
    );
};

export default FileUpload;
