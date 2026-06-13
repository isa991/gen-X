"use client";

import { useState } from "react";

export default function PhotoModal({ isOpen, onClose, photos }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!isOpen || !photos || photos.length === 0) return null;

  const currentPhoto = photos[currentIndex];
  const photoTypeLabel = {
    frente: "Frontal",
    esquerdo: "Lado Esquerdo",
    direito: "Lado Direito",
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-3xl shadow-lg max-w-2xl w-full p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-slate-800">
            Fotos do Paciente
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-2xl"
          >
            ✕
          </button>
        </div>

        <div className="relative bg-slate-100 rounded-2xl overflow-hidden mb-6">
          {currentPhoto.caminho_foto ? (
            <img
              src={currentPhoto.caminho_foto}
              alt={photoTypeLabel[currentPhoto.tipo_foto] || currentPhoto.tipo_foto}
              className="w-full h-96 object-cover"
            />
          ) : (
            <div className="w-full h-96 flex items-center justify-center bg-slate-200">
              <p className="text-slate-500">Foto não disponível</p>
            </div>
          )}
        </div>

        <div className="text-center mb-6">
          <p className="text-lg font-semibold text-slate-800">
            {photoTypeLabel[currentPhoto.tipo_foto] || currentPhoto.tipo_foto}
          </p>
          <p className="text-sm text-slate-500">
            {currentIndex + 1} de {photos.length}
          </p>
        </div>

        <div className="flex gap-3 justify-center mb-6">
          {photos.map((photo, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                index === currentIndex
                  ? "bg-blue-500 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {photoTypeLabel[photo.tipo_foto] || photo.tipo_foto}
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={handlePrev}
            className="flex-1 px-4 py-2 bg-slate-100 text-slate-800 rounded-xl hover:bg-slate-200 transition font-medium"
          >
            ← Anterior
          </button>
          <button
            onClick={handleNext}
            className="flex-1 px-4 py-2 bg-slate-100 text-slate-800 rounded-xl hover:bg-slate-200 transition font-medium"
          >
            Próxima →
          </button>
        </div>
      </div>
    </div>
  );
}
