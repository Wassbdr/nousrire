import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AdminRoute from './components/AdminRoute';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Donate from './components/Donate';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Login from './pages/Login';
import Admin from './pages/Admin';
import Events from './components/Events';
import News from './components/News';
import Volunteer from './components/Volunteer';

const AppContent = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-cream-50 via-white to-brand-cream-50">
      {isHomePage && <Navbar />}
      <Routes>
        <Route
          path="/"
          element={
            <main className="relative">
              <div className="absolute inset-0 bg-gradient-to-b from-brand-cream-50 via-white to-brand-cream-50" />
              <div className="relative">
                <section id="accueil">
                  <Hero />
                </section>
                <section id="mission">
                  <About />
                </section>
                <section id="actions">
                  <News />
                </section>
                <section id="calendrier">
                  <Events />
                </section>
                <section id="benevole">
                  <Volunteer />
                </section>
                <section id="don">
                  <Donate />
                </section>
                <section id="contact">
                  <Contact />
                </section>
              </div>
            </main>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={
          <AdminRoute>
            <Admin />
          </AdminRoute>
        } />
      </Routes>
      {isHomePage && <Footer />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

export default App;