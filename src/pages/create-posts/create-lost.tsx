import React, { useState, useEffect } from 'react';
import '../../styles.css';
import { useNavigate } from 'react-router-dom';
import { PageRoutes } from '../../routes/routes';


interface FormData {
  q1: string;
  q2: string;
  q3: string;
  q4: string;
  q5: string;
  q6: string;
}

const Lost = () => {
  const [progress, setProgress] = useState(10);
  const [qimageUrl, setqImageUrl] = useState("");
  const backSign = "<-";
  const Sign = "->";
  const navigate = useNavigate();

  const questions = [
    {
      title: "What did you lose?",
      type: "text",
      placeholder: "Sunglasses, phone...",
      name: "q1",
    },
    {
        title: "What color was it?",
        type: "text",
        placeholder: "Brown, blue...",
        name: "q2",
    },
    {
      title: "How can someone get to you?",
      type: "text",
      placeholder: "Phone number, mail...",
      name: "q3",
    },
    {
        title: "Where did you lose this?",
        type: "text",
        placeholder: "Calea Torontalului...",
        name: "q4",

    },
    {
        title: "When did this happen?",
        type: "date",
        placeholder: "Select date",
        name: "q5",
    },
    {
      title: "Select an image",
      type: "text",
      placeholder: "Sunglasses, phone...",
      name: "q6",
    },
  ];

  const commonColors: string[] = [
    'red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink',
    'brown', 'white', 'black', 'gray', 'silver', 'gold', 'indigo', 'cyan',
    'magenta', 'lavender', 'teal', 'beige', 'turquoise', 'maroon', 'olive',
    'violet', 'charcoal', 'coral', 'salmon', 'tan', 'mint', 'khaki', 'plum',
    'slate', 'ivory', 'ruby', 'topaz', 'sapphire', 'emerald', 'amber',
    'lemon', 'tangerine', 'orchid',
  ];

  const [step, setStep] = useState(0);
  const [isFormValid, setIsFormValid] = useState(false);

  const onNextPress = () => {
    validateForm();
    if (isFormValid) {
      increaseProgress();
    }
  };

  const increaseProgress = () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
      setProgress(progress + 10);
      setIsFormValid(false);
    }
  };

  const decreaseProgress = () => {
    if (step > 0) {
      setStep(step - 1);
      setProgress(progress - 10);
      setIsFormValid(false);
    }
  };

  const [formData, setFormData] = useState<FormData>({
    q1: '',
    q2: '',
    q3: '',
    q4: '',
    q5: '',
    q6: '',
  });

  const [questionErrors, setQuestionErrors] = useState<string[]>([
    'Please tell us what you lost',
    'Please tell us the color of the object you lost',
    'Please provide a way to contact you',
    'Please provide a valid street name',
    'Invalid date (MM-DD-YYYY)',
    '',
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    validateForm();
  };

  const [curatedPhotos, setCuratedPhotos] = useState<any[]>([]);

  const fetchCuratedPhotos = async (query: string) => {
    try {
      const response = await fetch(`https://api.pexels.com/v1/search?query=${query}&per_page=30`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: "563492ad6f9170000100000176d86d1a24b44141b1771090ff5ddeea",
        },
      });

      if (response.ok) {
        const data = await response.json();
        // console.log(data.photos[0]);
        setCuratedPhotos(data.photos);
      } else {
        console.error('Error fetching data');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const getErrorByIndex = (index: number): string => {
    if (index >= 0 && index < questionErrors.length) {
      return questionErrors[index];
    }
    return ''; 
  };

  const setErrorAtIndex = (index: number, errorMessage: string) => {
    if (index >= 0 && index < questionErrors.length) {
      const updatedErrors = [...questionErrors];
      updatedErrors[index] = errorMessage;
      setQuestionErrors(updatedErrors);
    }
  };

  const validateForm = () => {
    const regexString = /^[^\s]+/;
    const regexStreetName = /^[A-Za-z0-9\s\.,-]+$/; 
    const regexDate = /^\d{4}-\d{2}-\d{2}$/; 
    const isColorValid = commonColors.includes(formData[questions[step].name as keyof FormData].toLowerCase());
    // ! la culoare e cu una in spate
    console.log(formData[questions[step].name as keyof FormData].toLowerCase(), isColorValid);

    const newErrors = [
      regexString.test(formData[questions[step].name as keyof FormData]) ? '' : 'Please tell us what you lost',
      isColorValid ? '' : 'Please tell us the color of the object you lost',
      regexString.test(formData[questions[step].name as keyof FormData]) ? '' : 'Please provide a way to contact you',
      regexStreetName.test(formData[questions[step].name as keyof FormData]) ? '' : 'Please provide a valid street name',
      regexDate.test(formData[questions[step].name as keyof FormData]) ? '' : 'Invalid date (YYYY-MM-DD)',
    ];

    setQuestionErrors(newErrors);

    setIsFormValid(getErrorByIndex(step) === '');
    console.log('EROAREE ', getErrorByIndex(step));
  };

  useEffect(() => {
    // fetchCuratedPhotos(1); // Fetch curated photos for page 1 when the component mounts
  }, []);

  return (
    <div>
      <div className="fixed-header">
        <h2 className='go-back' onClick={() => navigate(PageRoutes.MakeDecision)}>{backSign} Go back</h2>
        <div className="progress-bar">
          <div className="progress" style={{ width: `${(progress / (questions.length * 10)) * 100}%` }}></div>
        </div>
      </div>
      <div className='fullscreen'>
        {step < questions.length && (
          <div className='question'>
            <div className='q-title' onClick={decreaseProgress}>{backSign} {questions[step].title}</div>
            <div>
              <input
                className='input-form'
                type={questions[step].type}
                name={questions[step].name}
                placeholder={questions[step].placeholder}
                autoComplete='off'
                value={formData[questions[step].name as keyof FormData] || ''}
                onChange={handleInputChange}
              />
              <div className="error-text">{getErrorByIndex(step)}</div>
            </div>
            {step < questions.length - 1 && (
              <button className='btn' onClick={onNextPress}>
                Next {Sign}
              </button>
            )}
            {step === questions.length - 1 && (
              <div className='photos-box'>
                <button className='btn' onClick={() => {
                  fetchCuratedPhotos(formData.q6);
                }}>
                  Search
                </button>
              </div>
            )}
            
          </div>
        )}
      </div>
      {step === questions.length - 1 && (
        <div className='photos-api'>
          {curatedPhotos.map((photo, index) => (
            <img className='select-photo' key={index} src={photo.src.medium} onClick={() => setqImageUrl(photo.src.medium)} alt={`Photo ${index}`} />
          ))}
        </div>
      )}
      {step === questions.length - 1 && curatedPhotos.length !== 0 && (
        <div className={`finish-box ${step === questions.length - 1 ? 'active' : ''}`}>
          {qimageUrl !== "" && (
            <img className='select-photo' key="sel-img" id="sel-img" src={qimageUrl} onClick={() => setqImageUrl("")} alt={`Photo selected`} />
          )}
          <button className='btn' id='shadow-btn' onClick={() => console.log(qimageUrl)}>Finish {Sign}</button>
        </div>
      )}
    </div>
  );
}

export default Lost;
