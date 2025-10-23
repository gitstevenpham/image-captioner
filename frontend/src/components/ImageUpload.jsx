import React, { useState, useRef } from 'react';
import { ReactComponent as UploadCloudIcon } from './icons/upload-cloud.svg';
import { ReactComponent as CloseIcon } from './icons/close.svg';

const ImageUpload = ({ onImageSelect, disabled = false }) => {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateImage = (file) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type)) {
      alert('Please upload a JPEG or PNG image');
      return false;
    }

    if (file.size > maxSize) {
      alert('Image size should be less than 10MB');
      return false;
    }

    return true;
  };

  const handleFile = (file) => {
    if (file && validateImage(file)) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
      onImageSelect(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleClear = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onImageSelect(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {!preview ? (
        <div
          className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-all ${
            dragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={!disabled ? handleClick : undefined}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/jpeg,image/jpg,image/png"
            onChange={handleChange}
            disabled={disabled}
          />

          <div className="space-y-4">
            <div className="flex justify-center">
              <UploadCloudIcon className="w-16 h-16 text-gray-400" />
            </div>

            <div>
              <p className="text-lg font-medium text-gray-700">
                {dragActive ? 'Drop your image here' : 'Drag and drop an image'}
              </p>
              <p className="text-sm text-gray-500 mt-1">or click to browse</p>
            </div>

            <p className="text-xs text-gray-400">
              Supports: JPEG, PNG (max 10MB)
            </p>
          </div>
        </div>
      ) : (
        <div className="relative rounded-lg overflow-hidden shadow-lg animate-fade-in">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-auto max-h-96 object-contain bg-gray-100"
          />
          {!disabled && (
            <button
              onClick={handleClear}
              className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-colors"
              title="Remove image"
            >
              <CloseIcon className="w-5 h-5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
