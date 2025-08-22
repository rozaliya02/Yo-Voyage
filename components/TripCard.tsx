import { Link, useLocation } from "react-router";
import { getFirstWord } from "~/lib/utils";
import { ChipDirective, ChipsDirective, ChipListComponent } from '@syncfusion/ej2-react-buttons';
import { cn } from "~/lib/utils";

const TripCard = ({id, name, location, imageUrl, tags, estimatedPrice} : TripCardProps) => {
const path = useLocation()
console.log(id, name, location, imageUrl, tags, estimatedPrice);
  return (
    <Link to={path.pathname === '/' || path.pathname.startsWith('/travel') ? `/travel/${id}` : `/trips/${id}`} className="trip-card">
      <img src={imageUrl} alt={name} className="trip-card"/>
      <article>
        <h2>{name}</h2>
        <figure>
          <img src="/assets/icons/location-mark.svg" alt="location" className="size-4" />
          <figcaption>{location}</figcaption>
        </figure>
      </article>

      <div className="mt-5 pl-[18px] pr-[3.5] pb-5"></div>
      <ChipListComponent id='travel-chip'>
        <ChipsDirective>
          {tags.map((tag, index) => (
            <ChipDirective key={index} text={getFirstWord(tag)} cssClass={cn(index === 1 ? '!bg-pink-50 !text-pink-500' : '!bg-success-50 !text-success-700')} />
          ))}
        </ChipsDirective>
      </ChipListComponent>
      <article className="tripCard-pill">{estimatedPrice}</article>
     
      </Link>

      
  );
}

export default TripCard;