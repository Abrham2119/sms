import React from 'react';

interface StepperProps {
    steps: string[];
    currentStep: number;
}

export const Stepper: React.FC<StepperProps> = ({ steps, currentStep }) => {
    return (
        <div className="w-full py-6">
            <div className="flex items-center justify-between relative">
                {/* Progress Line */}
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2 -z-10" />
                <div
                    className="absolute top-1/2 left-0 h-0.5 bg-primary-600 transition-all duration-300 ease-in-out -translate-y-1/2 -z-10"
                    style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                />

                {steps.map((step, index) => {
                    const isActive = index <= currentStep;
                    const isCurrent = index === currentStep;

                    return (
                        <div key={step} className="flex flex-col items-center flex-1">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${isActive
                                        ? 'bg-primary-600 border-primary-600 text-white'
                                        : 'bg-white border-gray-300 text-gray-500'
                                    } ${isCurrent ? 'ring-4 ring-primary-100' : ''}`}
                            >
                                {index + 1}
                            </div>
                            <span className={`mt-2 text-sm font-medium ${isActive ? 'text-primary-700' : 'text-gray-500'
                                }`}>
                                {step}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
