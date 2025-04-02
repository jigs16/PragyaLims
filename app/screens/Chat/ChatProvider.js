import React, { createContext, useState, useContext } from 'react';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [chat, setChat] = useState(null);  // Initialize chat to null
  const [deleteMessageBatchID, setDeleteMessageBatchID] = useState('');

  const updateChat = (newChat, deleteBatchID = '') => {
    setChat(newChat);
    setDeleteMessageBatchID(deleteBatchID);
  };

  return (
    <ChatContext.Provider value={{ chat, updateChat, deleteMessageBatchID }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  return useContext(ChatContext);
};
