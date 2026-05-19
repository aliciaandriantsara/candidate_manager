import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { CandidatesListPage } from './pages/CandidatesListPage';
import { CandidateNewPage } from './pages/CandidateNewPage';
import { CandidateDetailPage } from './pages/CandidateDetailPage';

export function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/candidates" replace />} />
          <Route path="candidates" element={<CandidatesListPage />} />
          <Route path="candidates/new" element={<CandidateNewPage />} />
          <Route path="candidates/:id" element={<CandidateDetailPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/candidates" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
