import React, { useState, useEffect, useCallback } from 'react';
import './ITComponent.css';
import data from '../IT.json';
import TagInput from './TagInput';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import Axios for making HTTP requests
import Spinner from '../Spinner';
import MarkdownPreview from '@uiw/react-markdown-preview';
import * as XLSX from 'xlsx'; // Import all functions from xlsx library
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



function ITComponent(props) {
  // console.log(props)
  // console.log(props.assessmentName)
  const [quizData, setQuizData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);


  const navigate = useNavigate();


  const [formData, setFormData] = useState([
    { programmingLanguage: '', specializations: '', concepts: [], toolsTechnologies: [], level: '', noOfQuestions: '' },
  ]);

  const [totalQuestions, setTotalQuestions] = useState(0);
  const [errors, setErrors] = useState({});
  const [isRedirect, setIsRedirect] = useState(false);
  const [isAnsReady, setIsAnsReady] = useState(false);
  const [resp, setResp] = useState('');

  const calculateTotalQuestions = () => {
    let total = 0;
    formData.forEach((data) => {
      total += parseInt(data.noOfQuestions || 0);
    });
    setTotalQuestions(total);
  };

  useEffect(() => {
    calculateTotalQuestions();
  }, [formData]);


    
  
  const parseResponseString = (responseString) => {
    const questions = responseString.split('**Question');

    // Remove the first empty element
    questions.shift();

    return questions.map((question) => {
      const [questionWithCode, answerText] = question.split('**Answer:');

      const [questionText, codeSnippet] = questionWithCode.split('```');
      

      const optionsAndCode = questionText.split('\n').filter((line) => line.trim() !== '');
      const questionWithoutCode = optionsAndCode[0];
      const options = optionsAndCode.slice(1);
      // console.log(options)
      const optionss = [];
      const extractOptions = (question) => {
        const optionRegex = /[A-D]\.\s*(.*)/g;
        let match;
    
        while ((match = optionRegex.exec(question)) !== null) {
          optionss.push(match[1]);
        }}
      if(codeSnippet!=null){
        extractOptions(question)
        options[1]=optionss[0];
        options[2]=optionss[1];
        options[3]=optionss[2];
        options[4]=optionss[3];

      }
        

      const answer = answerText.trim();

      return {
        question: questionWithoutCode.trim(),
        options: options.map((option) => option.trim()),
        codeSnippet: codeSnippet ? codeSnippet.trim() : null,
        answer,
      };
    });
  };
  

  const programmingLanguages = data.Sectors[0].ProgrammingLanguages;
  const concepts = data.Sectors[0].concepts;
  const toolsTechnologies = data.Sectors[0].ToolsTechnologiesPlatformsFrameworks;
  const levels = ['Beginner', 'Intermediate', 'Advanced'];
  const specializationsOptions = data.Sectors[0].Specializations;

  const validateField = (name, value, index) => {
    let errorMsg = '';
    switch (name) {
      // case 'programmingLanguage':
      //   if (value) errorMsg = 'Programming language is required';
      //   break;
      case 'specializations':
        if (!value) errorMsg = 'Specialization is required';
        break;
      case 'concepts':
        if (!value || value.length === 0) errorMsg = 'At least one concept is required';
        break;
      // case 'toolsTechnologies':
      //   if (!value || value.length === 0) errorMsg = 'At least one tool/technology is required';
      //   break;
      case 'level':
        if (!value) errorMsg = 'Level is required';
        break;
      case 'noOfQuestions':
        if (!value) errorMsg = 'Number of questions is required';
        else if (isNaN(value) || parseInt(value) <= 0) errorMsg = 'Enter a valid number of questions';
        break;
      default:
        break;
    }
    setErrors(prevErrors => ({ ...prevErrors, [`${name}${index}`]: errorMsg }));
    return errorMsg;
  };

  const handleChange = (index, event) => {
    const { name, value } = event.target;
    const newFormData = [...formData];
    newFormData[index][name] = name === 'concepts' ? value.split(',').map(concept => concept.trim()) : value;
    setFormData(newFormData);
    validateField(name, value, index);
  };

  const validateCurrentFormData = () => {
    const newErrors = {};
    formData.forEach((data, index) => {
      // Validate each field in the row
      Object.keys(data).forEach(fieldName => {
        const value = data[fieldName];
        // Reuse the existing validateField logic for each type of field
        const errorMessage = validateField(fieldName, value, index);
        if (errorMessage) {
          newErrors[`${fieldName}${index}`] = errorMessage;
        }
      });
    });
    setErrors(newErrors); // Update the state with the new errors
    return Object.keys(newErrors).length === 0; // Return true if there are no errors
  };



  const handleAddRow = () => {

    // console.log(formData); // Or submit your form data

    if (validateCurrentFormData()) { // Only add new row if current data is valid
      const lastEntry = formData[formData.length - 1];
      setFormData([...formData, { ...lastEntry, level: '', noOfQuestions: '' }]);
      // Note: No need to clear errors for the new row, as it will be empty initially
    } else {
      // alert('Please correct the errors in the form before adding a new set of questions.');
    }
  };


  const handleRemoveRow = (dataToRemove) => {
    const newFormData = formData.filter((item) => item !== dataToRemove);
    setFormData(newFormData);
  };

  const handleChangeTags = (index, newTags) => {
    const newFormData = [...formData];
    newFormData[index].concepts = newTags;
    setFormData(newFormData);
    validateField('concepts', newTags, index);
  };

  const handleChangeToolsTechnologies = useCallback((index, newTags) => {
    const newFormData = [...formData];
    newFormData[index].toolsTechnologies = newTags;
    setFormData(newFormData);
    validateField('toolsTechnologies', newTags, index);
  }, [formData]);

  const handleSubmit = async (event) => {
    event.preventDefault(); // Move this line to the beginning of the function

    if (validateCurrentFormData()) {

      let isValid = true;
      const newErrors = {};
      formData.forEach((form, index) => {
        Object.keys(form).forEach((key) => {
          const value = form[key];
          const errorMsg = validateField(key, key === 'concepts' || key === 'toolsTechnologies' ? value : value, index);
          if (errorMsg) {
            isValid = false;
            newErrors[`${key}${index}`] = errorMsg;
          }
        });
      });

      if (!isValid) {
        setErrors(newErrors);
      } else {
        setErrors({});

        // Or submit your form data

        const payload = {
          entries: formData
        };

        // console.log(payload);
        try {
          // Make POST request to backend
          setIsRedirect(true)
          setIsAnsReady(false);
          setIsLoading(true);
          const response = await axios.post('http://localhost:8085/api/v1/ai/createAssessment', payload);
          // console.log(response)
          // console.log(response.data); // Log response data
          setIsRedirect(false)
          setIsAnsReady(true)
          setResp(response.data.answer);
          try{
          const quizDataa = parseResponseString(response.data.answer);
          // const quizDataa = parseQuizData(response.data.answer);

          setQuizData(quizDataa);
          // console.log(quizDataa)f
          // console.log(quizData)
          setIsLoading(false);
          } catch(error){
            toast.error("Oh no, something went wrong!");
            setIsRedirect(false)
          setIsLoading(false)
          setIsRedirect(false)
          setIsAnsReady(false)
          }


        } catch (error) {
          toast.error("Oh no, something went wrong!");
          // alert("Error from server")
          setIsRedirect(false)
          setIsLoading(false)
          setIsRedirect(false)
          setIsAnsReady(false)
          console.error('Error:', error);
        }
      }
    }

    // console.log(quizData);
  }

  const downloadExcel = () => {
          // console.log(quizData)

    if (!isLoading && quizData.length > 0) {
      // Clean quizData by removing '**' from the start and end of every value if present
      const cleanedData = quizData.map(item => {
        const cleanedItem = {};
        Object.keys(item).forEach(key => {
          if (typeof item[key] === 'string') {
            cleanedItem[key] = item[key].replace(/^\*\*/, '').replace(/\*\*$/, '');
          } else {
            cleanedItem[key] = item[key];
          }
        });
        return cleanedItem;
      });

      // Map cleanedData to include specified columns and options as separate columns
      const formattedData = cleanedData.map(item => {
        const formattedItem = {};
        // Clean options and add them as separate columns
        item.options.forEach((option, index) => {
          if(item.codeSnippet==null){
          formattedItem[`option${index + 1}`] = index === 0 ? option : option.substring(2); // Trim first two characters
          }
          else{
            formattedItem[`option${index + 1}`] = index === 0 ? option : option; // Trim first two characters

          }
        });
        formattedItem.codeSnippet = item.codeSnippet; // Place codeSnippet between option1 and option2

        // Clean answer field
        if (typeof item.answer === 'string') {
          formattedItem.answer = item.answer.replace(/^\*\*/, '').replace(/\*\*$/, ''); // Remove '**' at start and end
          if (formattedItem.answer.startsWith('.')) {
            const dotIndex = formattedItem.answer.indexOf('.');
            formattedItem.answer = dotIndex !== -1 ? formattedItem.answer.substring(0, dotIndex) : formattedItem.answer;
          }
          else {
            // const dotIndex = formattedItem.answer.indexOf('.');
            formattedItem.answer = formattedItem.answer.substring(formattedItem.answer.indexOf('.') + 1).trim(); // Trim text before first '.'
          }

        }
        else {
          formattedItem.answer = item.answer;
        }

        return formattedItem;

      });

      // console.log(formattedData);

      const formattedDataa = formattedData.map(item => {
        return {
          Question: item.option1,
          codeSnippet:item.codeSnippet,
          A: item.option2,
          B: item.option3,
          C: item.option4,
          D: item.option5,

          answer: item.answer.replace(/^\*\*/, '').replace(/\*\*$/, '') // Clean answer
        };
      });



      // Create a new workbook
      const workbook = XLSX.utils.book_new();
      // Convert formattedData to worksheet
      const worksheet = XLSX.utils.json_to_sheet(formattedDataa);
      // Add worksheet to the workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, props.assessmentName);
      // Write the workbook to a buffer
      const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      // Convert buffer to blob
      const blob = new Blob([buffer], { type: 'application/octet-stream' });
      // Create a download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = props.assessmentName+'.xlsx';
      
      // Trigger download
      document.body.appendChild(a);
      a.click();
      // Cleanup
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };






  return (
    <>
      <div className="it-component">
        <form onSubmit={handleSubmit}>
          {formData.map((data, index) => (
            <div key={index} className="form-roww">
              <div className='programmingLanguage'>
                <label>Specialization<span className="info-icon" title="Select the specialization for the questions">i</span>
                  <div className="error">{errors[`specializations${index}`]}</div></label>
                <select required name="specializations" value={data.specializations} onChange={(event) => handleChange(index, event)}>
                  <option value="">Select Specialization</option>
                  {specializationsOptions.map((specialization, idx) => (
                    <option key={idx} value={specialization}>{specialization}</option>
                  ))}
                </select>
              </div>
              <div className='programmingLanguage'>
                <label>Programming Language <span className="info-icon" title="Select the Programming for the questions">i</span>
                  <div className="error">{errors[`programmingLanguage${index}`]}</div>
                </label>
                <select name="programmingLanguage" value={data.programmingLanguage} onChange={(event) => handleChange(index, event)}>
                  <option value="">Select Programming Language</option>
                  {programmingLanguages.map((language, idx) => (
                    <option key={idx} value={language}>{language}</option>
                  ))}
                </select>
              </div>
              <div className="concept-input-container">
                <label htmlFor="concepts">Concepts<span className="info-icon" title="Select or enter concepts">i</span></label>
                <TagInput initialTags={data.concepts} suggestions={concepts} onTagsChange={(newTags) => handleChangeTags(index, newTags)} />
                <div className="error">{errors[`concepts${index}`]}</div>

                <label>Tools & Technologies<span className="info-icon" title="Select or enter Tools & technology for the questions">i</span></label>
                <TagInput initialTags={data.toolsTechnologies} suggestions={toolsTechnologies} onTagsChange={(newTags) => handleChangeToolsTechnologies(index, newTags)} />
                <div className="error">{errors[`toolsTechnologies${index}`]}</div>
              </div>
              <div className='level'>
                <div>
                  <label>Level</label>
                  <select name="level" value={data.level} onChange={(event) => handleChange(index, event)}>
                    <option value="">Select</option>
                    {levels.map((level, idx) => (
                      <option key={idx} value={level}>{level}</option>
                    ))}
                  </select>
                  <div className="error">{errors[`level${index}`]}</div>
                </div>
                <div>
                  <label>No. of Questions</label>
                  <input type="number" name="noOfQuestions" value={data.noOfQuestions} onChange={(event) => handleChange(index, event)} />
                  <div className="error">{errors[`noOfQuestions${index}`]}</div>
                </div>
                <div>
                  {formData.length !== 1 && (
                    <button type="button" className="remove-button" onClick={() => handleRemoveRow(data)}>
                      -
                    </button>
                  )}
                  {formData.length - 1 === index && (
                    <button type="button" className="add-button" onClick={handleAddRow}>
                      +
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div className="last">
            <div className='totalQ'>
              <p>Total No. of Questions</p>
              <label>{totalQuestions}</label>
            </div>
            <div className="sub-btn">
              <button className='generate-btn' type="submit">Generate</button>
              <button  className='download-btn' onClick={downloadExcel}>Download</button>

            </div>
          </div>
        </form>
      </div>
      {isRedirect ?
        <Spinner /> : <> {isAnsReady ?
          <div className='output'>
            {/* <h2>Response Data</h2> */}
            <div className="response-containerr">
              {/* <button onClick={downloadExcel}>Download</button> */}
              <MarkdownPreview source={resp} />
            </div>
          </div> : <></>}
        </>}
        <ToastContainer /> 

    </>
  );
}

export default ITComponent;