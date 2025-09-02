import { cn } from "~/lib/utils";
import { Link, useLocation } from "react-router";
import { Button } from "@syncfusion/ej2-react-buttons";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";

interface Props {
    title: string;
    description: string; 
    ctaText?: string;
    ctaUrl?: string   
}

const Header: React.FC<Props> = ({title, description, ctaText, ctaUrl}) => {
    const location = useLocation();

  return (
    <header className="header">
        <article>
            <h1 className={cn('text-dark-100', location.pathname === '/' ? 'text-2xl md:text-4xl' : 'text-xl md:text-2xl font-semibold')}>{title}</h1>
            <p className={cn('text-gray-100 font-normal', location.pathname === '/' ? 'text-base md:text-lg' : 'text-sm md:text-lg')}>{description}</p>
        </article>
        {ctaText && ctaUrl && (
          <Link to={ctaUrl}> 
          <div className="justify-center">
          <ButtonComponent type="button" className="!flex !items-center !justify-center 
        !bg-blue-600 hover:!bg-blue-700 
        !text-white 
        !h-11 !w-full md:!w-[240px] 
        gap-2 rounded-xl shadow-md 
        transition-all active:scale-[0.98]">
            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-white/20">
              <img src="/assets/icons/plus.svg" alt="plus" className="w-4 h-4" />
            </div>
            <span className="font-semibold leading-none inline-flex items-center text-white">{ctaText}</span>
            
            </ButtonComponent>
            </div>
             </Link>
        )}
    </header>
  );
}

export default Header;