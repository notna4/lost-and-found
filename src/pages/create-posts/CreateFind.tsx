import React, { useState, useEffect, useRef } from 'react';
import '../../styles.css';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { PageRoutes } from '../../routes/routes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileUpload } from '@fortawesome/free-solid-svg-icons';
import { collection, addDoc, Firestore, doc, getFirestore, getDocs, where, query } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, uploadString } from 'firebase/storage';
import Lottie from 'react-lottie';
import load from '../../assets/load.json';

const firebaseConfig = {
  apiKey: "AIzaSyBfwTK_UcnWu0HbLVjXSJgnFe-d6STRkkM",
  authDomain: "lost-and-found-373e1.firebaseapp.com",
  projectId: "lost-and-found-373e1",
  storageBucket: "lost-and-found-373e1.appspot.com",
  messagingSenderId: "699180430397",
  appId: "1:699180430397:web:ce9f1b1ef1823447f82654"
};

// const transporter = nodemailer.createTransport({
//   service: "Gmail",
//   host: "smtp.gmail.com",
//   port: 465,
//   secure: true,
//   auth: {
//     user: "cristicanceal@gmail.com",
//     pass: "krbt hoqm huoc nyjw",
//   },
// });

interface mailInterface {
  to: string;
  subject: string;
  text: string;
}

const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore();
const storage = getStorage();

interface FormData {
  q1: string;
  q2: string;
}

interface Task {
    id: string;
    userId: string;
    objectLost: any;
    color: any;
    imageLink: any;
    isImageInStorage: any;
    region: any;
    contact: any;
    date: any;
  }
  
  interface FilteredTasksDisplayProps {
    filteredDataStructure: Task[];
  }
  
  const FilteredTasksDisplay: React.FC<FilteredTasksDisplayProps> = ({ filteredDataStructure }) => {
    // console.log("HEEEEi");
    // console.log(filteredDataStructure);
    return (
      <div className="filtered-tasks">
        <h2>Filtered Tasks:</h2>
        <ul>
          {filteredDataStructure.map((task) => (
            <li key={task.id}>
              <strong>Object Lost:</strong> {task.objectLost}, <strong>Color:</strong> {task.color}
            </li>
          ))}
        </ul>
      </div>
    );
  };

