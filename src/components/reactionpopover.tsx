import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const emojis = ['😀', '😍', '👍', '🎉', '❤️', '😂'];

interface ReactionPopoverProps {
  id: any;
  isCurrentUser: boolean;
  onReact: (id: string, emoji: string) => void;
}

const ReactionPopover: React.FC<ReactionPopoverProps> = ({ id, isCurrentUser, onReact }) => {
  const handleEmojiSelect = (emoji: string) => {
    onReact(id, emoji);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className={`bg-white shadow-lg rounded-lg p-2 flex ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'} space-x-2`}
    >
      {emojis.map(( emoji, index ) => (
        <motion.button
          key={index}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          className="w-8 h-8 text-[25px] flex items-center justify-center"
          onClick={() => handleEmojiSelect(emoji)}
        >
          {emoji}
        </motion.button>
      ))}
    </motion.div>
  );
};

export default ReactionPopover;