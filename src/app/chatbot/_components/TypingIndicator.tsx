export default function TypingIndicator(){
  return(
    <div className="
    flex gap-1.5 px-4 py-3 rounded-2xl w-fit
    bg-white border border-[#708090]/12
    shadow-[0_2px_10px_rgba(112,128,144,0.12)]
    ">
      <span className="w-1.5 h-1.5 rounded-full bg-[#708090]/60 animate-bounce [animation-delay:0ms]"/>
      <span className="w-1.5 h-1.5 rounded-full bg-[#708090]/60 animate-bounce [animation-delay:150ms]"/>
      <span className="w-1.5 h-1.5 rounded-full bg-[#708090]/60 animate-bounce [animation-delay:300ms]"/>
    </div>
  )
}