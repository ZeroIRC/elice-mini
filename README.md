# ZIP 파일 파서 및 에디터

이 프로젝트는 ZIP 파일을 파싱하고 내부 파일들을 트리 구조로 표시하여 편집할 수 있는 웹 애플리케이션입니다.

## 주요 기능

- ZIP 파일 업로드 및 파싱
- 파일 트리 구조 시각화
- 텍스트 파일 내용 보기 및 편집
- 수정된 파일 트리를 ZIP 파일로 다운로드

## 기술 스택

- React
- TypeScript
- JSZip (ZIP 파일 처리)
- Tailwind CSS (스타일링)

## 프로젝트 구조

```
src/
├── components/          # React 컴포넌트
│   ├── FileTree.tsx    # 파일 트리 컴포넌트
│   ├── TabBar.tsx      # 에디터 탭 컴포넌트
│   └── MonacoEditor.tsx # Monaco 에디터 컴포넌트
│
├── hooks/              # 커스텀 훅
│   ├── useFileActions.ts           # 파일 처리 관련 훅
│   ├── useTreeActions.ts           # 트리 조작 관련 훅
│   ├── useTabActions.ts            # 탭 관리 관련 훅
│   └── useMonacoEditorActions.ts   # 에디터 관련 훅
│
├── store/             # Zustand 스토어
│   ├── useFileStore.ts     # 파일 트리 상태 관리
│   └── editorStore.ts      # 에디터 상태 관리
│
├── types/             # TypeScript 타입 정의
│   ├── FileTreeNode.ts     # 파일 트리 노드 타입
│   ├── FileStore.ts        # 파일 스토어 타입
│   └── EditorStore.ts      # 에디터 스토어 타입
│
├── utils/             # 유틸리티 함수
│   ├── unzipToTree.ts      # ZIP 파일 파싱
│   └── treeToZip.ts        # ZIP 파일 생성
│
└── test/             # 테스트 파일
    ├── unit/             # 단위 테스트
    └── e2e/              # E2E 테스트
```

## 커밋 컨벤션

### 커밋 메시지 구조

```
type(scope): subject

body

footer
```

### 커밋 타입 (Type)

- **feat**: 새로운 기능 추가
- **fix**: 버그 수정, 코드 리팩토링
- **docs**: 문서 수정
- **test**: 테스트 코드, 리팩토링 테스트 코드 추가
- **config**: 빌드 업무 수정, 패키지 매니저 수정

### 핵심 로직

1. **ZIP 파일 파싱 (`utils/unzipToTree.ts`)**

   - JSZip 라이브러리를 사용하여 ZIP 파일 구조 분석
   - 파일 타입 자동 감지 (텍스트/이미지/바이너리)
   - 텍스트 파일의 경우 UTF-8 인코딩으로 내용 추출
   - 재귀적 트리 구조로 변환

2. **파일 트리 관리 (`store/useFileStore.ts`)**

   - Zustand를 사용한 상태 관리
   - 파일 트리 구조의 CRUD 연산
   - 파일/폴더 선택 상태 관리
   - 트리 노드 확장/축소 상태 관리

3. **에디터 상태 관리 (`store/editorStore.ts`)**

   - Monaco Editor 인스턴스 관리
   - 열린 파일들의 상태 관리
   - 파일 내용 변경 감지 및 처리
   - 자동 저장 및 변경 사항 추적

4. **ZIP 파일 생성 (`utils/treeToZip.ts`)**
   - 수정된 파일 트리를 ZIP 구조로 변환
   - 파일 타입별 적절한 데이터 처리
   - 폴더 구조 보존
   - 파일 메타데이터 유지

### 데이터 구조

```typescript
interface FileTreeNode {
  name: string
  path: string
  type: 'file' | 'folder'
  children?: FileTreeNode[]
  content?: string // 텍스트 파일용
  binaryData?: Uint8Array // 바이너리 파일용
  fileType?: 'text' | 'image' | 'binary'
}
```

## 설치 및 실행

1. 의존성 설치

```bash
npm install
```

2. 개발 서버 실행

```bash
npm run dev
```

3. 빌드

```bash
npm run build
```

## 주요 기능 설명

### ZIP 파일 파싱

- JSZip 라이브러리를 사용하여 ZIP 파일 구조 분석
- 파일 확장자 기반 타입 감지
- 텍스트 파일의 경우 UTF-8 인코딩으로 내용 추출

### 파일 트리 구조

- 재귀적 트리 구조로 파일과 폴더 표현
- 폴더 확장/축소 기능
- 파일 선택 및 내용 표시

