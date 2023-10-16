import React, { useState } from 'react';
import '../../styles.css';
import { useNavigate } from 'react-router-dom';
import { PageRoutes } from '../../routes/routes';

interface FormData {
  q1: string;
  q2: string;
  q3: string;
  q4: string;
  q5: string;
}

const Lost = () => {
  const [progress, setProgress] = useState(10);
  const backSign = "<-";
  const Sign = "->";
  const navigate = useNavigate();

  const questions = [
    {
      title: "What did you lose?",
      type: "text",
      placeholder: "Sunglasses, phone..",
      name: "q1",
    },
    {
        title: "What color was it?",
        type: "text",
        placeholder: "Brown, blue..",
        name: "q2",
    },
    {
      title: "How can someone get to you?",
      type: "text",
      placeholder: "Phone number, mail..",
      name: "q3",
    },
    {
        title: "Where did you lose this?",
        type: "text",
        placeholder: "Calea Torontalului..",
        name: "q4",
    },
    {
        title: "When did this happen?",
        type: "date",
        placeholder: "Select date",
        name: "q5",
    },
  ];

  const [step, setStep] = useState(0);

  const increaseProgress = () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
      setProgress(progress + 10);
    }
  };

  const decreaseProgress = () => {
    if (step > 0) {
      setStep(step - 1);
      setProgress(progress - 10);
    }
  };

  const [formData, setFormData] = useState<FormData>({
    q1: '',
    q2: '',
    q3: '',
    q4: '',
    q5: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

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
            </div>
            {step < questions.length - 1 && (
              <button className='btn' onClick={increaseProgress}>
                Next {Sign}
              </button>
            )}
            {step === questions.length - 1 && (
              <button className='btn' onClick={() => console.log(formData)}>
                Submit
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Lost;
