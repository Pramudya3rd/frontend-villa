import React from 'react';
import '../styles/StepProgress.css';
import { FaCheck } from 'react-icons/fa';

const StepProgress = ({ currentStep }) => {
  const steps = [
    { id: 1, title: 'Date & Rooms' },
    { id: 2, title: 'Payment' },
    { id: 3, title: 'Confirmation' }
  ];

  return (
    <div className="step-progress">
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <div className="step">
            <div className={`step-circle ${step.id < currentStep ? 'completed' : ''} ${step.id === currentStep ? 'active' : ''}`}>
              {step.id < currentStep ? <FaCheck /> : step.id}
            </div>
            <div className={`step-label ${step.id <= currentStep ? 'active-label' : ''}`}>
              {step.title}
            </div>
          </div>
          {index < steps.length - 1 && (
            <div className={`step-line ${step.id < currentStep ? 'line-completed' : 'line-pending'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default StepProgress;
