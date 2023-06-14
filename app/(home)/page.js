import getLibraries from '@/lib/getLibraries';
import LibraryTile from './libraryTile';
export  default async function Home() {
  const libraries = await getLibraries();
  return (
    <main>
      <center>
      <div className='flex flex-col justify-center'>
        <div>
          <p className='text-xl'>Book your seat in one go !</p>
        </div>
        </div>
      </center>
      <div className='flex flex-wrap justify-center'>
        {libraries.map((floor, i) => (
          
          <div className='m-2'key={i} >
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
  )
}