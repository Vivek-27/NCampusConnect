import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import useSocket from './hooks/useSocket';
import { useSelector } from 'react-redux';

function App() {
  const userData = useSelector((state) => state.authReducer);
  const userId = userData?.authData?.user?._id;
  const { notifications, socketMsg, unreadMessages } = useSocket(userId);

  return (
    <div className=" overflow-hidden">
      <div className="bg_glow_1"></div>
      <div className="bg_glow_2"></div>
      <div className="bg_glow_3"></div>
      <Navbar notifications={notifications} unreadMessages={unreadMessages} />
      <Outlet context={socketMsg} />
    </div>
  );
}

export default App;
