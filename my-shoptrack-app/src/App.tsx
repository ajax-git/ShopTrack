import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import ProtectedRouteLogin from './components/ProtectedRouteLogin';
import AddListForm from './components/AddListForm';
import ShoppingLists from './components/ShoppingLists';
import ShoppingListDetails from './components/ShoppingListDetails';
import TransitionWrapper from './components/TransitionWrapper';
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Register } from './components/Account/Register';
import { Login } from './components/Account/Login';
import { AuthProvider } from './context/AuthContext';
import NotFoundPage from './components/NotFoundPage';

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshLists = () => {
    setRefreshKey(oldKey => oldKey + 1);
  };

  const handleSearchChange = (newSearchTerm: string) => {
    setSearchTerm(newSearchTerm);
  };

  return (
    <AuthProvider>
    <Router>
      <Navbar onSearchChange={handleSearchChange} />
      <div className="page-background">
        <div className="container mx-auto p-4">
          <TransitionWrapper>
            <Routes>
              <Route path="/" element={
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1">
                  <ProtectedRoute>
                    <AddListForm onListAdded={refreshLists} />
                  </ProtectedRoute>
                  </div>
                  <div className="flex-1 shopping-lists-container">
                  <ProtectedRoute>
                  <ShoppingLists key={refreshKey} searchTerm={searchTerm} />
                  </ProtectedRoute>
                  </div>
                </div>
              } />
              <Route path="/list/:id" element={<ProtectedRoute><ShoppingListDetails /></ProtectedRoute>} />

              <Route path="/account/register" element={
                <ProtectedRouteLogin>
                  <Register />
                </ProtectedRouteLogin>
              } />
              <Route path="/account/login" element={
                <ProtectedRouteLogin>
                  <Login />
                </ProtectedRouteLogin>
              } />

              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </TransitionWrapper>
        </div>
      </div>
      <ToastContainer />
      <Footer />
    </Router>
    </AuthProvider>
  );
};

export default App;