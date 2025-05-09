import JSZip from 'jszip'
import { FileTreeNode } from '../types/FileTreeNode'

export async function treeToZip(root: FileTreeNode): Promise<Blob> {
  const zip = new JSZip()

  // 재귀적으로 파일 트리를 순회하며 ZIP 파일에 추가
  function addToZip(node: FileTreeNode, parentPath: string = '') {
    const currentPath = parentPath ? `${parentPath}/${node.name}` : node.name

    if (node.type === 'file') {
      // 파일인 경우
      if (node.binaryData) {
        // 바이너리 데이터가 있는 경우
        zip.file(currentPath, node.binaryData)
      } else if (node.content) {
        // 텍스트 내용이 있는 경우
        zip.file(currentPath, node.content)
      }
    } else if (node.type === 'folder' && node.children) {
      // 폴더인 경우, 자식 노드들을 재귀적으로 처리
      node.children.forEach(child => addToZip(child, currentPath))
    }
  }

  // 루트 노드부터 시작하여 전체 트리를 순회
  if (root.children) {
    root.children.forEach(child => addToZip(child))
  }

  // ZIP 파일 생성
  return await zip.generateAsync({ type: 'blob' })
}
