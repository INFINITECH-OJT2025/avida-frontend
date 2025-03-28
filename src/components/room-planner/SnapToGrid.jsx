export default function SnapToGrid({ position, gridSize }) {
    const smoothFactor = 0.2; // ✅ Makes movement smoother

    const snapValue = (value) => {
        const snapped = Math.round(value / gridSize) * gridSize;
        return value + (snapped - value) * smoothFactor; // ✅ Adds smooth easing
    };

    return {
        x: snapValue(position.x),
        y: snapValue(position.y),
    };
}
