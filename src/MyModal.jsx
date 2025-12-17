import ReactModal from "react-modal";

ReactModal.setAppElement("#root");

export default function MyModal({ isOpen, text, onClose, onUpdate }) {
  
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      portalClassName="modalPortal"
      className="modalBox"
      overlayClassName="modalOverlay"
      contentLabel="Edit Item"
    >
      <div className="modalContent">
        <div className="modalRow">
          <label>Text:&nbsp;</label>
          <input defaultValue={text} onChange={(e) => (e.target.dataset.val = e.target.value)} />
        </div>

        <div className="modalButtons">
          <button onClick={onClose}>Close Me</button>
          <button
            onClick={(e) => {
              
              const input = e.currentTarget.closest(".modalContent").querySelector("input");
              const latest = input?.dataset?.val ?? input?.defaultValue ?? "";
              onUpdate(latest);
            }}
          >
            Update
          </button>
        </div>
      </div>
    </ReactModal>
  );
}
