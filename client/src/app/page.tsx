'use client';

import { useState, useEffect } from 'react';
import CardGrid from '@/Components/CardGrid';
import { useSearch } from '@/Context/SearchContext';

interface Experience {
  id: string;
  title: string;
  image: string;
  description: string;
  price: number;
  location: string;
  about: string;
}

//skeleon grid
const SkeletonCard = () => (
  <div className="w-[280px] h-[312px] flex flex-col rounded-[12px] overflow-hidden animate-pulse">
    <div className="bg-[#E0E0E0] h-[170px] w-[280px]" />
    <div className="bg-[#F0F0F0] h-full px-[16px] py-[12px] flex flex-col gap-[12px]">
      <div className="flex justify-between items-start gap-[8px]">
        <div className="flex-1 h-[20px] bg-[#D6D6D6] rounded-[4px]" />
        <div className="w-[60px] h-[24px] bg-[#D6D6D6] rounded-[4px]" />
      </div>
      <div className="space-y-2">
        <div className="h-[16px] bg-[#D6D6D6] rounded-[4px] w-full" />
        <div className="h-[16px] bg-[#D6D6D6] rounded-[4px] w-3/4" />
      </div>
      <div className="flex justify-between items-center mt-auto">
        <div className="h-[24px] bg-[#D6D6D6] rounded-[4px] w-[80px]" />
        <div className="w-[99px] h-[30px] bg-[#D6D6D6] rounded-[4px]" />
      </div>
    </div>
  </div>
);


const LoadingGrid = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-8">
    {[...Array(8)].map((_, index) => (
      <SkeletonCard key={index} />
    ))}
  </div>
);

export default function Page() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const { searchQuery } = useSearch();

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://bookitbackend.vercel.app/api/v1/public/experiences/');
      const result = await response.json();
      
      if (result.success && result.data) {
        setExperiences(result.data);
      }
    } catch (error) {
      console.error('Error fetching experiences:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredExperiences = searchQuery.trim()
    ? experiences.filter((exp) => {
        const query = searchQuery.toLowerCase();
        return (
          exp.title.toLowerCase().includes(query) ||
          exp.description.toLowerCase().includes(query) ||
          exp.location.toLowerCase().includes(query) ||
          exp.about.toLowerCase().includes(query)
        );
      })
    : experiences;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {loading ? <LoadingGrid /> : <CardGrid experiences={filteredExperiences} loading={loading} />}
    </div>
  );
}