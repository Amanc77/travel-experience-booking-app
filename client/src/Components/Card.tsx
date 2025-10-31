import Link from 'next/link';
import { useState } from 'react';

interface CardProps {
  id: string;
  title: string;
  desc: string;
  location: string;
  imageURL: string;
  price: number;
}

const Card = ({ id, title, desc, location, imageURL, price }: CardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="w-[280px] h-[312px] flex flex-col rounded-[12px] overflow-hidden lazy-loading">
      <div className="relative bg-[#E0E0E0]">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-[#D6D6D6] border-t-[#161616] rounded-full animate-spin"></div>
          </div>
        )}
        <img 
          src={imageURL} 
          alt={title} 
          className={`object-cover h-[170px] w-[280px] transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          draggable={false}
          onLoad={() => setImageLoaded(true)}
        />
      </div>

      <div className="bg-[#F0F0F0] h-full overflow-hidden px-[16px] gap-[20px] py-[12px]">
        <div className="flex flex-col gap-[12px]">
          <div className="flex justify-between items-start gap-[8px]">
            <span className="flex-1 text-[16px] leading-[20px] text-[#161616] line-clamp-1">{title}</span>
            <span className="flex-shrink-0 inline-flex items-center justify-center bg-[#D6D6D6] px-[8px] py-[4px] rounded-[4px] text-[11px] leading-[16px] text-[#161616] whitespace-nowrap">
              {location}
            </span>
          </div>

          <div className="h-[32px]">
            <span className="block text-[12px] leading-[16px] text-[#6C6C6C] line-clamp-2">{desc}</span>
          </div>

          <div className="flex w-full justify-between items-center">
            <div className="flex gap-[6px] text-[#161616] items-center">
              <span className="leading-[16px] text-[12px]">From</span>
              <span className="text-[20px] leading-[24px]">₹{price}</span>
            </div>
            <Link href={`/experience/${id}`}>
              <button className="w-[99px] h-[30px] px-[8px] py-[6px] rounded-[4px] bg-[#FFD643] hover:bg-[#ffc107] transition-colors">
                <span className="block text-[#161616] text-[12px] leading-[18px] hover:cursor-pointer">View Details</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;