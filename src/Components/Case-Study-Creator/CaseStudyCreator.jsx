import React, { useState } from 'react';
import './CaseStudyCreator.css';
import Spinner from '../Spinner';

import TagInput from '../IT-Component/TagInput';
import ITdata from '../IT.json';
import CaseStudyResponse from '../CaseStudyResponse/CaseStudyResponse';

const ITsector = ITdata.Sectors[0];

const CaseStudyCreator = () => {
  // State for each form field
  const [trainingProgramType, settrainingProgramType] = useState('');
  const [sector, setsector] = useState('');
  const [learningObjectives, setlearningObjectives] = useState([]);
  const [objective, setobjective] = useState('');
  const [technologies, settechnologies] = useState([]);
  const [duration, setDuration] = useState('');
  const [numberOfDevelopers, setNumberOfDevelopers] = useState('');
  const [vertical, setvertical] = useState('');
  const [difficulty, setdifficulty] = useState('');
  const [scenarioDescription, setscenarioDescription] = useState('');
  const [specialization, setspecialization] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setisLoading] = useState(false);

  // Options for the dropdowns, ideally these would come from a database or API
  const sectorOptions = ['IT', 'Healthcare', 'Retail'];

  const difficultyOptions = ['Begginer', 'Intermediate', 'Advanced'];

  const specializationOptions = ITsector.Specializations;
  const toolsTechnologies =
    ITdata.Sectors[0].ToolsTechnologiesPlatformsFrameworks;

  const formData = {
    sector: sector,
    vertical: vertical,
    specialization: specialization,
    caseStudyName: trainingProgramType,
    scenarioDescription: scenarioDescription,
    learningObjectives: learningObjectives,
    technologies: technologies,
    difficulty: difficulty,
    duration: duration,
    numOfDevs: numberOfDevelopers,
  };

  const handleChangeTags = (newTags) => {
    settechnologies(newTags);
  };

  const handleAddRowObj = () => {
    let newObjectives = [...learningObjectives, objective];
    setlearningObjectives(newObjectives);
    setobjective('');
  };

  const handleRemoveRowObj = (dataToRemove) => {
    const filterdLearningObjectives = [...learningObjectives].filter(
      (item) => item !== dataToRemove
    );
    setlearningObjectives(filterdLearningObjectives);
  };

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setisLoading(true);
    try {
      const response = await fetch(
        'http://localhost:8085/api/v1/ai/create/case-study',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        }
      );
      if (!response.ok) throw new Error('Network response was not ok.');
      const answer = await response.json();
      // console.log(answer.answer);
      setMessage(answer.answer);
    } catch (error) {
      console.error(
        'There has been a problem with your fetch operation:',
        error
      );
    } finally {
      setisLoading(false);
    }
  };

  const saveMarkDownFile = () => {
    const blob = new Blob([message], { type: 'text/markdown' });
    const anchor = document.createElement('a');
    anchor.href = window.URL.createObjectURL(blob);
    anchor.download = `${formData.caseStudyName}.md`;
    anchor.click();
  };

  return (
    <>
      <form onSubmit={handleSubmit} className='form-p'>
        <div className='form-table-p'>
          <div className='form-row-p'>
            <div className='form-cell-p '>
              <select
                value={sector}
                className='form-control'
                onChange={(e) => setsector(e.target.value)}
                required
              >
                <option value=''>Select Industry</option>
                {sectorOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className='form-cell-p'>
              <select
                value={vertical}
                className='form-control'
                onChange={(e) => setvertical(e.target.value)}
                required
              >
                <option value=''>Select Vertical</option>
                {ITsector.Verticals.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className='form-cell-p'>
              <select
                value={specialization}
                className='form-control'
                onChange={(e) => setspecialization(e.target.value)}
                required
              >
                <option value=''>Select Specialization</option>
                {specializationOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className='form-row-p '>
            <label className='form-label' title='Enter your program name'>
              Case Study Name{' '}
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='16'
                height='16'
                fill='currentColor'
                className='bi bi-info-circle'
                viewBox='0 0 16 16'
              >
                <path d='M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16' />
                <path d='m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0' />
              </svg>{' '}
            </label>
            <input
              className='form-control'
              type='text'
              value={trainingProgramType}
              onChange={(e) => settrainingProgramType(e.target.value)}
              required
            />
          </div>

          <div className=''>
            <label className='form-label'>
              Scenario Description{' '}
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='16'
                height='16'
                fill='currentColor'
                className='bi bi-info-circle'
                viewBox='0 0 16 16'
              >
                <path d='M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16' />
                <path d='m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0' />
              </svg>{' '}
            </label>
            <textarea
              name='text'
              rows='5'
              onChange={(e) => setscenarioDescription(e.target.value)}
            />
          </div>

          <div className='form-row-p'>
            <label
              className='form-label '
              title='Enter the learning objectives'
            >
              Learning Outcomes{' '}
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='16'
                height='16'
                fill='currentColor'
                className='bi bi-info-circle'
                viewBox='0 0 16 16'
              >
                <path d='M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16' />
                <path d='m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0' />
              </svg>{' '}
            </label>
            <ul>
              {learningObjectives.map((data, index) => (
                <div key={index} className=''>
                  <li>
                    <h5>
                      {data}{' '}
                      <span
                        className='remove-button'
                        onClick={() => handleRemoveRowObj(data)}
                      >
                        -
                      </span>
                    </h5>
                  </li>
                </div>
              ))}
            </ul>

            <input
              className='form-control'
              type='text'
              value={objective}
              onChange={(e) => setobjective(e.target.value)}
            />
            <button
              type='button'
              className='add-button'
              onClick={handleAddRowObj}
            >
              +
            </button>
          </div>

          <div className='form-row-p'>
            <label className='form-label' title='Enter tools and technologies'>
              Tools & Technologies{' '}
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='16'
                height='16'
                fill='currentColor'
                className='bi bi-info-circle'
                viewBox='0 0 16 16'
              >
                <path d='M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16' />
                <path d='m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0' />
              </svg>{' '}
            </label>
            <TagInput
              initialTags={technologies}
              suggestions={toolsTechnologies}
              onTagsChange={(newTags) => handleChangeTags(newTags)}
            />
          </div>

          <div className='form-row-p'>
            <div className='form-cell-p '>
              <select
                value={difficulty}
                className='form-control'
                onChange={(e) => setdifficulty(e.target.value)}
                required
              >
                <option value=''>Select Difficulty</option>
                {difficultyOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className='form-cell-p'>
              <input
                type='number'
                className='form-control'
                placeholder='Enter Duration (hrs)'
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                required
              />
            </div>
            <div className='form-cell-p '>
              <input
                type='number'
                placeholder='Enter No. of Developers'
                value={numberOfDevelopers}
                onChange={(e) => setNumberOfDevelopers(e.target.value)}
                required
              />
            </div>
          </div>
          <div className='form-row-p '></div>
        </div>

        <div className={message.length > 0 ? 'gen-dwn-btn' : 'genbtn'}>
          {message.length > 0 ? (
            <button
              type='button'
              className='download-button'
              onClick={saveMarkDownFile}
            >
              Download
            </button>
          ) : (
            <></>
          )}
          <button className='generate-button' type='submit'>
            Generate
          </button>
        </div>
      </form>
      <div className='markdownResponse'>
        {isLoading ? <Spinner /> : <></>}
        <CaseStudyResponse answer={message} />
      </div>
    </>
  );
};

export default CaseStudyCreator;
