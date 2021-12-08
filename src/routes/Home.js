import React, { useState, useEffect } from "react";
import { dbService } from "fbase";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  getDocs,
} from "firebase/firestore";

const Home = () => {
  const [nweet, setNweet] = useState("");
  const [nweets, setNweets] = useState([]);

  const getNweets = async () => {
    const q = query(collection(dbService, "nweets"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(doc => {
      const nweetObj = {
        ...doc.data(),
        id: doc.id,
      };
      setNweets(prev => [nweetObj, ...prev]);
    });
  };

  useEffect(() => {
    getNweets();
  }, []);

  const onSubmit = async e => {
    e.preventDefault();
    console.log(`서브밋 하는 느윗:${nweet}`);
    await addDoc(collection(dbService, "nweets"), {
      nweet,
      createdAt: serverTimestamp(),
    });
    setNweet("");
  };

  const onChange = e => {
    const {
      target: { value },
    } = e;
    setNweet(value);
  };

  console.log(nweets);
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          value={nweet}
          onChange={onChange}
          type="text"
          placeholder="Whats' on your mind?"
          maxLength={120}
        />
        <input type="submit" value="Nweet" />
      </form>
      <div>
        {nweets &&
          nweets.map(nweet => (
            <div>
              <h4>{nweet.nweet}</h4>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Home;
