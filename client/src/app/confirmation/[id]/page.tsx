"use client"

import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';

// Skeleton Loading
const ConfirmationSkeleton = () => (
  <div className='max-w-7xl h-[400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center gap-4 overflow-hidden'>
    <div className='flex flex-col h-full w-full justify-center items-center gap-4 animate-pulse'>
      <div className='w-[80px] h-[80px] bg-[#E0E0E0] rounded-full' />
      <div className='w-[294px] h-[40px] bg-[#E0E0E0] rounded-[8px]' />
      <div className='w-[200px] h-[24px] bg-[#E0E0E0] rounded-[4px]' />
      <div className='w-[135px] h-[32px] bg-[#E0E0E0] rounded-[4px]' />
    </div>
  </div>
);

const Page = () => {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      
      const timer = setTimeout(() => {
        setLoading(false);
      }, 800);

      return () => clearTimeout(timer);
    }, []);

    if (loading) {
      return <ConfirmationSkeleton />;
    }

    return (
      <div className='max-w-7xl h-[400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center gap-4 overflow-hidden'>
        <div className='flex flex-col h-full w-full justify-center items-center gap-4'>
          <img src="/success.svg" alt="success" className='w-[80px] h-[80px]'/>

          <span className='block w-[294px] h-[40px] text-[32px] leading-[40px] text-[#161616] text-center'>Booking Confirmed</span>

          <span className='text-[20px] leading-[24px] text-[#656565]'>Ref ID: {id}</span>

          <button className='w-[135px] h-[32px] text-[16px] leading-[20px] text-[#656565] bg-[#E3E3E3] rounded-[4px] hover:cursor-pointer hover:bg-[#D6D6D6] transition-colors' onClick={() => router.push("/")}>Back to Home</button>
        </div>
      </div>
    )
}

export default Page