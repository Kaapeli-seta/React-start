// Upload.tsx
import {ChangeEvent, useRef, useState} from 'react';
import useForm from '../hooks/formHooks';
import {useFile, useMedia} from '../hooks/apiHooks';
//import {useNavigate} from 'react-router';

const Upload = () => {
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadResult, setUploadResult] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  //const navigate = useNavigate();
  const {postFile} = useFile();
  const {postMedia} = useMedia();
  const initValues = {
    title: '',
    description: '',
  };

  const doUpload = async () => {
    const token = localStorage.getItem('token');
    setUploading(true);
    try {
      if (!file || !token) return;
      // call postFile function (see below)
      const fileResult = await postFile(file, token);
      // call postMedia function (see below)
      await postMedia(fileResult, inputs, token);
      // redirect to Home
      //navigate('/');
      setUploadResult('file Uploaded');
      setInputs(initValues);
      setFile(null);
      resetForm();
    } catch (e) {
      console.log((e as Error).message);
      setUploadResult((e as Error).message);
    } finally {
      setUploading(false);
    }
  };
  const {handleSubmit, handleInputChange, inputs, setInputs} = useForm(doUpload, initValues);

  const handleFileChange = (evt: ChangeEvent<HTMLInputElement>) => {
    if (evt.target.files) {
      console.log(evt.target.files[0]);
      setFile(evt.target.files[0]);
    }
  };

  const resetForm = () => {
    setInputs(initValues);
    setFile(null);
    if (!fileRef.current) return;
    fileRef.current.value = '';
  };

  return (
    <>
      <h1>Upload</h1>
      {uploading && <p>Uploading...</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title</label>
          <input
            name="title"
            type="text"
            id="title"
            onChange={handleInputChange}
            value={inputs.title}
          />
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <textarea
            name="description"
            rows={5}
            id="description"
            onChange={handleInputChange}
            value={inputs.description}
          ></textarea>
        </div>
        <div>
          <label htmlFor="file">File</label>
          <input
            name="file"
            type="file"
            id="file"
            accept="image/*, video/*"
            onChange={handleFileChange}
            ref={fileRef}
          />
        </div>
        <img
          src={file ? URL.createObjectURL(file) : 'https://place-hold.it/200?text=Choose+image'}
          alt="preview"
          width="200"
        />
        <button type="submit" disabled={file && inputs.title.length > 3 ? false : true}>
          {uploading ? 'Uploading..' : 'Upload'}
        </button>
        <button type="reset" onClick={resetForm}>
          Reset
        </button>
        <p>{uploadResult}</p>
      </form>
    </>
  );
};

export default Upload;
