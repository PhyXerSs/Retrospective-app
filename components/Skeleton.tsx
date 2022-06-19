const Skeleton = () => {
    return (
    <div className="p-3 my-3 min-h-40 w-full rounded-lg border-2 border-secondary-gray-2">
       <div className="flex animate-pulse flex-row items-center h-full justify-center space-x-5">
        <div className="flex flex-col space-y-3">
          <div className="w-80 bg-gray h-6 rounded-md "></div>
          <div className="w-72 bg-gray h-6 rounded-md "></div>
          <div className="w-80 bg-gray h-6 rounded-md "></div>
        </div>
       </div>
    </div>
    );
}

export default Skeleton;