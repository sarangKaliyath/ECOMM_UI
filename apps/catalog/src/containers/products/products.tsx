import { Card, CardSkeleton } from "../../common";
import { useProducts } from "../../hooks";

const Products = () => {
  const { data, isPending, isError, error } = useProducts();

  console.log({ data, isPending, isError, error });

  return (
    <div className="h-full flex flex-wrap gap-4 items-center overflow-y-scroll">
      {isPending ? (
        <div className="h-full flex flex-wrap gap-4 items-center overflow-y-scroll">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 p-2 m-5">
              <CardSkeleton />
            </div>
          ))}
        </div>
      ) : (
        data?.map((item) => {
          console.log(item);
          return (
            <div
              key={item.id}
              className="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 p-2 m-5"
            >
              <Card
                name={item?.name}
                imageUrl={item?.imageUrl}
                price={item?.price}
                createdAt={item?.created_at}
              />
            </div>
          );
        })
      )}
    </div>
  );
};

export default Products;
