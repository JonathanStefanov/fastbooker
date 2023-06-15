import getLibraries from '@/lib/getLibraries';
import LibraryTile from './LibraryTile';
export default async function Home() {
  const libraries = await getLibraries();
  return (
    <main>
      <center>
        <div>
          <p className='text-xl'>Book your seat in one go !</p>
        </div>
      </center>
        <div className='flex flex-wrap justify-center'>
          {libraries.map((floor, i) => (
            <div className='m-1' key={i}>
              {floor.booking_available && (
                <LibraryTile
                  name={floor.primary_name}
                  image={floor.poster_image}
                  id={floor.id}
                />
              )}
            </div>
          ))}
        </div>
    </main>
  );
}