import { FileTreeNode } from './FileTreeNode'

export interface FileStore {
  // 원본 데이터
  root: FileTreeNode | null

  // UI 상태
  selectedNode: FileTreeNode | null
  expandedPaths: Set<string>
  originalFileName: string
  selectedFile: FileTreeNode | null
}
