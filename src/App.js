import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SideNav from './Components/Side-Nav/SideNav';
import QuickQuiz from './Components/Quick-Quiz/QuickQuiz';
import AssessmentCreator from './Components/Assessment-Creator/AssessmentCreator';
import Output from './Components/IT-Component/Output';
import CaseStudyCreator from './Components/Case-Study-Creator/CaseStudyCreator';
import CodeReviewer from './Components/Code-Reviewer/CodeReviewer';
import WorkInProgress from './Components/work-in-progress/WorkInProgress';
import Login from './Components/Login/Login';
import CaseStudyResponse from './Components/CaseStudyResponse/CaseStudyResponse';
import HomePage from './Components/HomePage/HomePage';

function App() {
  // State to manage user authentication status
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      {/* <Routes> */}
        {/* <Route path="/" element={!isAuthenticated ? <Navigate to="/login" /> : <Navigate to="/quick-quiz" />} /> */}
        {/* <Route path="/login" element={<Login authenticate={() => setIsAuthenticated(true)} />} /> */}
        {/* {isAuthenticated && ( */}
          <>
            <SideNav />
            <div className='main-content'>
              <Routes>
              <Route path="/" element={<HomePage />} />
                <Route path='/quick-quiz' element={<QuickQuiz />} />
                <Route path='/assessment-creator' element={<AssessmentCreator />} />
                <Route path='/case-study-creator' element={<CaseStudyCreator />} />
                <Route path='/code-reviewer' element={<CodeReviewer />} />
                <Route path='/work-in-progress' element={<WorkInProgress />} />
                <Route path='/assessment-output' element={<Output />} />
              </Routes>
            </div>
          </>
        {/* )} */}
      {/* </Routes> */}
    </Router>
  );
}

export default App;
