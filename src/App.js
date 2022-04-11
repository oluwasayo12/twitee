import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Post from "./Post";
import Auth from "./Auth";

function App() {
  return (
    <div className="App">
      <div className="container">
        <Router>
          <Routes>
            <Route path="" element={<Auth />} />
            <Route path="posts" element={<Post />} />
          </Routes>
        </Router>
      </div>
    </div>
  );
}

export default App;
