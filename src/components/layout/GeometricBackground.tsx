export default function GeometricBackground() {
  const color = "border-cyan-400/50";
  const bgColor = "bg-cyan-400/50";

  return (
    // Increased opacity from 40 to 60 for better visibility
    <div className="fixed inset-0 pointer-events-none z-0 opacity-60 overflow-hidden">
      
      {/* Top Left */}
      <div className={`absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 ${color}`}></div>
      <div className={`absolute top-20 left-20 w-24 h-24 border ${color} rounded-full`}></div>
      
      {/* Top Right */}
      <div className={`absolute top-40 right-10 w-16 h-16 border-r-2 border-b-2 ${color}`}></div>
      
      {/* Mid Left */}
      <div className={`absolute bottom-20 left-1/4 w-20 h-20 border ${color}`}></div>
      
      {/* Mid Right */}
      <div className={`absolute top-1/2 right-1/4 w-32 h-32 border-r-2 border-t-2 ${color}`}></div>
      
      {/* Bottom Right */}
      <div className={`absolute bottom-10 right-10 w-40 h-40 border-l-2 border-b-2 ${color} rotate-45`}></div>
      <div className={`absolute bottom-12 right-12 w-20 h-20 border-2 ${color} rotate-45`}></div>

      {/* Horizontal lines */}
      <div className={`absolute top-24 right-0 w-16 h-px ${bgColor}`}></div>
      <div className={`absolute top-48 right-0 w-12 h-px ${bgColor}`}></div>
      <div className={`absolute top-60 right-0 w-10 h-px ${bgColor}`}></div>
      
      {/* Vertical lines */}
      <div className={`absolute left-12 top-0 w-px h-24 ${bgColor}`}></div>
      <div className={`absolute left-24 bottom-0 w-px h-32 ${bgColor}`}></div>

    </div>
  )
}