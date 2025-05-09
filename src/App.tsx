export default function App() {
  return (
    <div className="h-screen flex flex-col">
      {/* 헤더 - Zip File Editor */}
      <div className="flex-none bg-gray-800 text-white p-4 border-b border-gray-600">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">ZIP File Editor</h1>
        </div>
      </div>

      {/* 메인 콘텐츠 영역 */}
      <div className="flex-1 flex">
        {/* 왼쪽 - 파일 트리 */}
        <div className="w-64 border-r border-gray-600 bg-gray-800"></div>

        {/* 오른쪽 영역 */}
        <div className="flex-1 flex flex-col">
          {/* 탭 바 */}

          {/* Monaco 에디터 영역 */}
          <div className="flex-1 bg-[#1e1e1e]"></div>
        </div>
      </div>
    </div>
  )
}