const Find = () => {
  const auth = getAuth()
  const [isDropdown, setIsDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(10);
  const [uploadOwnPhoto, setUploadOwnPhoto] = useState(false);
  const [qimageUrl, setqImageUrl] = useState("");
  const backSign = "<-";
  const Sign = "->";
  const navigate = useNavigate();
  var [filteredDataStructure, setFilteredDataStructure] = useState<Task[]>([]);


  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: load,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  const questions = [
    {
      title: "What did you find?",
      type: "text",
      placeholder: "Sunglasses, phone...",
      name: "q1",
    },
    {
        title: "What color was it?",
        type: "text",
        placeholder: "Red, green, blue..",
        name: "q2",
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
    // validateForm();
    // if (isFormValid) {
      increaseProgress();
    // }
  };

  const increaseProgress = () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
      setProgress(progress + 10);
      // setIsFormValid(false);
      setUploadOwnPhoto(false);
    }
  };

  const decreaseProgress = () => {
    if (step > 0) {
      setStep(step - 1);
      setProgress(progress - 10);
      setIsFormValid(false);
      setUploadOwnPhoto(false);
    }
  };

  const [formData, setFormData] = useState<FormData>({
    q1: '',
    q2: '',
  });

  // const [questionErrors, setQuestionErrors] = useState<string[]>([
  //   'Please tell us what you lost',
  //   'Please tell us the color of the object you lost',
  //   'Please provide a way to contact you',
  //   'Please provide a valid street name',
  //   'Invalid date (MM-DD-YYYY)',
  //   '',
  // ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    // validateForm();
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

  useEffect(() => {
    // fetchCuratedPhotos(1); // Fetch curated photos for page 1 when the component mounts
  }, []);

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (qimageUrl) {
      setqImageUrl("");
    }
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleUploadImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Open the file input
    }
  };

  

  const fetchAllDataFromFirebase = async () => {
    if (auth.currentUser) {
      try {
        const userId = auth.currentUser.uid;
        const userTasksCollection = collection(db, 'lost-items');
  
        const querySnapshot = await getDocs(query(userTasksCollection));
  
        const dataStructure = [];
        // const filteredDataStructure: React.SetStateAction<Task[]> = [];
        // setFilteredDataStructure([]);
        filteredDataStructure = [];

        querySnapshot.forEach((doc) => {
          const { objectLost, color, imageLink, isImageInStorage, region, contact, date } = doc.data();
  
          const task = {
            id: doc.id,
            userId,
            objectLost,
            color,
            imageLink,
            isImageInStorage,
            region,
            contact,
            date
          };
  
          // console.log(filteredDataStructure);
          // console.log(task);
          // useState<Task[]>([]);
          // Check conditions for filtering
          if (!filteredDataStructure.includes(task)) {
              // console.log("acum");
              dataStructure.push(task);

              if (objectLost.includes(formData.q1) && color.includes(formData.q2)) {
              filteredDataStructure.push(task);
              setIsDropdown(true);
            }
          }
          
        });
  
        // Now dataStructure contains all the tasks for the current user
        // console.log('All filtered data:', filteredDataStructure);
  
        // Update the state after the loop is complete
        setFilteredDataStructure(filteredDataStructure);
        
      } catch (e) {
        console.error('Error fetching data from Firestore:', e);
      }
    }

    return filteredDataStructure;
  };
  
  

  const sendToFirebase = async () => {
    if (auth.currentUser) {
      setLoading(true);
      try {
        const userId = auth.currentUser.uid;
  
        // Reference to the 'tasks' collection under the user's document
        const userTasksCollection = collection(db, 'lost-items');
  
        await addDoc(userTasksCollection, {
          userId,
          objectLost: formData.q1,
          color: formData.q2,
          imageLink: qimageUrl ? qimageUrl : null,
          isImageInStorage: selectedImage ? true : false,
        }).then(async (doc) => {
          if (selectedImage) {
            const storageRef = ref(storage, `lost-items/${doc.id}`);
            await uploadBytes(storageRef, selectedImage).then((snapshot) => {
              console.log('Uploaded a file!');
            });
          }
        });
      } catch (e) {
        console.error('Error adding document to Firestore:', e);
      } finally {
        setTimeout(() => {
            setLoading(false);
            navigate(PageRoutes.ItemPostedSuccess)
          }, 3000);
      }
    }
  }

  const fixedHeader = (
    <div className="fixed-header">
      <h2 className='go-back' onClick={() => navigate(PageRoutes.MakeDecision)}>
        {backSign} Go back
      </h2>
      <div className="progress-bar">
        <div className="progress" style={{ width: `${(progress / (questions.length * 10)) * 100}%` }}></div>
      </div>
    </div>
  );

  const photosApiBlock = step === questions.length - 1 && !uploadOwnPhoto && (
    <div className='photos-api'>
      {curatedPhotos.map((photo, index) => (
        <img
          className='select-photo'
          key={index}
          src={photo.src.medium}
          onClick={() => {
            if (selectedImage) {
              setSelectedImage(null);
            }
            setqImageUrl(photo.src.medium);
          }}
          alt={`Photo ${index}`}
        />
      ))}
    </div>
  );

  const finishBox = step === questions.length - 1 && (
    <div className={`finish-box ${step === questions.length - 1 ? 'active' : ''}`}>
      {qimageUrl !== "" && (
        <img
          className='select-photo'
          key="sel-img"
          id="sel-img"
          src={qimageUrl}
          onClick={() => setqImageUrl("")}
          alt={`Photo selected`}
        />
      )}
      {selectedImage && (
        <img
          className='select-photo'
          id="sel-img"
          onClick={() => setSelectedImage(null)}
          src={URL.createObjectURL(selectedImage)}
          alt="Selected"
        />
      )}
        <button className='btn' id='shadow-btn' onClick={fetchAllDataFromFirebase}>
          Search {Sign}
        </button>
    </div>
  );

  const fullscreenContent = (
    <div className='fullscreen'>
      {loading ? (
        <Lottie options={defaultOptions} height={200} width={200} />
      ) : (
        step < questions.length && (
          <div className='question'>
            <div className='q-title' onClick={decreaseProgress}>
              {backSign} {questions[step].title}
            </div>
            {!uploadOwnPhoto && (
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
                {/* <div className="error-text">{getErrorByIndex(step)}</div> */}
              </div>
            )}
            {step < questions.length - 1 && (
              <button className='btn' onClick={onNextPress}>
                Next {Sign}
              </button>
            )}
          </div>
        )
      )}
    </div>
  );

  // console.log('Rendering filteredDataStructure:', filteredDataStructure.length);

  return (
    <div>
      {fixedHeader}
      {fullscreenContent}
      {photosApiBlock}
      {finishBox}
      {isDropdown && (
        <div className='modal-bg'>
          <h2>These items match what you've found:</h2>
          <h3 className='upper-modal' onClick={() => setIsDropdown(false)}>{backSign} {formData.q1}, {formData.q2}</h3>
          <div className='posts-container'>
            <div className="post-grid">
              {filteredDataStructure.map((post, index) => (
                <div key={index} className='postBox'>
                  <h2>{post.objectLost}</h2>
                  <p className='region-tag'>{post.region}</p>
                  <img className='photo-tag' key={post.imageLink} src={post.imageLink} alt="Lost Item" />
                  <div className='contact-tag'><p>{post.contact}</p></div>
                  <p className='date-tag'>{formatDate(post.date)}</p>
                  <div className='spacer'></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}           
      {/* {filteredDataStructure.length === 0 ? (
        <div>empty</div>
      ) : (<div>notemptys</div>)} */}
    </div>
  );
}

function formatDate(inputDate:any) {
  const dateParts = inputDate.split('-');
  if (dateParts.length === 3) {
    const year = dateParts[0];
    const month = dateParts[1];
    const day = dateParts[2];
    
    // Use template literals to format the date
    const formattedDate = `${day}.${month}.${year}`;
    
    return formattedDate;
  } else {
    return "Invalid Date";
  }
}

export default Find;
