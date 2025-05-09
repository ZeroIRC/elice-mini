import { create } from 'zustand'
import { FileStore } from '../types/FileStore'

export const useFileStore = create<FileStore>(() => ({
  root: null,
  selectedNode: null,
  expandedPaths: new Set(['/']) as Set<string>,
  originalFileName: '',
  selectedFile: null,
}))
