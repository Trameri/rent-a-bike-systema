import React, { useState } from 'react'
import WebcamWithPreview from './WebcamWithPreview.jsx'

const DocumentCapture = ({ onCapture, label = "Scatta Foto Documento", type = "front" }) => {
  const [useFileUpload, setUseFileUpload] = useState(false)
  const [capturedImage, setCapturedImage] = useState(null)

  const handleWebcamCapture = (imageData) => {
    setCapturedImage(imageData)
    onCapture(imageData)
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      // Verifica che sia un'immagine
      if (!file.type.startsWith('image/')) {
        alert('❌ Seleziona un file immagine valido')
        return
      }

      // Verifica dimensione (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('❌ Il file è troppo grande. Massimo 5MB.')
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const imageData = e.target.result
        setCapturedImage(imageData)
        onCapture(imageData)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setCapturedImage(null)
    onCapture(null)
    // Reset file input
    const fileInput = document.getElementById(`file-input-${type}`)
    if (fileInput) fileInput.value = ''
  }

  if (useFileUpload) {
    return (
      <div style={{
        border: '2px dashed #d1d5db',
        borderRadius: '12px',
        padding: '20px',
        textAlign: 'center',
        background: '#f9fafb'
      }}>
        <h4 style={{ margin: '0 0 16px 0', color: '#374151' }}>
          📁 {label}
        </h4>

        {!capturedImage ? (
          <div>
            <div style={{
              fontSize: '48px',
              marginBottom: '16px',
              opacity: 0.5
            }}>
              {type === 'front' ? '🆔' : '📄'}
            </div>
            
            <p style={{ 
              margin: '0 0 16px 0', 
              color: '#6b7280',
              fontSize: '14px'
            }}>
              Seleziona un'immagine del {type === 'front' ? 'documento fronte' : 'documento retro'}
            </p>

            <input
              id={`file-input-${type}`}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
            
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <label
                htmlFor={`file-input-${type}`}
                style={{
                  background: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                📁 Seleziona File
              </label>
              
              <button
                onClick={() => setUseFileUpload(false)}
                style={{
                  background: '#10b981',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                📷 Usa Webcam
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p style={{ 
              fontSize: '14px', 
              color: '#10b981', 
              marginBottom: '12px',
              fontWeight: '600'
            }}>
              ✅ Immagine caricata con successo
            </p>
            
            <div style={{
              marginBottom: '16px',
              display: 'inline-block',
              borderRadius: '8px',
              overflow: 'hidden',
              border: '2px solid #10b981'
            }}>
              <img
                src={capturedImage}
                alt="Documento caricato"
                style={{
                  width: '100%',
                  maxWidth: '300px',
                  height: 'auto',
                  display: 'block'
                }}
              />
            </div>
            
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'center'
            }}>
              <label
                htmlFor={`file-input-${type}`}
                style={{
                  background: '#f59e0b',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                🔄 Cambia File
              </label>
              
              <button
                onClick={removeImage}
                style={{
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                🗑️ Rimuovi
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div>
      <WebcamWithPreview
        onCapture={handleWebcamCapture}
        label={label}
        type={type}
      />
      
      {/* Pulsante per passare al file upload se webcam non funziona */}
      <div style={{
        textAlign: 'center',
        marginTop: '16px'
      }}>
        <button
          onClick={() => setUseFileUpload(true)}
          style={{
            background: 'transparent',
            color: '#6b7280',
            border: '1px solid #d1d5db',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            margin: '0 auto'
          }}
        >
          📁 Problemi con la webcam? Carica file
        </button>
      </div>
    </div>
  )
}

export default DocumentCapture