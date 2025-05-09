import React from 'react'
import { FileTreeNode } from '../types/FileTreeNode'

export type MonacoEditorProps = {
  file: FileTreeNode | null
  editorRef: React.RefObject<HTMLDivElement>
  handleSave: () => void
  handleDownloadFile: () => void
}

export const MonacoEditor: React.FC<MonacoEditorProps> = ({
  file,
  editorRef,
  handleSave,
  handleDownloadFile,
}) => {
  if (!file) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        파일을 선택해주세요.
      </div>
    )
  }
  if (file.fileType === 'image' && file.binaryData) {
    const src = URL.createObjectURL(new Blob([file.binaryData]))
    return (
      <div className="h-full flex items-center justify-center bg-gray-100 p-4">
        <img
          src={src}
          alt={file.name}
          className="max-w-full max-h-[calc(100vh-200px)] object-contain"
        />
      </div>
    )
  }
  if (file.fileType === 'binary') {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        표시할 수 없는 파일입니다.
      </div>
    )
  }
  if (file.fileType === 'text') {
    return (
      <div className="h-full flex flex-col">
        <div className="flex-none p-2 bg-gray-800 border-b border-gray-600 flex gap-2">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            저장
          </button>
          <button
            onClick={handleDownloadFile}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            다운로드
          </button>
        </div>
        <div ref={editorRef} className="flex-1" />
      </div>
    )
  }
  return (
    <div className="h-full flex items-center justify-center text-gray-500">
      파일을 선택해주세요.
    </div>
  )
}
