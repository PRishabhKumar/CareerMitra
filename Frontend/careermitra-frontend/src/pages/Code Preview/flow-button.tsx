// This is file of your component

// You can use any dependencies from npm; we import them automatically in package.json
import React from 'react';
'use client';
import { ArrowRight } from 'lucide-react';
import './Styles/FlowButton.css';

interface FlowButtonProps {
  text?: string;
  onClick?: () => void;
}

export function FlowButton({ text = "Modern Button", onClick }: FlowButtonProps) {
  return (
    <button className="flow-btn group" onClick={onClick}>
      {/* Left arrow (arr-2) */}
      <ArrowRight 
        className="arrow-left" 
      />

      {/* Text */}
      <span className="btn-text-span">
        {text}
      </span>

      {/* Circle */}
      <span className="hover-circle"></span>

      {/* Right arrow (arr-1) */}
      <ArrowRight 
        className="arrow-right" 
      />
    </button>
  );
}
