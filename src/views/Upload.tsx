import {useState} from 'react';

const Upload = () => {
  const [uploading, setUploading] = useState(false);
  return (
    <>
      <h2>Upload</h2>
      <button
        onClick={() => {
          setUploading(true);
          setTimeout(() => {
            setUploading(false);
          }, 3000);
        }}
      >
        Upload
      </button>
      {uploading && <p>Uploading...</p>}
    </>
  );
};

export default Upload;
