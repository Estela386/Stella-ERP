

interface Props{
  title: string
  description: string
}

export default function MessageCard({ title, description }: Props){
  return(
    <div className="
    bg-white
    border border-[#b76e79]/25
    rounded-2xl
    overflow-hidden
    max-w-[240px]
    shadow-[0_6px_24px_rgba(183,110,121,0.15),0_2px_8px_rgba(112,128,144,0.1)]
    ">
      {/* Header gris/slate ligero */}
      <div className="
      px-4 py-2.5
      bg-gradient-to-r from-[#708090]/15 via-[#708090]/5 to-[#f6f4ef]
      border-b border-[#708090]/15
      flex items-center gap-2
      ">
        <svg 
          viewBox="0 0 24 24" 
          fill="currentColor" 
          className="w-3.5 h-3.5 text-[#5a6a79]"
          aria-hidden="true"
        >
          <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8c1.86 0 3.55.63 4.93 1.69-4.22.42-7.55 3.99-7.55 8.31 0 4.32 3.33 7.89 7.55 8.31C15.55 19.37 13.86 20 12 20z" />
        </svg>
        <span className="text-[11px] font-bold text-[#5a6a79] tracking-widest uppercase">
          Detalle del pedido
        </span>
      </div>

      {/* Contenido */}
      <div className="px-4 py-3">
        <h4 className="font-semibold text-[14px] text-[#3a3540] mb-1">
          {title}
        </h4>
        <p className="text-xs text-[#5a6a79] leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  )
}