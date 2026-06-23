import { Card } from "../../common";
import { useProducts } from "../../hooks";

const Products = () => {
  const { data, isPending, isError, error } = useProducts();

  console.log({ data, isPending, isError, error });

  return (
    <div className="h-full flex flex-wrap gap-4 items-center overflow-y-scroll">
      {data?.map((item) => (
        <div key={item.id} className="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 p-2 m-5">
          <Card
            name={item?.name}
            imageUrl={item?.imageUrl}
            price={item?.price}
          />
        </div>
      ))}
    </div>
  );
};

export default Products;
