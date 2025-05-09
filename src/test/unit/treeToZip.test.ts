import { treeToZip } from '../../utils/treeToZip'
import * as JSZip from 'jszip'
import { FileTreeNode } from '../../types/FileTreeNode'

describe('treeToZip', () => {
  it('단일 텍스트 파일이 있는 ZIP 파일을 생성해야 함', async () => {
    const testContent = 'Hello, World!'
    const root: FileTreeNode = {
      name: 'root',
      path: '/',
      type: 'folder',
      children: [
        {
          name: 'test.txt',
          path: '/test.txt',
          type: 'file',
          content: testContent,
          fileType: 'text',
        },
      ],
    }

    const blob = await treeToZip(root)
    const zip = await JSZip.loadAsync(blob)
    const content = await zip.file('test.txt')?.async('string')

    expect(content).toBe(testContent)
  })

  it('중첩된 디렉토리를 처리해야 함', async () => {
    const root: FileTreeNode = {
      name: 'root',
      path: '/',
      type: 'folder',
      children: [
        {
          name: 'folder1',
          path: '/folder1',
          type: 'folder',
          children: [
            {
              name: 'test1.txt',
              path: '/folder1/test1.txt',
              type: 'file',
              content: 'Content 1',
              fileType: 'text',
            },
            {
              name: 'folder2',
              path: '/folder1/folder2',
              type: 'folder',
              children: [
                {
                  name: 'test2.txt',
                  path: '/folder1/folder2/test2.txt',
                  type: 'file',
                  content: 'Content 2',
                  fileType: 'text',
                },
              ],
            },
          ],
        },
      ],
    }

    const blob = await treeToZip(root)
    const zip = await JSZip.loadAsync(blob)

    const content1 = await zip.file('folder1/test1.txt')?.async('string')
    const content2 = await zip
      .file('folder1/folder2/test2.txt')
      ?.async('string')

    expect(content1).toBe('Content 1')
    expect(content2).toBe('Content 2')
  })

  it('바이너리 파일을 처리해야 함', async () => {
    const binaryData = new Uint8Array([0xff, 0xd8, 0xff, 0xe0])
    const root: FileTreeNode = {
      name: 'root',
      path: '/',
      type: 'folder',
      children: [
        {
          name: 'test.jpg',
          path: '/test.jpg',
          type: 'file',
          binaryData,
          fileType: 'image',
        },
      ],
    }

    const blob = await treeToZip(root)
    const zip = await JSZip.loadAsync(blob)
    const content = await zip.file('test.jpg')?.async('uint8array')

    expect(content).toEqual(binaryData)
  })

  it('빈 폴더를 처리해야 함', async () => {
    const root: FileTreeNode = {
      name: 'root',
      path: '/',
      type: 'folder',
      children: [
        {
          name: 'emptyFolder',
          path: '/emptyFolder',
          type: 'folder',
          children: [],
        },
      ],
    }

    const blob = await treeToZip(root)
    const zip = await JSZip.loadAsync(blob)

    // 빈 폴더는 ZIP에서 무시되므로, 파일이 없어야 함
    expect(Object.keys(zip.files).length).toBe(0)
  })
})
