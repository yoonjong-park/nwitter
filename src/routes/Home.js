import React, { useState, useEffect } from "react";
import { dbService } from "fbase";
import {
  addDoc,
  collection,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import Nweet from "components/Nweet";

const Home = ({ userObj }) => {
  console.log("userObj", userObj);
  const [nweet, setNweet] = useState("");
  const [nweets, setNweets] = useState([]);

  const getNweets = async () => {
    onSnapshot(
      query(collection(dbService, "nweets"), orderBy("createdAt", "desc")),
      snapshot => {
        const nweetArray = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNweets(nweetArray);
      }
    );
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
      creatorId: userObj.uid,
    });
    setNweet("");
  };

  const onChange = e => {
    const {
      target: { value },
    } = e;
    setNweet(value);
  };

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
            <Nweet
              key={nweet.id}
              nweetObj={nweet}
              isOwner={nweet.creatorId === userObj.uid}
            />
          ))}
      </div>
    </div>
  );
};

export default Home;
