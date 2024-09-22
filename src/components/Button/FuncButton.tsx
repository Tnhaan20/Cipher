
interface buttonName{
    name: string
}

export default function FuncButton({name}: buttonName) {


  return (
    <div className="w-full flex justify-center">
      <button className="button-search flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 1024 1024"
          className="mr-2"
        >
          <path
            fill="currentColor"
            d="M352 480h320a32 32 0 1 1 0 64H352a32 32 0 0 1 0-64"
          />
          <path
            fill="currentColor"
            d="M480 672V352a32 32 0 1 1 64 0v320a32 32 0 0 1-64 0"
          />
          <path
            fill="currentColor"
            d="M512 896a384 384 0 1 0 0-768a384 384 0 0 0 0 768m0 64a448 448 0 1 1 0-896a448 448 0 0 1 0 896"
          />
        </svg>
        {name}
      </button>
    </div>
  );
}