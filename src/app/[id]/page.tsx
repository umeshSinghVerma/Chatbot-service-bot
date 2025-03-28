'use client'
import ChatbotUI from '@/components/Chatbot';
import { useParams } from 'next/navigation';

export default function Page() {
  const params = useParams();
  return <ChatbotUI id={params.id as string} />
}
