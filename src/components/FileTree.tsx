import React from 'react'
import { FileTreeNode } from '../types/FileTreeNode'

interface FileTreeProps {
  root: FileTreeNode | null
  selectedNode: FileTreeNode | null
  expandedPaths: Set<string>
  onSelect: (node: FileTreeNode) => void
  onToggleExpand: (path: string) => void
}

interface FileTreeItemProps {
  node: FileTreeNode
  level: number
  selectedNode: FileTreeNode | null
  expandedPaths: Set<string>
  onSelect: (node: FileTreeNode) => void
  onToggleExpand: (path: string) => void
}

const FileTreeItem: React.FC<FileTreeItemProps> = ({
  node,
  level,
  selectedNode,
  expandedPaths,
  onSelect,
  onToggleExpand,
}) => {
  const isExpanded = expandedPaths.has(node.path)
  const isSelected = selectedNode?.path === node.path

  const handleToggle = () => {
    if (node.type === 'folder') {
      onToggleExpand(node.path)
    }
    onSelect(node)
  }

  return (
    <div>
      <div
        className={`flex items-center px-2 py-1 cursor-pointer hover:bg-gray-100 ${
          isSelected ? 'bg-blue-100 text-black' : 'text-black'
        }`}
        style={{ paddingLeft: `${level * 1.5}rem` }}
        onClick={handleToggle}
      >
        <span className="mr-1">
          {node.type === 'folder' ? (isExpanded ? '📂' : '📁') : '📄'}
        </span>
        <span className="flex-1 truncate">{node.name}</span>
      </div>
      {node.type === 'folder' && isExpanded && node.children && (
        <div>
          {node.children.map(child => (
            <FileTreeItem
              key={child.path}
              node={child}
              level={level + 1}
              selectedNode={selectedNode}
              expandedPaths={expandedPaths}
              onSelect={onSelect}
              onToggleExpand={onToggleExpand}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export const FileTree: React.FC<FileTreeProps> = ({
  root,
  selectedNode,
  expandedPaths,
  onSelect,
  onToggleExpand,
}) => {
  return (
    <div className="h-full border rounded-lg bg-white overflow-auto">
      <div className="p-2">
        {root ? (
          <FileTreeItem
            node={root}
            level={0}
            selectedNode={selectedNode}
            expandedPaths={expandedPaths}
            onSelect={onSelect}
            onToggleExpand={onToggleExpand}
          />
        ) : (
          <p className="text-gray-500 text-center py-4">
            ZIP 파일을 업로드해주세요.
          </p>
        )}
      </div>
    </div>
  )
}
