import type { CardType } from "../../types";
import productAlt from "../../assets/images/productAlt.jpg";

const Card = ({ name, price, imageUrl }: CardType) => {
  const image =
    imageUrl?.includes("example") || !imageUrl ? productAlt : imageUrl;

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-full border border-gray-100 min-w-[200px]">
      <div className="h-64 bg-gray-100 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div className="flex flex-col flex-1 p-4">
        <h3
          className="text-gray-800 font-semibold text-lg line-clamp-2 min-h-[56px]"
          title={name}
        >
          {name}
        </h3>

        <div className="mt-2 text-2xl font-bold text-blue-600">₹{price}</div>

        <div className="mt-auto pt-4">
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors duration-200 cursor-pointer">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
