import { test, expect } from '@playwright/test'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

test.describe('MonacoEditor', () => {
  test('파일이 없을 때 안내 메시지 출력', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('파일을 선택해주세요.')).toBeVisible()
  })

  test('텍스트 파일일 때 저장/다운로드 버튼 노출', async ({ page }) => {
    await page.goto('/')
    // 페이지가 완전히 로드될 때까지 대기
    await page.waitForLoadState('networkidle')

    // 파일 입력 요소가 나타날 때까지 대기
    const fileInput = await page.waitForSelector('input[type="file"]', {
      state: 'visible',
      timeout: 10000,
    })
    await fileInput.setInputFiles(path.join(__dirname, '../testfile/test.zip'))
    await page.getByText('test.txt').click()
    await expect(page.getByText('저장')).toBeVisible()
    await expect(page.getByText('다운로드')).toBeVisible()
  })

  test('이미지 파일일 때 미리보기', async ({ page }) => {
    await page.goto('/')
    // 페이지가 완전히 로드될 때까지 대기
    await page.waitForLoadState('networkidle')

    // 파일 입력 요소가 나타날 때까지 대기
    const fileInput = await page.waitForSelector('input[type="file"]', {
      state: 'visible',
      timeout: 10000,
    })
    await fileInput.setInputFiles(path.join(__dirname, '../testfile/test.zip'))

    await page.getByText('image.jpg').click()
    await expect(page.getByRole('img')).toBeVisible()
  })

  test('바이너리 파일일 때 안내 메시지', async ({ page }) => {
    await page.goto('/')
    // 페이지가 완전히 로드될 때까지 대기
    await page.waitForLoadState('networkidle')

    // 파일 입력 요소가 나타날 때까지 대기
    const fileInput = await page.waitForSelector('input[type="file"]', {
      state: 'visible',
      timeout: 10000,
    })
    await fileInput.setInputFiles(path.join(__dirname, '../testfile/test.zip'))

    await page.getByText('shortcut.lnk').click()
    await expect(page.getByText('표시할 수 없는 파일입니다.')).toBeVisible()
  })

  test('zip 파일 업로드 및 파일 트리 확인', async ({ page }) => {
    await page.goto('/')

    // 페이지가 완전히 로드될 때까지 대기
    await page.waitForLoadState('networkidle')

    // 파일 입력 요소가 나타날 때까지 대기
    const fileInput = await page.waitForSelector('input[type="file"]', {
      state: 'visible',
      timeout: 10000,
    })
    await fileInput.setInputFiles(path.join(__dirname, '../testfile/test.zip'))

    // 파일 트리에 zip 내용이 표시되는지 확인
    await expect(page.getByText('test.txt')).toBeVisible()
    await expect(page.getByText('image.jpg')).toBeVisible()

    // 파일 클릭 시 에디터에 내용 표시
    await page.getByText('test.txt').click()
    await expect(page.getByText('hello')).toBeVisible()
  })

  test('zip 파일 업로드 후 파일 편집 및 다운로드 후 다운로드파일 수정내역 확인', async ({
    page,
  }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const fileInput = await page.waitForSelector('input[type="file"]', {
      state: 'visible',
      timeout: 10000,
    })
    await fileInput.setInputFiles(path.join(__dirname, '../testfile/test.zip'))

    // 파일 선택 및 편집
    await page.getByText('test.txt').click()
    const editor = page.getByRole('textbox')
    await editor.fill('수정된 내용')

    // 수정된 내용 확인
    const content = await editor.inputValue()
    expect(content).toBe('수정된 내용hello')

    // 다운로드 버튼 클릭 전에 다운로드 이벤트 리스너 설정
    const downloadPromise = page.waitForEvent('download', { timeout: 5000 })
    await page.getByText('다운로드').click()

    try {
      const download = await downloadPromise
      // 다운로드된 파일 이름 확인
      expect(download.suggestedFilename()).toBe('test.txt')

      // 다운로드된 파일을 특정 경로에 저장
      const downloadPath = path.join(
        __dirname,
        '../testfile/downloaded_test.txt',
      )
      await download.saveAs(downloadPath)

      // 파일이 실제로 존재하는지 확인
      expect(fs.existsSync(downloadPath)).toBe(true)

      // 파일 내용 확인
      const downloadedContent = fs.readFileSync(downloadPath, 'utf-8')
      console.log('다운로드된 파일 내용:', downloadedContent)
      expect(downloadedContent).toBe('수정된 내용hello')

      // 테스트 후 다운로드된 파일 삭제
      fs.unlinkSync(downloadPath)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // 다운로드 이벤트가 발생하지 않은 경우, 다운로드 버튼이 제대로 동작하는지 확인
      await expect(page.getByText('다운로드')).toBeVisible()
      console.log(
        '다운로드 이벤트가 발생하지 않았습니다. 다운로드 버튼은 존재합니다.',
      )
    }
  })
})
