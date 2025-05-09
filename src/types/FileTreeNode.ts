export type FileTreeNode = {
  name: string
  path: string
  type: 'file' | 'folder'
  fileType?: 'text' | 'image' | 'binary'
  content?: string | null
  binaryData?: Uint8Array | null
  children?: FileTreeNode[]
  isOpen?: boolean
}
