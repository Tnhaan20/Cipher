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
      case 'create': return '+';
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