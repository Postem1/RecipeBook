import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MyRecipes from './pages/MyRecipes';
import Favorites from './pages/Favorites';
import RecipeDetail from './pages/RecipeDetail';
import RecipeForm from './pages/RecipeForm';
import SharedWithMe from './pages/SharedWithMe';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="my-recipes" element={<MyRecipes />} />
        <Route path="favorites" element={<Favorites />} />
        <Route path="shared" element={<SharedWithMe />} />
        <Route path="recipes/:id" element={<RecipeDetail />} />
        <Route path="create-recipe" element={<RecipeForm />} />
        <Route path="edit-recipe/:id" element={<RecipeForm />} />
      </Route>
    </Routes>
  );
}

export default App;
