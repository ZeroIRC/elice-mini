import { unzipToTree } from '../../utils/unzipToTree'
import JSZip from 'jszip'

describe('unzipToTree', () => {
  // 테스트용 ZIP 파일 생성 헬퍼 함수
  async function createTestZip(files: {
    [key: string]: string
  }): Promise<File> {
    const zip = new JSZip()

    // 파일들을 ZIP에 추가
    Object.entries(files).forEach(([path, content]) => {
      zip.file(path, content)
    })

    // ZIP 파일 생성
    const blob = await zip.generateAsync({ type: 'blob' })
    return new File([blob], 'test.zip', { type: 'application/zip' })
  }

  it('단일 텍스트 파일이 있는 간단한 ZIP 파일을 올바르게 파싱해야 함', async () => {
    const testFiles = {
      'test.txt': 'Hello, World!',
    }

    const zipFile = await createTestZip(testFiles)
    const result = await unzipToTree(zipFile)

    expect(result).toHaveLength(1) // 루트 노드
    expect(result[0].name).toBe('test')
    expect(result[0].type).toBe('folder')
    expect(result[0].children).toHaveLength(1)

    const fileNode = result[0].children![0]
    expect(fileNode.name).toBe('test.txt')
    expect(fileNode.type).toBe('file')
    expect(fileNode.content).toBe('Hello, World!')
  })

  it('중첩된 디렉토리를 처리해야 함', async () => {
    const testFiles = {
      'folder1/test1.txt': 'Content 1',
      'folder1/folder2/test2.txt': 'Content 2',
    }

    const zipFile = await createTestZip(testFiles)
    const result = await unzipToTree(zipFile)

    expect(result[0].children).toHaveLength(1)

    const folder1 = result[0].children![0]
    expect(folder1.name).toBe('folder1')
    expect(folder1.type).toBe('folder')
    expect(folder1.children).toHaveLength(2)

    const test1 = folder1.children!.find(node => node.name === 'test1.txt')
    expect(test1?.content).toBe('Content 1')

    const folder2 = folder1.children!.find(node => node.name === 'folder2')
    expect(folder2?.type).toBe('folder')
    expect(folder2?.children![0].content).toBe('Content 2')
  })

  it('다양한 파일 타입을 올바르게 처리해야 함', async () => {
    const textContent = 'Hello, World!'
    const imageContent = new Uint8Array([0xff, 0xd8, 0xff, 0xe0]) // 가짜 JPEG 헤더

    const zip = new JSZip()
    zip.file('test.txt', textContent)
    zip.file('test.jpg', imageContent)

    const blob = await zip.generateAsync({ type: 'blob' })
    const zipFile = new File([blob], 'test.zip', { type: 'application/zip' })

    const result = await unzipToTree(zipFile)
    const files = result[0].children!

    const textFile = files.find(f => f.name === 'test.txt')
    const imageFile = files.find(f => f.name === 'test.jpg')

    expect(textFile?.content).toBe(textContent)
    expect(textFile?.fileType).toBe('text')

    expect(imageFile?.binaryData).toBeDefined()
    expect(imageFile?.fileType).toBe('image')
  })

  it('빈 ZIP 파일을 처리해야 함', async () => {
    const zip = new JSZip()
    const blob = await zip.generateAsync({ type: 'blob' })
    const zipFile = new File([blob], 'empty.zip', { type: 'application/zip' })

    const result = await unzipToTree(zipFile)

    expect(result).toHaveLength(1)
    expect(result[0].children).toHaveLength(0)
  })
})
