// unzipToTree.ts (타입 안정성 강화)
import JSZip from 'jszip'
import { FileTreeNode } from '../types/FileTreeNode'

const TEXT_EXT = [
  'ts',
  'tsx',
  'js',
  'jsx',
  'json',
  'html',
  'css',
  'md',
  'txt',
  'yml',
  'pem',
]
const IMAGE_EXT = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg']
const BINARY_EXT = ['exe', 'zip', 'pdf', 'woff', 'ttf']

function guessFileType(name: string): 'text' | 'image' | 'binary' {
  const ext = name.split('.').pop()?.toLowerCase()
  if (ext) {
    if (TEXT_EXT.includes(ext)) return 'text'
    if (IMAGE_EXT.includes(ext)) return 'image'
    if (BINARY_EXT.includes(ext)) return 'binary'
  }
  return 'binary'
}

type FlatEntry = {
  path: string
  content: string | null
  binaryData: Uint8Array | null
  fileType: 'text' | 'image' | 'binary'
}

export async function unzipToTree(file: File): Promise<FileTreeNode[]> {
  const zip = await JSZip.loadAsync(file)
  const entries: FlatEntry[] = []

  // 파일 내용 처리
  await Promise.all(
    Object.values(zip.files).map(async entry => {
      if (entry.dir) return

      const fileType = guessFileType(entry.name)
      let content: string | null = null
      let binaryData: Uint8Array | null = null

      try {
        if (fileType === 'text') {
          content = await entry.async('string')
        } else {
          binaryData = new Uint8Array(await entry.async('arraybuffer'))
        }
      } catch {
        content = null
        binaryData = null
      }

      entries.push({
        path: entry.name,
        content,
        binaryData,
        fileType,
      })
    }),
  )

  return buildTreeFromFlat(entries, file.name)
}

function buildTreeFromFlat(
  entries: FlatEntry[],
  zipFileName: string,
): FileTreeNode[] {
  // 모든 경로를 정렬하여 부모 디렉토리가 먼저 처리되도록 함
  const sortedEntries = [...entries].sort((a, b) =>
    a.path.localeCompare(b.path),
  )

  // ZIP 파일 이름에서 확장자 제거
  const rootName = zipFileName.replace(/\.zip$/i, '')

  // 루트 노드 생성
  const root: FileTreeNode = {
    name: rootName,
    path: '/',
    type: 'folder',
    children: [],
    isOpen: true, // 최상위 폴더 자동으로 열기
  }

  // 각 엔트리에 대해 처리
  for (const entry of sortedEntries) {
    const parts = entry.path.split('/')
    let current = root

    // 마지막 부분을 제외한 모든 부분(디렉토리)에 대해 처리
    for (let i = 0; i < parts.length - 1; i++) {
      const dirName = parts[i]
      const dirPath = parts.slice(0, i + 1).join('/')

      // 현재 레벨에서 디렉토리 찾기
      let dirNode = current.children?.find(
        child => child.name === dirName && child.type === 'folder',
      )

      // 디렉토리가 없으면 생성
      if (!dirNode) {
        dirNode = {
          name: dirName,
          path: dirPath,
          type: 'folder',
          children: [],
        }
        current.children?.push(dirNode)
      }

      current = dirNode
    }

    // 파일 노드 생성
    const fileName = parts[parts.length - 1]
    const fileNode: FileTreeNode = {
      name: fileName,
      path: entry.path,
      type: 'file',
      fileType: entry.fileType,
      content: entry.content,
      binaryData: entry.binaryData,
    }
    current.children?.push(fileNode)
  }

  return [root]
}
