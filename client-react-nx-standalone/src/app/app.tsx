import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NxWelcome from './nx-welcome';
import Card from './components/Card';

export function App() {
  return (
    // <div>
    //   <NxWelcome title="client-react-nx-standalone" />
    // </div>
    <Router>
      <Routes>
        <Route
          path="/"
          element={<NxWelcome title="client-react-nx-standalone" />}
        />
        <Route
          path="/card"
          element={<Card title="Card Title" content="Card Content" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
