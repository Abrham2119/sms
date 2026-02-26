import type { FC } from 'react';

interface ChartProps {
    data: number[];
    labels: string[];
    height?: number;
    width?: number;
}

export const LineChart: FC<ChartProps> = ({ data, labels, height = 200, width = 400 }) => {
    const max = Math.max(...data) * 1.2;
    const points = data.map((val, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - (val / max) * height;
        return `${x},${y}`;
    }).join(' ');

    return (
        <div className="relative w-full h-full group">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
                {/* Grid Lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
                    <line
                        key={i}
                        x1="0"
                        y1={height * p}
                        x2={width}
                        y2={height * p}
                        stroke="#f3f4f6"
                        strokeWidth="1"
                    />
                ))}

                {/* Gradient Def */}
                <defs>
                    <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ffff00" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#ffff00" stopOpacity="0" />
                    </linearGradient>
                </defs>

                {/* Area under the line */}
                <path
                    d={`M 0,${height} L ${points} L ${width},${height} Z`}
                    fill="url(#lineGradient)"
                    className="transition-all duration-700"
                />

                {/* The Line */}
                <polyline
                    fill="none"
                    stroke="#ffff00"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={points}
                    className="drop-shadow-[0_0_8px_rgba(255,255,0,0.5)] transition-all duration-700"
                />

                {/* Data Points */}
                {data.map((val, i) => {
                    const x = (i / (data.length - 1)) * width;
                    const y = height - (val / max) * height;
                    return (
                        <circle
                            key={i}
                            cx={x}
                            cy={y}
                            r="4"
                            fill="#ffff00"
                            className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:r-6"
                        >
                            <title>{labels[i]}: {val}</title>
                        </circle>
                    );
                })}
            </svg>
        </div>
    );
};

export const BarChart: FC<ChartProps> = ({ data, labels, height = 200, width = 400 }) => {
    const max = Math.max(...data) * 1.1;
    const barWidth = (width / data.length) * 0.7;
    const gap = (width / data.length) * 0.3;

    return (
        <div className="relative w-full h-full group">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
                {data.map((val, i) => {
                    const h = (val / max) * height;
                    const x = i * (barWidth + gap) + gap / 2;
                    const y = height - h;
                    return (
                        <g key={i}>
                            <rect
                                x={x}
                                y={y}
                                width={barWidth}
                                height={h}
                                fill="#ffff00"
                                rx="6"
                                className="transition-all duration-500 hover:fill-[#ffff00] hover:drop-shadow-[0_0_15px_rgba(255,255,0,0.8)] drop-shadow-[0_4px_10px_rgba(255,255,0,0.3)]"
                            />
                            <text
                                x={x + barWidth / 2}
                                y={height + 20}
                                fill="#666"
                                fontSize="10"
                                textAnchor="middle"
                                className="font-bold uppercase tracking-tighter"
                            >
                                {labels[i].slice(0, 3)}
                            </text>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
};

export const DonutChart: FC<{ data: { label: string, value: number, color: string }[] }> = ({ data }) => {
    const total = data.reduce((acc, curr) => acc + curr.value, 0);
    let accumulatedAngle = 0;
    const radius = 70;
    const strokeWidth = 20;
    const center = 100;

    return (
        <div className="relative w-full h-full flex items-center justify-center">
            <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
                {data.map((item, i) => {
                    const angle = (item.value / total) * 360;
                    const largeArcFlag = angle > 180 ? 1 : 0;
                    const x1 = center + radius * Math.cos((Math.PI * accumulatedAngle) / 180);
                    const y1 = center + radius * Math.sin((Math.PI * accumulatedAngle) / 180);
                    accumulatedAngle += angle;
                    const x2 = center + radius * Math.cos((Math.PI * accumulatedAngle) / 180);
                    const y2 = center + radius * Math.sin((Math.PI * accumulatedAngle) / 180);

                    const pathData = [
                        `M ${x1} ${y1}`,
                        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                    ].join(' ');

                    return (
                        <path
                            key={i}
                            d={pathData}
                            fill="none"
                            stroke={item.color}
                            strokeWidth={strokeWidth}
                            strokeLinecap="round"
                            className="transition-all duration-500 hover:stroke-white cursor-pointer"
                            style={{ strokeDasharray: '0.1 5' }} /* Subtle segmenting effect */
                        />
                    );
                })}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-900">
                <span className="text-2xl font-black">{total}</span>
                <span className="text-[10px] uppercase font-bold text-gray-400">Total Items</span>
            </div>
        </div>
    );
};
