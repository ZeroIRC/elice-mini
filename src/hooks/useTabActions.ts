import { FileTreeNode } from '../types/FileTreeNode'
import { useFileStore } from '../store/useFileStore'

export const useTabActions = () => {
  const setState = useFileStore.setState

  const handleTabClick = (file: FileTreeNode) => {
    setState(state => {
      const path = file.path
      const newOpenFiles = new Map(state.openFiles)
      if (!newOpenFiles.has(path)) {
        newOpenFiles.set(path, { ...file })
      }
      return {
        selectedFile: newOpenFiles.get(path) || file,
        openFiles: newOpenFiles,
      }
    })
  }

  const handleTabClose = (file: FileTreeNode) => {
    setState(state => {
      const path = file.path
      const newOpenFiles = new Map(state.openFiles)

      // 현재 선택된 파일이 닫히는 경우 다른 파일을 선택
      let newSelectedFile = state.selectedFile
      if (state.selectedFile?.path === path) {
        const openFilePaths = Array.from(newOpenFiles.keys())
        const lastOpenPath = openFilePaths[openFilePaths.length - 1]
        newSelectedFile = lastOpenPath
          ? newOpenFiles.get(lastOpenPath) || null
          : null
      }

      return {
        openFiles: newOpenFiles,
        selectedFile: newSelectedFile,
      }
    })
  }

  return {
    handleTabClick,
    handleTabClose,
  }
}
