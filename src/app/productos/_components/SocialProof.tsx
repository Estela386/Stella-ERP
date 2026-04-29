import { Star, Users, Quote } from "lucide-react";

export default function SocialProof({ reviews, participantesCount = 120 }: { reviews: any[], participantesCount?: number }) {
  const displayReviews = reviews && reviews.length > 0 ? reviews.map(r => ({
    text: r.comment || r.comentario || "Excelente calidad",
    author: r.user_name || r.usuario?.nombre || "Cliente Stella",
    role: "Cliente Verificado",
  })).slice(0, 2) : [
    {
      text: "Excelente calidad",
      author: "Mariana R.",
      role: "Participante",
    },
    {
      text: "Me encantaron los diseños",
      author: "Sofía T.",
      role: "Clienta",
    },
  ];

  return (
    <section className="py-6 px-6">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        
        {/* Contador de confianza */}
        <div className="md:col-span-1 bg-[#b76e79]/5 p-8 rounded-[2.5rem] border border-[#b76e79]/10 shadow-xl shadow-black/5 flex flex-col items-center text-center relative overflow-hidden group text-[#1a1a2e]">
          <div className="w-16 h-16 bg-[#b76e79]/10 text-[#b76e79] rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
             <Star size={32} fill="currentColor" />
          </div>
          <h3 className="text-3xl text-[#2d3748]" style={{ fontFamily: "var(--font-marcellus), serif" }}>
            +<span className="font-bold text-[#b76e79]">{participantesCount}</span>
          </h3>
          <p className="text-xs font-black uppercase tracking-widest text-gray-500 mt-2">
            Personas ya participan
          </p>
          <div className="absolute -bottom-4 -right-4 text-[#b76e79] opacity-5">
            <Users size={120} />
          </div>
        </div>

        {/* Reseñas */}
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {displayReviews.map((rev, idx) => (
            <div key={idx} className="bg-[#fafafa] p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative">
              <Quote className="absolute top-6 right-6 text-[#b76e79] opacity-20" size={40} />
              <div className="flex gap-1 text-[#b76e79] mb-4">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={14} fill="currentColor" />
                ))}
              </div>
              <p className="text-[#708090] italic text-lg leading-relaxed mb-6" style={{ fontFamily: "var(--font-lora), serif" }}>
                "{rev.text}"
              </p>
              <div>
                <p className="text-sm font-bold text-[#2d3748]" style={{ fontFamily: "var(--font-marcellus), serif" }}>{rev.author}</p>
                <p className="text-[10px] uppercase font-black tracking-widest text-[#708090]" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>
                  {rev.role}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
