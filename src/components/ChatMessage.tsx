import React from 'react';
import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
  isBot: boolean;
  message: string;
}

export function ChatMessage({ isBot, message }: ChatMessageProps) {
  return (
    <div className={`flex gap-3 ${isBot ? 'bg-gray-50' : ''} p-4`}>
      <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200">
        {isBot ? <Bot size={20} /> : <User size={20} />}
      </div>
      <div className="flex-1">
        <p className="text-sm text-gray-800">{message}</p>
      </div>
    </div>
  );
}