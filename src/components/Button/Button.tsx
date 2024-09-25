import React, { useState } from "react";
import Modal from "../Modal/Modal";

type buttonType = 'create' | 'delete' | 'edit' | 'view'

interface ButtonProps {
  name: string;
  type: buttonType;
  modalTitle: string;
  modalContent: React.ReactNode;
  onClick?: () => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function FuncButton({ 
  name, 
  type, 
  modalTitle, 
  modalContent, 
  onClick, 
  isOpen, 
  setIsOpen 
}: ButtonProps) {
  
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      openModal();
    }
  };

  const getButtonClass = () => {
    switch(type) {
      case 'create': return 'bg-green-500 hover:bg-green-600';
      case 'delete': return 'bg-red-500 hover:bg-red-600';
      case 'edit': return 'bg-blue-500 hover:bg-blue-600';
      case 'view': return 'bg-gray-500 hover:bg-gray-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const getIcon = () => {
    switch(type) {
      case 'create': 
      return (
        <>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 1024 1024"><path fill="currentColor" d="M696 480H544V328c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v152H328c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h152v152c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V544h152c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8"/><path fill="currentColor" d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448s448-200.6 448-448S759.4 64 512 64m0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372s372 166.6 372 372s-166.6 372-372 372"/></svg>
        </>
      );
      case 'delete': return '×';
      case 'edit': return '✎';
      case 'view': return '👁';
      default: return '';
    }
  };

  return (
    <div className="w-full flex justify-center">
      <button 
        onClick={handleClick} 
        className={`button-search flex items-center text-white px-4 py-2 rounded ${getButtonClass()}`}
      >
        <span className="mr-2">{getIcon()}</span>
        {name}
      </button>
      <Modal 
        isOpen={isOpen} 
        isClose={closeModal}
        title={modalTitle}
      >
        {modalContent}
      </Modal>
    </div>
  );
}