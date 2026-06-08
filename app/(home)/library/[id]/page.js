import Image from 'next/image'
import EmailInput from '@/components/EmailInput'
import getBSHFloors from '@/lib/getFloors';
import FloorTile from '@/components/FloorTile';
import getFloors from '@/lib/getFloors';
import Link from 'next/link';
import ViewAllSeatsButton from './ViewAllSeatsButton';
import RoomList from './RoomList';

export  default async function Home({params}) {
  const floors = await getFloors(params.id);
  return (
    <main className="py-8 px-4">
      <div className="flex justify-center mb-8">
        <div className="flex flex-col items-center gap-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Select a Room</h1>
            <p className="text-lg text-gray-600">Book your seat in one go!</p>
          </div>
          <ViewAllSeatsButton libraryId={params.id} />
        </div>
      </div>
      <RoomList floors={floors} libraryId={params.id} />
    </main>
  )
}