
interface PopupMessage {
    content: string;
    isShow: boolean;
}

export default function Popup({ content, isShow }: PopupMessage) {
  if (!isShow) return null;
 
  return (
    <div className="fixed bottom-4 left-4 z-50 bg shadow-md rounded-lg p-4 max-w-sm">
      <p>
        {content}
      </p>
    </div>
  );
}