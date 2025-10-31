import Card from './Card';

interface Experience {
  id: string;
  title: string;
  image: string;
  description: string;
  price: number;
  location: string;
  about: string;
}

const CardGrid = ({ experiences, loading }: { experiences: Experience[]; loading: boolean }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-[#161616] text-lg">Loading experiences...</div>
      </div>
    );
  }

  if (experiences.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-[#6C6C6C] text-lg">No experiences found</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[24px] justify-items-center py-8">
      {experiences.map((exp) => (
        <Card
          id={exp.id}
          key={exp.id}
          title={exp.title}
          desc={exp.description}
          location={exp.location}
          imageURL={exp.image}
          price={exp.price}
        />
      ))}
    </div>
  );
};

export default CardGrid;