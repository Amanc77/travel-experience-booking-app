'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, Minus, Plus } from "lucide-react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';


interface Slot {
    id: string;
    date: string;
    time: string;
    available: boolean;
}

interface ExperienceDetail {
    id: string;
    title: string;
    image: string;
    description: string;
    price: number;
    location: string;
    about: string;
    slots: Slot[];
}

interface BookingData {
    experience: string;
    experienceId: string;
    slotId: string;
    quantity: number;
    subtotal: number;
    taxes: number;
    totalPrice: number;
    selectedDate: string;
    selectedTime: string;
}

export default function ExperienceDetailPage() {
    const router = useRouter();

    const params = useParams();
    const id = params.id as string;

    const [experience, setExperience] = useState<ExperienceDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
    const [bookingData, setBookingData] = useState<BookingData | null>(null);

    useEffect(() => {
        if (id) {
            fetchExperienceDetail();
        }
    }, [id]);

    useEffect(() => {
        if (experience && selectedSlot) {
            const subtotal = experience.price * quantity;
            const taxes = 59;
            const totalPrice = subtotal + taxes;

            setBookingData({
                experience: experience.title,
                experienceId: experience.id,
                slotId: selectedSlot.id,
                quantity: quantity,
                subtotal: subtotal,
                taxes: taxes,
                totalPrice: totalPrice,
                selectedDate: selectedSlot.date,
                selectedTime: selectedSlot.time,
            });
        }
    }, [experience, selectedSlot, quantity]);

    const fetchExperienceDetail = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`https://bookitbackend.vercel.app/api/v1/public/experiences/${id}`);
            const result = await response.json();

            if (result.success && result.data) {
                setExperience(result.data);

                if (result.data.slots && result.data.slots.length > 0) {
                    setSelectedDate(result.data.slots[0].date);
                }
            } else {
                setError('Experience not found');
            }
        } catch (err) {
            console.error('Error fetching experience detail:', err);
            setError('Failed to load experience details');
        } finally {
            setLoading(false);
        }
    };

    const handleQuantityChange = (change: number) => {
        const newQuantity = quantity + change;
        if (newQuantity >= 1) {
            setQuantity(newQuantity);
        }
    };

    const handleSlotSelection = (slot: Slot) => {
        if (slot.available) {
            setSelectedSlot(slot);
        }
    };

    const handleConfirm = () => {
        if (bookingData) {
            console.log('Booking Data:', JSON.stringify(bookingData));
            if (typeof window !== "undefined") {
                localStorage.setItem("bookingData", JSON.stringify(bookingData));
                router.push(`/experience/${id}/checkout`);
            }
        }
    };

    const getUniqueDates = () => {
        if (!experience?.slots) return [];

        const uniqueDatesMap = new Map<string, Slot>();
        experience.slots.forEach(slot => {
            if (!uniqueDatesMap.has(slot.date)) {
                uniqueDatesMap.set(slot.date, slot);
            }
        });

        return Array.from(uniqueDatesMap.values());
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <div className="flex justify-center items-center min-h-[400px]">
                    <div className="text-[#161616] text-lg">Loading experience details...</div>
                </div>
            </div>
        );
    }

    if (error || !experience) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <div className="flex flex-col justify-center items-center min-h-[400px] gap-4">
                    <div className="text-[#6C6C6C] text-lg">{error || 'Experience not found'}</div>
                    <a href="/" className="text-[#FFD643] hover:underline">Go back to home</a>
                </div>
            </div>
        );
    }

    const uniqueDates = getUniqueDates();
    const subtotal = experience.price * quantity;
    const taxes = 59;
    const total = subtotal + taxes;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <div className="space-y-4 sm:space-y-6 mb-4">

                <div className='flex w-[74px] h-[20px] text-[#000000] justify-between items-center hover:cursor-pointer py-6'>
                    <Link href={"/"} className='flex justify-between items-center w-[74px] h-[20px]'>
                        <ArrowLeft size={20} />
                        <span className='block text-[14px] leading-[18px]'>Details</span>
                    </Link>
                </div>


                <div className='flex flex-col lg:flex-row gap-4 lg:gap-8'>

                    <div className='w-full lg:w-[765px] h-[250px] sm:h-[300px] lg:h-[381px] rounded-[12px] overflow-hidden'>
                        <img src={experience.image} alt={experience.title} className='w-full h-full object-cover' draggable={false} />
                    </div>


                    <div className='w-full lg:w-[387px] px-[24px] py-[24px] rounded-[12px] bg-[#EFEFEF] flex flex-col gap-4'>
                        <div className='w-full flex justify-between items-center'>
                            <span className='block text-[16px] leading-[20px] text-[#656565]'>Starts at</span>
                            <span className='text-[18px] leading-[22px] text-[#161616] text-right'>₹{experience.price}</span>
                        </div>

                        <div className='w-full flex justify-between items-center'>
                            <span className='block text-[16px] leading-[20px] text-[#656565]'>Quantity</span>
                            <div className='text-[18px] leading-[22px] text-[#161616] flex items-center gap-2'>
                                <Minus
                                    size={16}
                                    className='hover:cursor-pointer hover:text-[#FFD643] transition-colors'
                                    onClick={() => handleQuantityChange(-1)}
                                />
                                <span className='block min-w-[20px] text-center text-[12px] leading-[14px]'>{quantity}</span>
                                <Plus
                                    size={16}
                                    className='hover:cursor-pointer hover:text-[#FFD643] transition-colors'
                                    onClick={() => handleQuantityChange(1)}
                                />
                            </div>
                        </div>

                        <div className='w-full flex justify-between items-center'>
                            <span className='block text-[16px] leading-[20px] text-[#656565]'>Subtotal</span>
                            <span className='text-[18px] leading-[22px] text-[#161616] text-right'>₹{subtotal}</span>
                        </div>

                        <div className='w-full flex justify-between items-center'>
                            <span className='block text-[16px] leading-[20px] text-[#656565]'>Taxes</span>
                            <span className='text-[18px] leading-[22px] text-[#161616] text-right'>₹{taxes}</span>
                        </div>

                        <div className='w-full h-[1px] bg-[#D9D9D9]' />

                        <div className='w-full flex justify-between items-center'>
                            <span className='block text-[20px] leading-[24px] font-bold text-[#161616]'>Total</span>
                            <span className='text-[20px] leading-[24px] text-[#161616] font-bold text-right'>₹{total}</span>
                        </div>

                        <button
                            onClick={handleConfirm}
                            disabled={!selectedSlot}
                            className="w-full h-[44px] rounded-[8px] bg-[#FFD643] hover:bg-[#ffc107] transition-colors flex items-center justify-center hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className="font-normal text-[#161616] text-center">Confirm</span>
                        </button>
                    </div>
                </div>


                <div className='w-full flex flex-col gap-6 lg:gap-[32px]'>
                    <span className='block w-full font-normal text-[20px] sm:text-[24px] leading-[28px] sm:leading-[32px] text-[#161616] text-left'>
                        {experience.title}
                    </span>

                    <span className='font-light text-[14px] sm:text-[16px] leading-[20px] sm:leading-[24px] text-[#6C6C6C] text-left'>{experience.description}</span>


                    <div className='flex flex-col gap-2'>
                        <span className='block font-normal text-[16px] sm:text-[18px] leading-[20px] sm:leading-[22px] text-[#161616]'>Choose Date</span>
                        <div className="flex gap-2 flex-wrap">
                            {uniqueDates.map((slot) => (
                                <button
                                    key={slot.id}
                                    onClick={() => setSelectedDate(slot.date)}
                                    className={`${selectedDate === slot.date
                                        ? "bg-[#FFD643] text-[#161616]"
                                        : "border border-[#BDBDBD] text-[#838383]"
                                        } px-3 sm:px-4 py-2 rounded-[4px] text-[12px] sm:text-[14px] text-center transition-all hover:border-[#FFD643]`}
                                >
                                    {formatDate(slot.date)}
                                </button>
                            ))}
                        </div>
                    </div>


                    {selectedDate && (
                        <div className="flex flex-col gap-2">
                            <span className="block font-normal text-[16px] sm:text-[18px] leading-[20px] sm:leading-[22px] text-[#161616]">
                                Choose Time
                            </span>
                            <div className="flex gap-2 flex-wrap">
                                {experience.slots
                                    .filter((slot) => slot.date === selectedDate)
                                    .map((slot) => (
                                        <button
                                            key={slot.id}
                                            onClick={() => handleSlotSelection(slot)}
                                            disabled={!slot.available}
                                            className={`${selectedSlot?.id === slot.id
                                                    ? 'bg-[#FFD643] border-[#FFD643] text-[#161616]'
                                                    : slot.available
                                                        ? 'border border-[#BDBDBD] text-[#161616] hover:border-[#FFD643] hover:cursor-pointer'
                                                        : 'border border-[#E0E0E0] text-[#838383] bg-[#CCCCCC] cursor-not-allowed'
                                                } min-w-[90px] sm:min-w-[100px] h-[34px] px-[10px] sm:px-[12px] py-[6px] rounded-[4px] text-[12px] sm:text-[14px] text-center transition-all flex items-center justify-center gap-1`}
                                        >
                                            <span>{slot.time}</span>
                                            {!slot.available && (
                                                <span className="text-[10px] sm:text-[12px] text-[#6A6A6A]">(Sold Out)</span>
                                            )}
                                        </button>
                                    ))}
                            </div>
                        </div>
                    )}

                    <span className='text-[#838383] text-[11px] sm:text-[12px] leading-[14px] sm:leading-[16px]'>All times are in IST (GMT +5:30)</span>


                    <div className='flex flex-col gap-4'>
                        <span className='block w-full font-normal text-[20px] sm:text-[24px] leading-[28px] sm:leading-[32px] text-[#161616] text-left'>
                            About
                        </span>

                        <div className='w-full px-[12px] py-[8px] rounded-[4px] bg-[#EEEEEE] mb-4'>
                            <span className='block text-[11px] sm:text-[12px] text-[#838383]'>{experience.about}</span>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    );
}