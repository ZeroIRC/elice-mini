import { unzipToTree } from '../utils/unzipToTree'
import { treeToZip } from '../utils/treeToZip'
import { useFileStore } from '../store/useFileStore'
import { useEditorStore } from '../store/editorStore'

export const useFileActions = () => {
  const setState = useFileStore.setState
  const getState = useFileStore.getState

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const tree = await unzipToTree(file)
      // 모든 상태 초기화
      setState({
        originalFileName: file.name,
        root: tree[0],
        selectedNode: null,
        expandedPaths: new Set(['/']),
        selectedFile: null,
      })
      // 에디터 임시 상태도 초기화
      useEditorStore.getState().setOpenFiles(new Map())
      useEditorStore.getState().setSelectedFilePath('')
    } catch (error) {
      console.error('ZIP 파일 처리 중 오류 발생:', error)
      alert('ZIP 파일을 처리하는 중 오류가 발생했습니다.')
    }
  }

  const handleDownload = async () => {
    const { root, originalFileName } = getState()
    if (!root) return

    try {
      const blob = await treeToZip(root)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = originalFileName || 'download.zip'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('ZIP 파일 생성 중 오류 발생:', error)
      alert('ZIP 파일을 생성하는 중 오류가 발생했습니다.')
    }
  }

  return {
    handleUpload,
    handleDownload,
  }
}
