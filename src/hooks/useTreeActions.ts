import { FileTreeNode } from '../types/FileTreeNode'
import { useFileStore } from '../store/useFileStore'
import { useEditorStore } from '../store/editorStore'

export const useTreeActions = () => {
  const setRoot = useFileStore.getState
  const set = useFileStore.setState
  const setEditor = useEditorStore.getState

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
      const openFiles = useEditorStore.getState().openFiles
      const isFileOpen = openFiles.has(file.path)
      if (isFileOpen) {
        setEditor().setSelectedFilePath(file.path)
        const openFiles = useEditorStore.getState().openFiles
        setRoot().selectedFile = openFiles.get(file.path) || null
      } else {
        const newOpenFiles = new Map(openFiles)
        const editorFile = {
          path: file.path,
          name: file.name,
          content: file.content ?? '',
          type: file.type,
          fileType: file.fileType,
          binaryData: file.binaryData,
          isDirty: false,
        }
        newOpenFiles.set(file.path, editorFile)
        setEditor().setOpenFiles(newOpenFiles)
        setEditor().setSelectedFilePath(file.path)
        setEditor().setIsDirty(file.path, false)
        setRoot().selectedFile = file
      }
      console.log(
        'selectedFile',
        useEditorStore.getState(),
        useFileStore.getState(),
      )
    }
  }

  return {
    toggleExpand,
    selectFile,
  }
}
