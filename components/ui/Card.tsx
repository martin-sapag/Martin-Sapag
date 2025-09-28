
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-slate-800 rounded-lg p-6 shadow-lg ${className}`}>
      {children}
    </div>
  );
};

export default Card;

interface InfoCardProps {
    title: string;
    value: string;
    color?: string;
}

export const InfoCard: React.FC<InfoCardProps> = ({ title, value, color="text-white" }) => {
    return (
        <Card className="bg-slate-800/50">
            <h4 className="text-sm font-medium text-slate-400 mb-1">{title}</h4>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
        </Card>
    );
};
