import ChatbotUI from '@/components/Chatbot';

async function getChatbotInfo(id: string) {
  console.log("id", id);
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_ORIGIN_URL}/api/getChatbotInfo?id=${id}`, {
      method: 'GET',
    });

    const data = await response.json();
    console.log("data ",data);
    return data.chatbot;
  } catch (error) {
    console.error("Error in getChatbotInfo:", error);
    return null;
  }
}



export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const chatbotData = await getChatbotInfo(id);
  return <ChatbotUI id={id} data={chatbotData} />;
}