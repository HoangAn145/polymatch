// Real React, local API and Chromium; Supabase HTTP is simulated. Hosted RLS is tested separately.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { chromium } from 'playwright-core';
import { fakeSupabase } from './support/fakeSupabase';
const fake = await fakeSupabase();
const vite = spawn(
  process.execPath,
  [
    'node_modules/vite/bin/vite.js',
    '--host',
    '127.0.0.1',
    '--port',
    '3197',
    '--strictPort',
  ],
  {
    env: {
      ...process.env,
      VITE_APP_MODE: 'platform',
      VITE_SUPABASE_URL: fake.url,
      VITE_SUPABASE_ANON_KEY: 'test-public',
      SUPABASE_URL: fake.url,
      SUPABASE_ANON_KEY: 'test-public',
      GEMINI_API_KEY: '',
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  },
);
let logs = '';
vite.stdout.on('data', (x) => (logs += x));
vite.stderr.on('data', (x) => (logs += x));
let browser: Awaited<ReturnType<typeof chromium.launch>> | undefined;
try {
  await new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(
      () => reject(Error('Vite timeout: ' + logs)),
      30000,
    );
    vite.stdout.on('data', () => {
      if (logs.includes('Local:')) {
        clearTimeout(timeout);
        resolve();
      }
    });
    vite.once('exit', (code) => {
      clearTimeout(timeout);
      reject(Error('Vite exit ' + code + ': ' + logs));
    });
  });
  browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium',
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });
  const page = await browser.newPage();
  page.setDefaultTimeout(30000);
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('http://127.0.0.1:3197/platform');
  const login = async (email: string) => {
    await page.getByLabel('Email', { exact: true }).fill(email);
    await page.getByLabel('Mật khẩu', { exact: true }).fill('Password123!');
    await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click();
  };
  await login('buyer@example.test');
  await page
    .getByRole('heading', { name: 'Diagnostic & Matching', exact: true })
    .waitFor();
  await page.getByLabel('OTIF (%)', { exact: true }).fill('85');
  await page.getByLabel('Mục tiêu OTIF (%)', { exact: true }).fill('95');
  await page.getByLabel('Km xe chạy rỗng (%)', { exact: true }).fill('25');
  await page
    .getByLabel('Mục tiêu Km xe chạy rỗng (%)', { exact: true })
    .fill('15');
  await page.getByLabel('Nguồn đối soát').fill('Báo cáo đối soát thử nghiệm');
  const questions = page
    .locator('fieldset')
    .filter({
      has: page.locator('legend').filter({ hasText: 'Câu hỏi năng lực' }),
    })
    .locator('select');
  const count = await questions.count();
  assert.ok(count > 14);
  for (let i = 0; i < count; i++) await questions.nth(i).selectOption('2');
  await page.getByRole('checkbox').check();
  await page
    .getByRole('button', { name: 'Đánh giá & lưu', exact: true })
    .click();
  await page
    .getByRole('heading', { name: 'Kết quả đánh giá', exact: true })
    .waitFor();
  assert.equal(fake.state.records.length, 1);
  assert.equal(fake.state.kpis.length, 2);
  await page
    .getByRole('button', { name: 'Roadmap & ROI', exact: true })
    .click();
  await page
    .getByLabel('Đánh giá nguồn')
    .selectOption(fake.state.records[0].id);
  await page.getByLabel('Giải pháp dự kiến').selectOption('sol-02');
  await page.getByLabel('Giờ mỗi tuần mỗi người').fill('40');
  await page
    .getByRole('button', { name: 'Tạo lộ trình & lưu', exact: true })
    .click();
  await page
    .getByRole('heading', { name: /Lộ trình dự kiến · 12 tuần/ })
    .waitFor();
  await page
    .getByRole('button', { name: 'Mô phỏng tài chính', exact: true })
    .click();
  await page
    .getByRole('button', { name: 'Mô phỏng & lưu', exact: true })
    .click();
  await page
    .getByRole('heading', { name: /Mô phỏng tài chính · triệu VNĐ/ })
    .waitFor();
  await page
    .getByRole('img', { name: 'Dòng tiền lũy kế theo tháng' })
    .waitFor();
  await page
    .getByRole('button', { name: 'KPI & cảnh báo', exact: true })
    .click();
  await page.getByLabel('Giá trị (%)', { exact: true }).fill('90');
  await page.getByLabel('Mục tiêu (%)', { exact: true }).fill('95');
  await page.getByLabel('Kỳ đo', { exact: true }).fill('2026-12');
  await page
    .getByLabel('Nguồn số liệu', { exact: true })
    .fill('Báo cáo kỳ sau');
  await page.getByRole('button', { name: 'Lưu KPI', exact: true }).click();
  await page
    .getByRole('status')
    .getByText(/Đã lưu KPI/)
    .waitFor();
  assert.equal(fake.state.kpis.length, 3);
  await page.getByRole('button', { name: 'Chatbot CSKH', exact: true }).click();
  await page
    .getByLabel('Nội dung', { exact: true })
    .fill('KPI đánh giá là gì?');
  await page.getByRole('button', { name: 'Gửi câu hỏi', exact: true }).click();
  await page.getByRole('log').getByText('Nguồn dùng để trả lời').waitFor();
  await page
    .getByLabel('Nội dung', { exact: true })
    .fill('Cần chuyên viên đối soát KPI');
  await page
    .getByRole('button', { name: 'Chuyển chuyên viên', exact: true })
    .click();
  await page
    .getByRole('log')
    .getByText(/Đã tạo yêu cầu ticket-0/)
    .waitFor();
  assert.equal(fake.state.tickets.length, 1);
  await page
    .getByRole('button', { name: 'Lịch sử & yêu cầu', exact: true })
    .click();
  await page.getByText(/ticket-0 · CSKH · open/).waitFor();
  assert.equal(fake.state.records.length, 3);
  await page.getByRole('button', { name: 'Đăng xuất', exact: true }).click();
  await page
    .getByRole('heading', { name: 'Đăng nhập POLYMATCH', exact: true })
    .waitFor();
  await login('admin@example.test');
  await page.getByRole('button', { name: 'Quản trị', exact: true }).click();
  await page.locator('summary').filter({ hasText: 'FAQ001' }).click();
  await page
    .getByRole('button', {
      name: 'Xác nhận đã kiểm chứng & xuất bản',
      exact: true,
    })
    .click();
  await page.waitForFunction(
    () => !document.querySelector('summary')?.textContent?.includes('FAQ001'),
  );
  assert.equal(fake.state.docs[0].published, true);
  await page.getByRole('button', { name: 'Chatbot CSKH', exact: true }).click();
  await page
    .getByLabel('Nội dung', { exact: true })
    .fill('Làm thế nào đăng ký POLYMATCH?');
  await page.getByRole('button', { name: 'Gửi câu hỏi', exact: true }).click();
  await page
    .getByRole('log')
    .getByText(/FAQ001 ·/)
    .waitFor();
  assert.deepEqual(errors, []);
  console.log(
    `PASS: login → ${count} answers + KPI → assessment → resource-aware roadmap → ROI chart → KPI history → FAQ → handoff → reports → logout → admin publication → FAQ001 citation. Supabase simulated; no JS errors.`,
  );
} finally {
  await browser?.close();
  vite.kill('SIGTERM');
  await new Promise<void>((r) => fake.server.close(() => r()));
}
