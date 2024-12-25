import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';

function App() {
  return (
    <div className="">
      <div className="bg_glow_1"></div>
      <div className="bg_glow_2"></div>
      <div className="bg_glow_3"></div>
      <Navbar />
      <Outlet />
    </div>
  );
}

export default App;
