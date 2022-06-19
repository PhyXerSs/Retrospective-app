const Loading = () => {
    return (
    <div
      className="
      z-[999]
      m-auto
      bg-black-opa80
      fixed
      top-0
      left-0
      right-0
      bottom-0
      block
      w-screen
      h-screen"
    >
      <img
       className="block mt-[15%] w-[500px] mx-auto"
    //    src="/static/images/loading/xloading.gif"
       src="/static/images/loading/cxWaiting.gif"
       alt="loading..." />
    </div>
    );
}

export default Loading;