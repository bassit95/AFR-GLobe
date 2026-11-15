import { useNavigate } from "react-router-dom";
import { MoveRight } from "lucide-react"; // 🎯 Import de l'icône

function MainBtn({ text, onClick, type = "button", className = "", path, children,variant: _variant }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (path) {
      void navigate(path);
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      // 🎯 Ajout de "gap-3" pour espacer le texte et la flèche
      className={`inline-flex items-center justify-center gap-3 bg-white text-black hover:bg-[#B85C38] hover:text-white transition-all duration-300 px-8 py-4 text-xs tracking-[0.2em] font-semibold uppercase group ${className}`}
    >
      <span>{text}</span>
      
      {/* 🎯 Si un enfant est passé, on l'affiche. Sinon, on met la flèche par défaut */}
      {children ? (
        children
      ) : (
        <MoveRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
      )}
    </button>
  );
}

export default MainBtn;