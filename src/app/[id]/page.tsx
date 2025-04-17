import ChatbotUI from '@/components/Chatbot';

async function getChatbotInfo(id:string){
  const response = await fetch(`${process.env.NEXT_PUBLIC_ORIGIN_URL}/api/getChatbotInfo?id=${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },  
  });
  const data = await response.json();
  return data.chatbot;
}


export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const chatbotData = await getChatbotInfo(id);
  return <ChatbotUI id={id} data={chatbotData} />;
}