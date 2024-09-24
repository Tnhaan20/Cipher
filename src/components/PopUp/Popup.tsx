
interface PopupMessage{
    content: string,
    isShow: boolean,
}

export default function Popup({content, isShow }: PopupMessage) {

  if(!isShow) return

  console.log('asdsadsadsadsad11111');
  
  return (
    <div className="w-full flex justify-center">
      <p>{content}</p>
      
    </div>
  )
}
