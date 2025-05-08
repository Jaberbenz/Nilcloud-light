import React from "react";
import ReactDOM from "react-dom";

type ModalProps = {
  onClose: () => void;
  children: React.ReactNode;
};

const Modal: React.FC<ModalProps> = ({ onClose, children }) => {
  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="relative w-full max-w-md rounded-lg bg-gray-800 p-8 text-white">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-xl text-white"
        >
          &times;
        </button>
        {children}
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
