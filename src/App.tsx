import { FileTree } from './components/FileTree'
import { useFileStore } from './store/useFileStore'
import { useFileActions } from './hooks/useFileActions'
import { useTreeActions } from './hooks/useTreeActions'
import { TabBar } from './components/TabBar'
import { useTabActions } from './hooks/useTabActions'
import { MonacoEditor } from './components/MonacoEditor'
import { useMonacoEditorActions } from './hooks/useMonacoEditorActions'
import { RefObject } from 'react'
import { useEditorStore } from './store/editorStore'

export default function App() {
  const { root, selectedNode, expandedPaths } = useFileStore()
  const { handleUpload, handleDownload } = useFileActions()
  const { toggleExpand, selectFile } = useTreeActions()
  const { handleTabClick, handleTabClose } = useTabActions()
  const { editorRef, file, handleSave, handleDownloadFile } =
    useMonacoEditorActions()
  const openFiles = useEditorStore(state => state.openFiles)
  const selectedFilePath = useEditorStore(state => state.selectedFilePath)
  const activeFile = openFiles.get(selectedFilePath) || null

  return (
    <div className="h-screen flex flex-col">
      {/* 헤더 - Zip File Editor */}
      <div className="flex-none bg-gray-800 text-white p-4 border-b border-gray-600">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">ZIP File Editor</h1>
          <div className="flex gap-4">
            <input
              type="file"
              accept=".zip"
              onChange={handleUpload}
              className="text-sm text-gray-300
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-gray-700 file:text-white
                hover:file:bg-gray-600"
            />
            <button
              onClick={handleDownload}
              disabled={!root}
              className="py-2 px-4 rounded-md text-sm font-semibold
                bg-blue-600 text-white hover:bg-blue-700
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Download ZIP
            </button>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 영역 */}
      <div className="flex-1 flex">
        {/* 왼쪽 - 파일 트리 */}
        <div className="w-64 border-r border-gray-600 bg-gray-800">
          <FileTree
            root={root}
            selectedNode={selectedNode}
            expandedPaths={expandedPaths}
            onSelect={selectFile}
            onToggleExpand={toggleExpand}
          />
        </div>

        {/* 오른쪽 영역 */}
        <div className="flex-1 flex flex-col">
          {/* 탭 바 */}
          <TabBar
            openFiles={openFiles}
            activeFile={activeFile}
            onTabClick={handleTabClick}
            onTabClose={handleTabClose}
          />

          {/* Monaco 에디터 영역 */}
          <div className="flex-1 bg-[#1e1e1e]">
            <MonacoEditor
              file={file}
              editorRef={editorRef as RefObject<HTMLDivElement>}
              handleSave={handleSave}
              handleDownloadFile={handleDownloadFile}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
