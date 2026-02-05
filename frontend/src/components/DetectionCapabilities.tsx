const capabilities = [
  "PERSON",
  "VEHICLE", 
  "MOBILE PHONE",
  "LAPTOP",
  "BOTTLE",
  "CUP",
  "CHAIR",
  "BACKPACK",
  "TV/MONITOR",
  "KEYBOARD",
];

export function DetectionCapabilities() {
  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Section Label */}
      <div className="flex items-center gap-2 mb-4">
        <span className="w-2 h-2 bg-destructive rounded-sm" />
        <span className="font-rajdhani text-sm text-bmw-cyan uppercase tracking-[0.2em] font-semibold">
          Broad Detection Capabilities
        </span>
      </div>

      {/* Badges Grid */}
      <div className="flex flex-wrap gap-3 justify-center">
        {capabilities.map((item) => (
          <div
            key={item}
            className="detection-badge"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
