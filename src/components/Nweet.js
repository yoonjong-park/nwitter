import React, { useState } from "react";
import { dbService } from "fbase";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";

const Nweet = ({ nweetObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newNweet, setNewNweet] = useState(nweetObj.nweet);
  const NweetTextRef = doc(dbService, "nweets", `${nweetObj.id}`);

  const onDelete = async () => {
    const ok = window.confirm("작성하신 로그를 삭제하시겠습니까?");
    console.log("ok", ok);

    if (ok) {
      await deleteDoc(NweetTextRef);
    }
  };

  const toggleEditing = () => setEditing(prev => !prev);

  const onSubmit = async e => {
    e.preventDefault();
    console.log("dd", nweetObj, newNweet);
    await updateDoc(NweetTextRef, {
      nweet: newNweet,
    });
    setEditing(false);
  };

  const onChange = e => {
    const {
      target: { value },
    } = e;
    setNewNweet(value);
  };

  return (
    <div key={nweetObj.id}>
      {editing ? (
        <>
          <form onSubmit={onSubmit}>
            <input type="text" value={newNweet} required onChange={onChange} />
            <input type="submit" value="Update Nweet" />
          </form>
          <button onClick={toggleEditing}>Cancle</button>
        </>
      ) : (
        <>
          <h4>{nweetObj.nweet}</h4>
          {isOwner && (
            <>
              <button onClick={onDelete}>Delete Nweet</button>
              <button onClick={toggleEditing}>Edit Nweet</button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Nweet;
