import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import {
  UploadCloud,
  Image as ImageIcon,
  Trash2,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  Link2,
  FileImage,
} from 'lucide-react';

interface ImageUploadInputProps {
  value: string;
  onChange: (imageUrl: string) => void;
  label?: string;
  required?: boolean;
  idPrefix?: string;
}

const PRESET_HARVEST_IMAGES = [
  {
    name: 'Emmer Wheat Grains',
    url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Raw Forest Honey',
    url: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Virgin Coconut Oil',
    url: 'https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Nilgiri Whole Spices',
    url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Organic Pulses',
    url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Highland CTC Tea',
    url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80',
  },
];

export const ImageUploadInput: React.FC<ImageUploadInputProps> = ({
  value,
  onChange,
  label = 'Product Image',
  required = false,
  idPrefix = 'product-image',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileDetails, setFileDetails] = useState<{ name: string; size: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'upload' | 'presets' | 'url'>('upload');
  const [urlInput, setUrlInput] = useState(value);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Convert uploaded file into base64 data URL
  const handleFileProcess = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, JPG, WebP, or SVG).');
      return;
    }

    // Calculate readable file size
    const sizeInKb = (file.size / 1024).toFixed(1);
    const sizeStr = file.size > 1024 * 1024 ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : `${sizeInKb} KB`;

    setFileDetails({
      name: file.name,
      size: sizeStr,
    });

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        onChange(result);
        setUrlInput(result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Drag and drop handlers
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileProcess(e.target.files[0]);
    }
  };

  const handleRemoveImage = () => {
    onChange('');
    setUrlInput('');
    setFileDetails(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2.5" id={`${idPrefix}-container`}>
      {/* Header with Mode Switching Tabs */}
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-sm text-[10px] font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`px-2.5 py-1 rounded-xs transition-colors ${
              activeTab === 'upload' ? 'bg-[#0B3D2E] text-[#FFDF78]' : 'text-gray-600 hover:text-black'
            }`}
            id={`${idPrefix}-tab-upload`}
          >
            Upload File
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('presets')}
            className={`px-2.5 py-1 rounded-xs transition-colors ${
              activeTab === 'presets' ? 'bg-[#0B3D2E] text-[#FFDF78]' : 'text-gray-600 hover:text-black'
            }`}
            id={`${idPrefix}-tab-presets`}
          >
            Farm Presets
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`px-2.5 py-1 rounded-xs transition-colors ${
              activeTab === 'url' ? 'bg-[#0B3D2E] text-[#FFDF78]' : 'text-gray-600 hover:text-black'
            }`}
            id={`${idPrefix}-tab-url`}
          >
            Web URL
          </button>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/webp, image/svg+xml, image/gif"
        onChange={handleFileInputChange}
        className="hidden"
        id={`${idPrefix}-file-input`}
      />

      {/* MAIN VIEW: Drag and Drop Upload Zone */}
      {activeTab === 'upload' && (
        <div>
          {value ? (
            /* Uploaded Image Preview Box */
            <div className="relative p-3.5 bg-[#F8F4EA] border border-[#0B3D2E]/20 rounded-md flex items-center gap-4">
              <div className="relative w-20 h-20 rounded-sm overflow-hidden bg-white border border-[#0B3D2E]/10 shrink-0 shadow-xs">
                <img
                  src={value}
                  alt="Harvest product preview"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#0B3D2E] mb-0.5">
                  <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                  <span className="truncate">{fileDetails?.name || 'Uploaded Product Image'}</span>
                </div>
                <p className="text-[11px] text-gray-500">
                  {fileDetails?.size ? `Size: ${fileDetails.size}` : 'Ready for catalog publishing'}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-2.5 py-1 bg-white hover:bg-gray-100 text-[#0B3D2E] text-[11px] font-bold rounded-xs border border-[#0B3D2E]/15 flex items-center gap-1 transition-colors"
                    id={`${idPrefix}-change-file-btn`}
                  >
                    <RefreshCw className="w-3 h-3" />
                    Replace Image
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-600 text-[11px] font-bold rounded-xs border border-red-200 flex items-center gap-1 transition-colors"
                    id={`${idPrefix}-remove-file-btn`}
                  >
                    <Trash2 className="w-3 h-3" />
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Drag and Drop Dropzone */
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-6 sm:p-8 rounded-md border-2 border-dashed text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-[#0B3D2E] bg-[#0B3D2E]/5 scale-[1.01]'
                  : 'border-gray-300 hover:border-[#C99A2E] bg-[#F8F4EA]/60 hover:bg-[#F8F4EA]'
              }`}
              id={`${idPrefix}-dropzone`}
            >
              <div className="w-12 h-12 rounded-full bg-[#0B3D2E]/10 text-[#0B3D2E] flex items-center justify-center mx-auto mb-3">
                <UploadCloud className="w-6 h-6 text-[#0B3D2E]" />
              </div>
              <p className="text-xs font-bold text-[#0B3D2E]">
                Click to browse or drag & drop harvest product image
              </p>
              <p className="text-[10px] text-gray-500 mt-1">
                Supports PNG, JPG, WebP, or SVG up to 10MB
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Farm Presets Gallery */}
      {activeTab === 'presets' && (
        <div className="space-y-2">
          <p className="text-[11px] text-[#0B3D2E]/70 font-medium">
            Select a high-resolution photograph from the Ebinesar Harvest farm archive:
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {PRESET_HARVEST_IMAGES.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  onChange(preset.url);
                  setUrlInput(preset.url);
                  setFileDetails({ name: preset.name, size: 'Harvest Archive' });
                }}
                className={`group relative rounded-sm overflow-hidden border-2 text-left transition-all ${
                  value === preset.url
                    ? 'border-[#0B3D2E] ring-2 ring-[#C99A2E]/50'
                    : 'border-transparent hover:border-[#C99A2E]'
                }`}
                title={preset.name}
                id={`${idPrefix}-preset-${idx}`}
              >
                <img
                  src={preset.url}
                  alt={preset.name}
                  className="w-full h-16 object-cover group-hover:scale-105 transition-transform"
                />
                <span className="absolute inset-x-0 bottom-0 bg-black/70 text-white text-[9px] font-semibold px-1 py-0.5 truncate block">
                  {preset.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Web URL fallback */}
      {activeTab === 'url' && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Link2 className="w-3.5 h-3.5 absolute left-3 top-3 text-gray-400" />
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full pl-8 pr-3 py-2 text-xs bg-[#F8F4EA] border border-gray-300 rounded-sm text-[#0B3D2E] focus:outline-none focus:border-[#C99A2E]"
                id={`${idPrefix}-url-input`}
              />
            </div>
            <button
              type="button"
              onClick={() => {
                if (urlInput.trim()) {
                  onChange(urlInput.trim());
                  setFileDetails({ name: 'Web Image URL', size: 'External' });
                }
              }}
              className="px-3 py-2 bg-[#0B3D2E] hover:bg-[#063B2D] text-white text-xs font-bold rounded-sm transition-colors"
              id={`${idPrefix}-set-url-btn`}
            >
              Set URL
            </button>
          </div>
          {value && (
            <div className="flex items-center gap-2 p-2 bg-[#F8F4EA] rounded-sm border border-[#0B3D2E]/10 text-xs">
              <img src={value} alt="" className="w-8 h-8 rounded-sm object-cover bg-white" />
              <span className="truncate text-[11px] text-gray-600">{value}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
