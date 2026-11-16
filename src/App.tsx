import React, { Suspense, lazy } from 'react';
import Platform from './platform/Platform';
const Demo = lazy(() => import('./DemoApp'));
export default function App() {
  return import.meta.env.VITE_APP_MODE === 'demo' ? (
    <Suspense fallback={<p>Đang tải demo…</p>}>
      <Demo />
    </Suspense>
  ) : (
    <Platform />
  );
}
