import React, { useEffect, useState } from "react";
import MyModal from "./MyModal";

const API = "https://9ic4qmke47.execute-api.us-east-2.amazonaws.com/prod";

export default function ToDo({ userid, username }) {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const [text, setText] = useState("");

  // modal state (ONLY in parent)
  const [showModal, setShowModal] = useState(false);
  const [modalId, setModalId] = useState("");
  const [modalText, setModalText] = useState("");

  // ---------- READ ----------
  async function fetchTheData() {
    try {
      setIsLoading(true);
      setError(false);

      const res = await fetch(`${API}/reading?userid=${encodeURIComponent(userid)}`);
      if (!res.ok) throw new Error("Read failed");

      const data = await res.json();
      setItems(data);
    } catch (e) {
      console.error("Read error:", e);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchTheData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userid]);

  // ---------- ADD ----------
  async function addItem() {
    const trimmed = text.trim();
    if (!trimmed) return;

    setText("");

    try {
      await fetch(
        `${API}/writing?userid=${encodeURIComponent(userid)}&text=${encodeURIComponent(trimmed)}`
      );
      await fetchTheData();
    } catch (e) {
      console.error("Write error:", e);
      setError(true);
    }
  }

  // ---------- DELETE ----------
  async function deleteItem(id) {
    try {
      await fetch(
        `${API}/delete?user=${encodeURIComponent(userid)}&id=${encodeURIComponent(id)}`
      );
      await fetchTheData();
    } catch (e) {
      console.error("Delete error:", e);
      setError(true);
    }
  }

  // ---------- MODAL OPEN / CLOSE ----------
  function openModal(item) {
    setModalId(item.id);
    setModalText(item.text);
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setModalId("");
    setModalText("");
  }

  // ---------- UPDATE ----------
  async function updateItem(newTextFromModal) {
    try {
      const url = `${API}/update?user=${encodeURIComponent(userid)}&id=${encodeURIComponent(
        modalId
      )}&text=${encodeURIComponent(newTextFromModal)}`;

      const res = await fetch(url);
      if (!res.ok) {
        const body = await res.text();
        console.error("Update failed:", res.status, body);
        setError(true);
        return;
      }

      await fetchTheData();
      closeModal();
    } catch (e) {
      console.error("Update error:", e);
      setError(true);
    }
  }

  // ---------- RENDER ----------
  if (isLoading) return <div>Loading data from database ...</div>;
  if (error) return <div>Erroneous state ...</div>;

  return (
    <div>
      <h2>hello {username}</h2>

      <p><b>Todo userid:</b> {userid}</p>
      <p><b>Todo username:</b> {username}</p>

      <div className="row">
        <input value={text} onChange={(e) => setText(e.target.value)} />
        <button onClick={addItem}>Add Item</button>
      </div>

      <div className="list">
        {items.map((item) => (
          <div className="itemRow" key={item.id}>
            <button className="textBtn" onClick={() => openModal(item)}>
              {item.text}
            </button>

            <button className="removeBtn" onClick={() => deleteItem(item.id)}>
              Remove
            </button>
          </div>
        ))}
      </div>

      <MyModal
        isOpen={showModal}
        text={modalText}
        onClose={closeModal}
        onUpdate={updateItem}
      />
    </div>
  );
}

  