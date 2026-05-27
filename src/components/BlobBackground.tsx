export default function BlobBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Muted Blue Blob */}
      <div 
        className="blob-accent absolute w-96 h-96 rounded-full bg-[#7da1b5] -top-20 -left-20"
        style={{ animationDelay: "0s" }}
      />
      {/* Warm Peach/Orange Blob */}
      <div 
        className="blob-accent absolute w-[400px] h-[400px] rounded-full bg-[#ffbb8c] top-1/2 -right-32"
        style={{ animationDelay: "3s" }}
      />
      {/* Soft Pink Blob */}
      <div 
        className="blob-accent absolute w-[350px] h-[350px] rounded-full bg-[#bf8fa2] bottom-10 left-10"
        style={{ animationDelay: "7s" }}
      />
    </div>
  );
}
