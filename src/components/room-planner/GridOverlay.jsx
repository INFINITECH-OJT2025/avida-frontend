export default function GridOverlay({ gridSize, canvasSize }) {
    return (
      <div className="absolute inset-0 pointer-events-none">
        <svg width={canvasSize.width} height={canvasSize.height}>
          {/* Draw Vertical Lines */}
          {Array.from({ length: canvasSize.width / gridSize }).map((_, i) => (
            <line
              key={`v-${i}`}
              x1={i * gridSize}
              y1={0}
              x2={i * gridSize}
              y2={canvasSize.height}
              stroke="#ddd"
            />
          ))}
  
          {/* Draw Horizontal Lines */}
          {Array.from({ length: canvasSize.height / gridSize }).map((_, i) => (
            <line
              key={`h-${i}`}
              x1={0}
              y1={i * gridSize}
              x2={canvasSize.width}
              y2={i * gridSize}
              stroke="#ddd"
            />
          ))}
        </svg>
      </div>
    );
  }
  