import { useRef, useState } from 'react'

export default function UploadZone({ onFileSelect, file }) {
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef(null)

  const handleFile = (f) => {
    if (f) onFileSelect(f)
  }

  return (
    <div
      className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
        dragging
          ? 'border-green-400 bg-green-900/20'
          : file
          ? 'border-green-500 bg-green-900/10'
          : 'border-slate-600 hover:border-slate-400 bg-slate-800/50'
      }`}
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]) }}
      onClick={() => inputRef.current.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={(e) => handleFile(e.target.files[0])}
      />
      {file ? (
        <div className="flex items-center justify-center gap-3">
          <span className="text-2xl">📄</span>
          <span className="text-green-400 font-medium">{file.name}</span>
          <span className="text-green-500 font-bold">✓</span>
        </div>
      ) : (
        <>
          <div className="text-4xl mb-3">📄</div>
          <p className="text-slate-300 font-medium mb-1">Drag & drop your resume PDF</p>
          <p className="text-slate-500 text-sm">or click to browse</p>
        </>
      )}
    </div>
  )
}
