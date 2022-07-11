import './App.css';
import Login from './components/Login';
import { Route, Routes, BrowserRouter } from 'react-router-dom'
import ChatRoom from './components/ChatRoom';
import AuthProvider from './context/AuthProvider';
import AppProvider from './context/AppProvider';
import AddRoomModal from './components/Modals/addRoomModal';
import InviteMemberModal from './components/Modals/InviteMemberModal';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/' element={<ChatRoom />} />
          </Routes>
          <AddRoomModal/>
          <InviteMemberModal/>
        </AppProvider>
      </AuthProvider>

    </BrowserRouter>
  );
}

export default App;
