import { FileTreeNode } from '../types/FileTreeNode'
import { useEditorStore } from '../store/editorStore'
import { useFileStore } from '../store/useFileStore'

export const useTabActions = () => {
  const setEditor = useEditorStore.getState
  const setRoot = useFileStore.getState

  const handleTabClick = (file: FileTreeNode) => {
    setEditor().setSelectedFilePath(file.path)
    setRoot().selectedFile = file
  }

  const handleTabClose = (file: FileTreeNode) => {
    const openFiles = useEditorStore.getState().openFiles
    const newOpenFiles = new Map(openFiles)
    newOpenFiles.delete(file.path)
    setEditor().setOpenFiles(newOpenFiles)

    // 닫힌 파일이 선택된 파일이면 다른 파일로 전환
    if (useEditorStore.getState().selectedFilePath === file.path) {
      const openFilePaths = Array.from(newOpenFiles.keys())
      const lastOpenPath = openFilePaths[openFilePaths.length - 1] || ''
      setEditor().setSelectedFilePath(lastOpenPath)
      setRoot().selectedFile =
        useEditorStore.getState().openFiles.get(lastOpenPath) || null
    }
  }

  return {
    handleTabClick,
    handleTabClose,
  }
}
