const Loading = () => {
    return (
        <div className="flex justify-center items-center h-screen w-full bg-dark">
            <div className="relative w-24 h-24">
                <div className="absolute top-0 left-0 w-full h-full border-4 border-white/10 rounded-full"></div>
                <div className="absolute top-0 left-0 w-full h-full border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-primary font-bold text-sm animate-pulse">
                    Loading
                </div>
            </div>
        </div>
    );
};

export default Loading;
