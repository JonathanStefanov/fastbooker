import getFloors from '@/lib/getFloors';
import ViewAllSeatsButton from './ViewAllSeatsButton';
import RoomList from './RoomList';
import AvailabilityHeatmap from '@/components/AvailabilityHeatmap';
import { getTranslations } from 'next-intl/server';

export default async function Home({ params }: { params: { id: string; locale: string } }) {
  const floors = await getFloors(params.id);
  const t = await getTranslations('library');

  return (
    <main className="py-8 px-4">
      <div className="flex justify-center mb-8">
        <div className="flex flex-col items-center gap-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{t('selectRoom')}</h1>
            <p className="text-lg text-gray-600">{t('subtitle')}</p>
          </div>
          <ViewAllSeatsButton libraryId={params.id} />
        </div>
      </div>
      <div className="mb-8">
        <AvailabilityHeatmap libraryId={params.id} />
      </div>
      <RoomList floors={floors} libraryId={params.id} />
    </main>
  );
}
