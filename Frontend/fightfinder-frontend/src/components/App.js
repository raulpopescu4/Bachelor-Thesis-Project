import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import SeePreferences from './SeePreferences';
import SetPreferences from './SetPreferences';
import Recommendations from './Recommendations';
import Welcome from './Welcome';
import YourFights from './YourFights';
import NavigationBar from './NavigationBar';
import ProfileManagement from './ProfileManagement';
import WatchLinks from './WatchLinks'; 

const App = () => {
  const [auth, setAuth] = useState({ user: null, loggedIn: false });

  return (
    <Router>
      {auth.loggedIn && <NavigationBar />}
        <Routes>
          <Route path="/" element={auth.loggedIn ? <Navigate replace to="/welcome" /> : <Navigate replace to="/login" />} />
          <Route path="/login" element={!auth.loggedIn ? <Login setAuth={setAuth} /> : <Navigate replace to="/welcome" />} />
          <Route path="/register" element={!auth.loggedIn ? <Register setAuth={setAuth} /> : <Navigate replace to="/welcome" />} />
          <Route path="/welcome" element={<Welcome auth={auth} />} />
          <Route path="/view-preferences" element={auth.loggedIn ? <SeePreferences /> : <Navigate replace to="/login" />} />
          <Route path="/update-preferences" element={auth.loggedIn ? <SetPreferences /> : <Navigate replace to="/login" />} />
          <Route path="/recommendations" element={auth.loggedIn ? <Recommendations /> : <Navigate replace to="/login" />} />
          <Route path="/your-fights" element={<YourFights />} />
          <Route path="/profile-management" element={auth.loggedIn ? <ProfileManagement /> : <Navigate replace to="/login" />} />
          <Route path="/watch-links" element={<WatchLinks />} /> {/* Add new route */}
        </Routes>
      
    </Router>
  );
};

export default App;
