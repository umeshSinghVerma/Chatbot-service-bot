'use client'
import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

type Message = {
  sender: 'user' | 'bot';
  text?: string;
};

const LoadingDots = () => (
  <div className="flex space-x-1">
    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
  </div>
);

export default function ChatbotUI({ id, data }: { id: string, data: { name: string } }) {
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'bot', text: 'Hello! How can I assist you today? 😊' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async () => {
    if (inputValue.trim() === '') return;

    const userMessage: Message = { sender: 'user', text: inputValue };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setLoading(true);

    try {
      const HistoryObject = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));
      console.log(HistoryObject);
      const response = await fetch(`${process.env.NEXT_PUBLIC_ORIGIN_URL}/api/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id,
          prompt: inputValue,
          messages: HistoryObject
        })
      });

      const data = await response.json();

      if (response.ok && data.response) {
        const botResponse: Message = { sender: 'bot', text: data.response };
        setMessages((prev) => [...prev, botResponse]);
      } else {
        const errorMessage = data.error || 'Error fetching chatbot response';
        setMessages((prev) => [...prev, { sender: 'bot', text: errorMessage }]);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [...prev, { sender: 'bot', text: 'Failed to get response. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="flex flex-col absolute inset-0 bg-gray-100">
      {/* Chat Header */}
      <div className="bg-blue-600 text-white p-4 font-semibold text-lg flex justify-center items-center shadow-md">
        {data.name}
      </div>

      {/* Chat Messages */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`p-3 max-w-xs md:max-w-sm rounded-2xl text-sm shadow ${msg.sender === 'user'
                ? 'bg-blue-500 text-white rounded-br-none'
                : 'bg-gray-200 text-gray-800 rounded-bl-none'
                }`}
            >
              {msg.sender === 'bot' ? (
                <ReactMarkdown rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]}>{msg.text || ''}</ReactMarkdown>
              ) : (
                msg.text
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="p-3 bg-gray-200 rounded-2xl text-sm shadow">
              <LoadingDots />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className="p-4 border-t border-gray-300 flex items-center bg-white shadow-md">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Button onClick={handleSend} className="ml-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
