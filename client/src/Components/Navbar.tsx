'use client';

import { useSearch } from '@/Context/SearchContext';
import Link from 'next/link';

const Navbar = () => {
  const { searchQuery, setSearchQuery } = useSearch();

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      
    }
  };

  return (
    <div className="bg-[#f9f9f9] shadow-[0_2px_16px_0_#0000001A]">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <img 
              src="/logo.png" 
              alt="logo" 
              draggable={false} 
              className="w-[100px] h-[55px] cursor-pointer" 
            />
          </Link>
          <div className="flex flex-col sm:flex-row gap-[16px] w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search experiences"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="bg-[#EDEDED] text-[#727272] w-full sm:w-[280px] md:w-[340px] h-[42px] px-[16px] py-[12px] rounded focus:outline-none focus:ring-2 focus:ring-[#FFD643] transition-all"
            />
            <button className="w-full sm:w-[87px] h-[42px] bg-[#FFD643] text-[#161616] px-[20px] text-center rounded-[8px] flex items-center justify-center hover:bg-[#ffc107] active:scale-95 transition-all duration-200 font-medium hover:cursor-pointer">
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;