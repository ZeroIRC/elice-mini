import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export type EditorFile = {
  path: string
  name: string
  type: 'file'
  fileType?: 'text' | 'image' | 'binary'
  content: string
  binaryData?: Uint8Array | null
}

type EditorState = {
  openFiles: Map<string, EditorFile>
  selectedFilePath: string
  setOpenFiles: (files: Map<string, EditorFile>) => void
  setSelectedFilePath: (path: string) => void
  changeFileContent: (path: string, content: string) => void
  isDirty: { [path: string]: boolean }
  setIsDirty: (path: string, isDirty: boolean) => void
}

export const useEditorStore = create(
  devtools<EditorState>((set, get) => ({
    openFiles: new Map(),
    selectedFilePath: '',
    setOpenFiles: files => set({ openFiles: files }),
    setSelectedFilePath: path => set({ selectedFilePath: path }),
    changeFileContent: (path, content) => {
      const openFiles = new Map(get().openFiles)
      const file = openFiles.get(path)
      if (file) {
        openFiles.set(path, { ...file, content })
        set({ openFiles: openFiles })
      }
    },
    isDirty: {},
    setIsDirty: (path, isDirty) =>
      set(state => ({
        isDirty: { ...state.isDirty, [path]: isDirty },
      })),
  })),
)
