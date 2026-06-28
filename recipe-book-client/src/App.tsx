import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Route-level code splitting: each page becomes its own chunk so the initial
// bundle no longer ships the admin dashboard, the recipe form, or react-player
// (pulled in by RecipeDetail) to every first-time visitor.
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const MyRecipes = lazy(() => import('./pages/MyRecipes'));
const Favorites = lazy(() => import('./pages/Favorites'));
const RecipeDetail = lazy(() => import('./pages/RecipeDetail'));
const RecipeForm = lazy(() => import('./pages/RecipeForm'));
const SharedWithMe = lazy(() => import('./pages/SharedWithMe'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const Profile = lazy(() => import('./pages/Profile'));

function App() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '3rem' }}>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Public routes */}
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="recipes/:id" element={<RecipeDetail />} />

          {/* Authenticated-only routes (data is also enforced by Supabase RLS) */}
          <Route element={<ProtectedRoute />}>
            <Route path="my-recipes" element={<MyRecipes />} />
            <Route path="favorites" element={<Favorites />} />
            <Route path="shared" element={<SharedWithMe />} />
            <Route path="create-recipe" element={<RecipeForm />} />
            <Route path="edit-recipe/:id" element={<RecipeForm />} />
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
