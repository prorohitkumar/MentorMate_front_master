import React, { useState } from 'react';
import './AssessmentCreator.css';
import jsondata from '../Data.json';
import ITComponent from '../IT-Component/ITComponent';
import OtherComponent from '../Other-Component/OtherComponent';
import WorkInProgress from '../work-in-progress/WorkInProgress'

export default function AssessmentCreator() {
  // State and other variables initialization
  const domainOptions = jsondata['Domain'].map(obj => obj.name);
  const [assessmentName, setAssessmentName] = useState('');
  const [assessmentNameError, setAssessmentNameError] = useState('');
  const [sector, setSector] = useState('');
  const [isIt, setIsIt] = useState(false);
  const [isOther, setIsOther] = useState(false);
  const [subDomains, setSubDomains] = useState([]);

  // Validate assessment name
  const validateAssessmentName = (name) => {
    if (!name.trim()) {
      setAssessmentNameError('Assessment name is required.');
      return false; // Return false if validation fails
    }
    setAssessmentNameError(''); // Clear error message if validation passes
    return true; // Return true if validation passes
  };

  // Event handlers
  const handleAssessmentNameChange = (event) => {
    const { value } = event.target;
    setAssessmentName(value); // Update assessment name
    validateAssessmentName(value); // Validate updated assessment name
  };

  const handleDomainChange = (event) => {
    if(!validateAssessmentName(assessmentName)){
      return;
    }
    const selectedDomainName = event.target.value;
    setSector(selectedDomainName); // Update sector

    // Set sub-domains and determine component visibility based on selected domain
    if (selectedDomainName) {
      const selectedDomain = jsondata['Domain'].find(domain => domain.name === selectedDomainName);
      setSubDomains(selectedDomain ? selectedDomain.subDomains || [] : []);
      setIsIt(selectedDomainName === 'IT');
      setIsOther(selectedDomainName !== 'IT');
    } else {
      setIsIt(false);
      setIsOther(false);
      setSubDomains([]);
    }
  };

  // Component render
  return (
    <div className="assessmentCreatorBody">
      <div className="top">
        <div className="first">
          <div className='Text'>
            <label>Assessment Name</label>
            <input
              className='textinput'
              type="text"
              name="assessmentName"
              value={assessmentName}
              onChange={handleAssessmentNameChange}
            />
            {assessmentNameError && <div className="error">{assessmentNameError}</div>}
          </div>
          <div className="Text">
            <label>Industry</label>
            <select
              name="sector"
              value={sector}
              onChange={handleDomainChange}
            >
              <option value="">Select Industry</option>
              {domainOptions.map((domain, index) => (
                <option key={index} value={domain}>{domain}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      {isIt && sector ? <ITComponent assessmentName={assessmentName}/> : null}
      {isOther && sector ?  <WorkInProgress/> : null}
    </div>
  );
}