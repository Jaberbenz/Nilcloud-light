import React from "react";
import ReactDOM from "react-dom";

type LargeModalProps = {
  onClose: () => void;
  children: React.ReactNode;
};

const LargeModal: React.FC<LargeModalProps> = ({ onClose, children }) => {
  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="relative w-[90%] max-w-6xl rounded-lg bg-gray-800 p-8 text-white shadow-lg">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-2xl text-white hover:text-red-400"
        >
          &times;
        </button>
        {children}
      </div>
    </div>,
    document.body,
  );
};

export default LargeModal;
