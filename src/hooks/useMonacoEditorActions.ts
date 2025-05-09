import { useEffect, useRef, useState } from 'react'
import * as monaco from 'monaco-editor'
import { useFileStore } from '../store/useFileStore'
import { useEditorStore } from '../store/editorStore'
import { FileTreeNode } from '../types/FileTreeNode'

export function useMonacoEditor() {
  const { selectedFile: file } = useFileStore()
  const [model, setModel] = useState<monaco.editor.ITextModel | null>(null)

  const editorRef = useRef<HTMLDivElement>(null)
  const editorInstanceRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(
    null,
  )
  const openFiles = useEditorStore(state => state.openFiles)
  const selectedFilePath = useEditorStore(state => state.selectedFilePath)
  const root = useFileStore(state => state.root)
  const setRoot = useFileStore.setState
  const setEditor = useEditorStore.getState

  // 단일 파일 다운로드 함수
  const handleDownloadFile = () => {
    const nowFile = useEditorStore.getState().openFiles.get(selectedFilePath)
    if (!nowFile || nowFile.fileType !== 'text') return
    const blob = new Blob([nowFile.content ?? ''], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = nowFile.name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
  // 파일 트리에서 경로로 파일 노드를 찾아 내용을 덮어쓰는 함수
  function updateFileContentInTree(
    node: FileTreeNode,
    path: string,
    content: string,
  ): FileTreeNode {
    if (node.type === 'file' && node.path === path) {
      return { ...node, content }
    }
    if (node.type === 'folder' && node.children) {
      return {
        ...node,
        children: node.children.map(child =>
          updateFileContentInTree(child, path, content),
        ),
      }
    }
    return node
  }

  // 저장 버튼 클릭 시 임시데이터를 원본에 덮어쓰기
  const handleSave = () => {
    if (!root || !selectedFilePath) return
    const tempFile = openFiles.get(selectedFilePath)
    if (!tempFile) return
    const newRoot = updateFileContentInTree(
      root,
      selectedFilePath,
      tempFile.content,
    )
    setEditor().setIsDirty(selectedFilePath, false)
    setRoot({ root: newRoot })
  }
  const changeFileContent = () => {
    const selectedFile = useFileStore.getState().selectedFile
    if (!selectedFile || !editorInstanceRef.current) return
    useEditorStore
      .getState()
      .changeFileContent(
        selectedFile.path,
        editorInstanceRef.current.getValue(),
      )
    useEditorStore.getState().setIsDirty(selectedFile.path, true)
  }

  useEffect(() => {
    if (!editorInstanceRef.current && editorRef.current) {
      editorInstanceRef.current = monaco.editor.create(editorRef.current, {
        model,
        theme: 'vs-dark',
      })
      editorInstanceRef.current.onDidChangeModelContent(() => {
        if (editorInstanceRef.current) {
          changeFileContent()
        }
      })
    } else {
      if (editorInstanceRef.current) {
        editorInstanceRef.current.setModel(model)
      }
    }
    return () => {
      if (model) {
        model.dispose()
      }
    }
  }, [model])

  useEffect(() => {
    if (file?.fileType !== 'text' || !editorRef.current || !file) {
      if (editorInstanceRef.current) {
        editorInstanceRef.current.dispose()
        editorInstanceRef.current = null
      }
      return
    }

    setModel(
      monaco.editor.createModel(
        file.fileType === 'text' && file.content ? file.content : '',
        getLanguageFromFileName(file.name),
      ),
    )
  }, [file])

  return { editorRef, file, handleSave, handleDownloadFile }
}

export function getLanguageFromFileName(fileName: string): string {
  const ext = fileName.split('.').pop()?.toLowerCase()
  const languageMap: { [key: string]: string } = {
    js: 'javascript',
    jsx: 'javascript',
    ts: 'typescript',
    tsx: 'typescript',
    html: 'html',
    css: 'css',
    json: 'json',
    md: 'markdown',
    py: 'python',
    java: 'java',
    cpp: 'cpp',
    c: 'c',
    go: 'go',
    rs: 'rust',
    sql: 'sql',
    yaml: 'yaml',
    yml: 'yaml',
    xml: 'xml',
    sh: 'shell',
    bash: 'shell',
    txt: 'plaintext',
  }
  return ext ? languageMap[ext] || 'plaintext' : 'plaintext'
}
