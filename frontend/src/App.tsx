import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import UploadPage from "./pages/UploadPage";
import ResultDetailsPage from "./pages/ResultDetailsPage";

function App() {
  return (
    <>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow bg-gray-100">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/upload" element={<UploadPage />} />
              <Route path="/result/:resultId" element={<ResultDetailsPage />} />
            </Routes>
          </main>
          <Footer/>
        </div>
      </Router>
    </>
  );
}

export default App;
