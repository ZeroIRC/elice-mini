import React from 'react'
import { FileTreeNode } from '../types/FileTreeNode'
import { useFileStore } from '../store/useFileStore'

interface TabBarProps {
  openFiles: Map<string, FileTreeNode>
  activeFile: FileTreeNode | null
  onTabClick: (file: FileTreeNode) => void
  onTabClose: (file: FileTreeNode) => void
}

export const TabBar: React.FC<TabBarProps> = ({
  openFiles,
  activeFile,
  onTabClick,
  onTabClose,
}) => {
  const openFilesList = Array.from(openFiles.values())
  const isDirty = useFileStore(state => state.isDirty)

  return (
    <div className="flex-none h-9 bg-gray-800 border-b border-gray-600 flex items-center overflow-x-auto">
      {openFilesList.map(file => (
        <div
          key={file.path}
          className={`h-full px-3 flex items-center space-x-2 border-r border-gray-600 cursor-pointer ${
            activeFile?.path === file.path
              ? 'bg-gray-700 text-white'
              : 'text-gray-300 hover:bg-gray-700'
          }`}
          onClick={() => onTabClick(file)}
        >
          <span className="truncate max-w-xs flex items-center">
            {file.name}
            {isDirty.get(file.path) && (
              <span className="ml-1 text-red-400">●</span>
            )}
          </span>
          <button
            className="text-gray-400 hover:text-white"
            onClick={e => {
              e.stopPropagation()
              onTabClose(file)
            }}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}
