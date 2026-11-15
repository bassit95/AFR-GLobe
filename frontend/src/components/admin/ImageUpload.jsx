// src/components/admin/ImageUpload.jsx
import { useState } from 'react';
import { UploadCloud, Loader2, X } from 'lucide-react';
import { uploadImage } from '@/services/uploadService';
import toast from 'react-hot-toast';
import { imageUrl } from '@/utils/image'; // 🎯 Pour afficher correctement l'image

export default function ImageUpload({ value, onChange, label }) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadImage(file);
      onChange(url); // Met à jour le champ dans React Hook Form
      toast.success('Image uploadée !');
    } catch (err) {
      toast.error(err.message || "Erreur lors de l'upload");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">
        {label}
      </label>
      
      {value ? (
        <div className="relative w-40 h-40 border border-black/10 bg-gray-50">
          <img 
            src={imageUrl(value)} 
            alt="Preview" 
            className="w-full h-full object-cover" 
          />
          <button 
            type="button" 
            onClick={() => onChange('')} 
            className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-50 transition-colors">
          {uploading ? (
            <Loader2 className="animate-spin text-[#B85C38]" size={24} />
          ) : (
            <>
              <UploadCloud className="text-gray-400 mb-2" size={24} />
              <span className="text-xs text-gray-500">Cliquez pour uploader</span>
            </>
          )}
          <input 
            type="file" 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileChange} 
            disabled={uploading} 
          />
        </label>
      )}
    </div>
  );
}