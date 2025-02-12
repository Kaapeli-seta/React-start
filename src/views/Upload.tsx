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
      <form className="flex flex-col items-center justify-center" onSubmit={handleSubmit}>
        <div className="w-full">
          <label htmlFor="title">Title</label>
          <input
            className="my-2.5 w-full rounded-md border-2 border-stone-400 bg-stone-900 p-1"
            name="title"
            type="text"
            id="title"
            onChange={handleInputChange}
            value={inputs.title}
          />
        </div>
        <div className="w-full">
          <label htmlFor="description">Description</label>
          <textarea
            className="my-2.5 w-full rounded-md border-2 border-stone-400 bg-stone-900 p-1"
            name="description"
            rows={5}
            id="description"
            onChange={handleInputChange}
            value={inputs.description}
          ></textarea>
        </div>
        <div className="w-full">
          <label htmlFor="file">File</label>
          <input
            className="my-2.5 w-full cursor-pointer rounded-md border-2 border-stone-400 bg-stone-900 p-2.5 file:rounded-md file:bg-stone-500 file:p-1"
            name="file"
            type="file"
            id="file"
            accept="image/*, video/*"
            onChange={handleFileChange}
            ref={fileRef}
          />
        </div>
        <img
          className="w-50 h-50 rounded-2xl object-contain"
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
