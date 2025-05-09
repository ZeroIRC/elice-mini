import { FileTreeNode } from '../types/FileTreeNode'
import { useFileStore } from '../store/useFileStore'

export const useTreeActions = () => {
  const set = useFileStore.setState

  const toggleExpand = (path: string) => {
    set(state => {
      const newExpandedPaths = new Set(state.expandedPaths)
      if (newExpandedPaths.has(path)) {
        newExpandedPaths.delete(path)
      } else {
        newExpandedPaths.add(path)
      }
      return { expandedPaths: newExpandedPaths }
    })
  }

  const selectFile = (file: FileTreeNode) => {
    if (file.type === 'file') {
      set(state => {
        const isFileOpen = state.openFiles.has(file.path)
        if (isFileOpen) {
          // 이미 열려있는 파일인 경우 임시 저장소의 객체 사용
          const openFile = state.openFiles.get(file.path)
          return {
            selectedFile: openFile,
            selectedNode: openFile,
          }
        } else {
          // 새로 열리는 파일인 경우
          const newOpenFiles = new Map(state.openFiles)
          const newFile = { ...file, content: file.content ?? '' }
          newOpenFiles.set(file.path, newFile)
          return {
            selectedFile: newFile,
            selectedNode: newFile,
            openFiles: newOpenFiles,
          }
        }
      })
    }
  }

  return {
    toggleExpand,
    selectFile,
  }
}
