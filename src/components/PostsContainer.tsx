import React, { useState, useEffect, useRef } from 'react';
// import '../../styles.css';
import '../../src/styles.css';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileUpload } from '@fortawesome/free-solid-svg-icons';
import { collection, addDoc, Firestore, doc, getFirestore, getDocs } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, uploadString,getDownloadURL, FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyBfwTK_UcnWu0HbLVjXSJgnFe-d6STRkkM",
    authDomain: "lost-and-found-373e1.firebaseapp.com",
    projectId: "lost-and-found-373e1",
    storageBucket: "lost-and-found-373e1.appspot.com",
    messagingSenderId: "699180430397",
    appId: "1:699180430397:web:ce9f1b1ef1823447f82654"
  };
  
const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage();

const PostsContainer = () => {
    const [viewContacts, setViewContacts] = useState<Array<number>>([]);
    // const [viewContacts, setViewContacts] = useState([]);
    // const viewContacts : number[] = [];
    const [posts, setPosts] = useState<Array<{
      color: string,
      contact: string,
      date: string,
      imageLink: string,
      isImageInStorage: boolean,
      objectLost: string,
      region: string,
      userId: string,
      postId: string,
    }>>([]);
  
    useEffect(() => {
      const db = getFirestore();
      const storage = getStorage(); // Initialize Firebase storage
  
      const fetchLostItems = async () => {
        const q = collection(db, 'lost-items');
        const querySnapshot = await getDocs(q);
  
        const postsData: Array<{
          color: string,
          contact: string,
          date: string,
          imageLink: string,
          isImageInStorage: boolean,
          objectLost: string,
          region: string,
          userId: string,
          postId: string,
        }> = [];
  
        // Use Promise.all to wait for all image download operations to complete
        const getImagePromises = querySnapshot.docs.map(async (doc) => {
          const data = doc.data();
          const post = {
            color: data.color,
            contact: data.contact,
            date: data.date,
            imageLink: data.isImageInStorage
              ? await getImageUrl(storage, doc.id)
              : data.imageLink,
            isImageInStorage: data.isImageInStorage,
            objectLost: data.objectLost,
            region: data.region,
            userId: data.userId,
            postId: doc.id,
          };
          postsData.push(post);
        });
  
        await Promise.all(getImagePromises); // Wait for all image downloads to complete
  
        setPosts(postsData);
      };
  
      fetchLostItems();
    }, []); // Empty dependency array ensures the effect runs only once
  
    // Move the return statement inside the component function
    return (
      <div className='posts-container'>
        <div className="post-grid">
          {posts.map((post, index) => (
            <div key={index} className='postBox'>
              <h2>{post.objectLost}</h2>
              <p className='region-tag'>{post.region}</p>
              <img className='photo-tag' key={post.imageLink} src={post.imageLink} alt="Lost Item" />
              <div className='contact-tag' id='shadow-btn' onClick={() => {
                if (viewContacts.includes(index)) {
                    const indexToRemove = viewContacts.indexOf(index);
                    if (indexToRemove !== -1) {
                    const newViewContacts = [...viewContacts];
                    newViewContacts.splice(indexToRemove, 1);
                    setViewContacts(newViewContacts); // Update the state
                    }
                } else {
                    const newViewContacts = [...viewContacts, index];
                    setViewContacts(newViewContacts); // Update the state
                }
                }}>
                <p>{viewContacts.includes(index) ? post.contact : "I found it"}</p>
                </div>
              <p className='date-tag'>{formatDate(post.date)}</p>
              {/* <p>Color: {post.color}</p> */}
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default PostsContainer;
  
  async function getImageUrl(storage:any, postId:any) {
    const imageRef = ref(storage, `lost-items/${postId}`);
    try {
      const imageUrl = await getDownloadURL(imageRef);
      return imageUrl;
    } catch (error) {
      console.error('Error getting image URL:', error);
      return null;
    }
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