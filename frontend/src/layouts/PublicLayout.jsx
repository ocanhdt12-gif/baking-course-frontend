import { Outlet } from 'react-router-dom';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import { useTemplateRuntime } from '../hooks/useTemplateRuntime';

const PublicLayout = () => {
  // Initialize template scripts specific to SPA route changes
  useTemplateRuntime();

  return (
    <div id="canvas">
      <div id="box_wrapper">
        <Header />
        <Outlet />
        <Footer />
      </div>
    </div>
  );
};

export default PublicLayout;
