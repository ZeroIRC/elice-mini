import { FileTreeNode } from './FileTreeNode'

export interface FileStore {
  // 원본 데이터
  root: FileTreeNode | null

  // UI 상태
  selectedNode: FileTreeNode | null
  expandedPaths: Set<string>
  originalFileName: string
  selectedFile: FileTreeNode | null

  // 임시 저장소 (열린 파일들의 수정된 내용)
  openFiles: Map<string, FileTreeNode>
  isDirty: Map<string, boolean>
}