### 파일 편집

- 텍스트 파일 내용 실시간 편집
- 변경 사항 자동 저장
- 최종 결과물 ZIP 파일로 다운로드

## 커스텀 훅

프로젝트의 각 컴포넌트는 독립적인 책임을 가지며, 이에 따라 커스텀 훅도 컴포넌트별로 분리되어 있습니다.

### 파일 처리 관련 훅

#### useFileActions

```typescript
const useFileActions = () => {
  // ZIP 파일 업로드 처리
  const handleUpload = async (file: File) => {...}

  // 수정된 파일 트리를 ZIP으로 다운로드
  const handleDownload = async () => {...}

  return { handleUpload, handleDownload }
}
```

- ZIP 파일 업로드/다운로드 로직 캡슐화
- 파일 처리 중 발생하는 에러 처리
- 상태 관리와 연동된 파일 처리 로직

### 상태 관리 훅

#### useFileStore

```typescript
const useFileStore = create<FileStore>(set => ({
  root: null,
  selectedNode: null,
  expandedPaths: new Set(['/']),
  // 상태 업데이트 메서드들...
}))
```

- Zustand를 사용한 전역 상태 관리
- 파일 트리 구조 상태 관리
- 선택된 노드와 확장된 경로 관리

#### useEditorStore

```typescript
const useEditorStore = create<EditorStore>(set => ({
  openFiles: new Map(),
  selectedFilePath: '',
  // 에디터 관련 상태 업데이트 메서드들...
}))
```

- 에디터 관련 상태 관리
- 열린 파일들의 내용 관리
- 현재 선택된 파일 경로 관리

### UI 컴포넌트별 훅

#### useTreeActions

```typescript
const useTreeActions = () => {
  // 파일 트리 노드 확장/축소
  const toggleExpand = (path: string) => {...}

  // 파일 선택 및 에디터 상태 업데이트
  const selectFile = (file: FileTreeNode) => {...}

  return { toggleExpand, selectFile }
}
```

- 파일 트리 노드 확장/축소 관리
- 파일 선택 시 에디터 상태 연동
- 파일 오픈/클로즈 처리

#### useTabActions

```typescript
const useTabActions = () => {
  // 탭 클릭 처리
  const handleTabClick = (file: FileTreeNode) => {...}

  // 탭 닫기 처리
  const handleTabClose = (file: FileTreeNode) => {...}

  return { handleTabClick, handleTabClose }
}
```

- 에디터 탭 선택 관리
- 탭 닫기 시 상태 정리
- 마지막 탭 닫힐 때 처리

#### useMonacoEditorActions

```typescript
const useMonacoEditorActions = () => {
  // 에디터 인스턴스 및 모델 관리
  const editorRef = useRef<HTMLDivElement>(null)
  const [model, setModel] = useState<monaco.editor.ITextModel | null>(null)

  // 파일 저장 및 다운로드
  const handleSave = () => {...}
  const handleDownloadFile = () => {...}

  return { editorRef, file, handleSave, handleDownloadFile }
}
```

- Monaco 에디터 초기화 및 설정
- 파일 내용 변경 감지 및 처리
- 파일 저장/다운로드 기능
- 에디터 테마 및 언어 설정

## 테스트

### 단위 테스트

```typescript
// unzipToTree.test.ts
describe('unzipToTree', () => {
  it('단일 텍스트 파일이 있는 ZIP 파일을 올바르게 파싱해야 함', async () => {...})
  it('중첩된 디렉토리를 처리해야 함', async () => {...})
  it('다양한 파일 타입을 올바르게 처리해야 함', async () => {...})
  it('빈 ZIP 파일을 처리해야 함', async () => {...})
})

// treeToZip.test.ts
describe('treeToZip', () => {
  it('파일 트리를 ZIP 파일로 변환해야 함', async () => {...})
  it('중첩 폴더 구조를 보존해야 함', async () => {...})
  it('바이너리 파일을 올바르게 처리해야 함', async () => {...})
})
```

### 테스트 커버리지

- Jest를 사용한 단위 테스트
- 핵심 유틸리티 함수들에 대한 테스트 케이스
- 다양한 시나리오에 대한 테스트 구현
  - 파일 타입별 처리
  - 디렉토리 구조 처리
  - 에러 케이스 처리
  - 엣지 케이스 처리

### E2E 테스트

- Playwright를 사용한 E2E 테스트
- 주요 사용자 시나리오 테스트
  - ZIP 파일 업로드/다운로드
  - 파일 트리 탐색
  - 파일 내용 편집
  - 변경 사항 저장
