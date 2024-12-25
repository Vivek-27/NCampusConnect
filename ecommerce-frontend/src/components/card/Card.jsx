import { useNavigate } from 'react-router-dom';
import { MdDeleteForever } from 'react-icons/md';
import { CiEdit } from 'react-icons/ci';
import { useDispatch } from 'react-redux';
import { addItemToCart } from '../../redux/actions/cartAction';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { deleteItem } from '../../redux/api/ItemRequest';

const Card = (props) => {
  const {
    _id,
    id,
    brand,
    category,
    description,
    image,
    price,
    rating,
    thumbnail,
    title
  } = props?.props;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleClick = (e) => {
    e.preventDefault();
    if (props?.type != 'own') {
      navigate(`/product/${_id}`);
    }
  };

  const handleDelete = () => {
    if (_id && window.confirm('Are you sure you want to delete this item?')) {
      dispatch(deleteItem(_id));
    }
  };

  return (
    <div
      key={id}
      style={{
        backdropFilter: 'blur(10px)',
        background: 'rgba(255,255,255,0.9)'
      }}
      className="border h-96 max-w-60 min-w-60 p-1 pb-3 flex flex-col rounded-xl shadow-lg hover:shadow-xl ease-linear transition-shadow duration-100 overflow-hidden relative"
    >
      <div className="w-full h-full">
        <div
          style={{ borderRadius: '0.5rem' }}
          className={`w-full bg-slate-300 overflow-hidden border h-56 flex items-center justify-center `}
        >
          <LazyLoadImage
            scrollPosition={window.scrollPosition}
            src={image}
            alt={title || 'Product Image'}
          />
        </div>

        <div onClick={handleClick} className="px-1">
          <h className="font-bold text-sm text-wrap line-clamp-2 text-gray-800 mt-3 cursor-pointer">
            {title}
          </h>
          <p className="text-xs mb-1">{brand}</p>
          {rating && (
            <div className="text-yellow-500 text-xs">
              {'★'.repeat(Math.floor(rating))}{' '}
              <span className="text-gray-500 text-xs">({rating})</span>
            </div>
          )}
          <p className="text-xs text-gray-600 line-clamp-2 pr-2">
            {description || 'No description available.'}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between px-2 mb-1">
        <span className="text-md font-bold text-gray-600">
          <span>$ {price}</span>
        </span>
        {props.type == 'own' ? (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                navigate(`/account/myads/editproduct/${_id}`);
              }}
              className=" bg-slate-200 flex items-center justify-center gap-1 text-black rounded-lg text-xs px-3 py-1.5 transition-colors duration-200 hover:bg-slate-300 active:bg-slate-400"
            >
              <CiEdit className=" text-lg " />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              className=" bg-red-600 flex items-center justify-center gap-1 text-white rounded-lg text-xs px-3 py-1.5 transition-colors duration-200 hover:bg-red-700 active:bg-red-800"
            >
              <MdDeleteForever className=" text-lg" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              dispatch(addItemToCart(props?.props));
            }}
            className=" bg-sky-600 text-white rounded-lg text-xs px-3 py-1.5 transition-colors duration-200 hover:bg-sky-700 active:bg-sky-800"
          >
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
};

export default Card;
