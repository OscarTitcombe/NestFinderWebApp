import React from 'react'

interface NestLogoIconProps {
  className?: string
}

export default function NestLogoIcon({ className }: NestLogoIconProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Nest/Shell structure - layered curved lines wrapping around, thicker at bottom */}
      <path
        d="M 18 90 Q 25 50, 40 58 Q 50 65, 60 58 Q 75 50, 82 90"
        stroke="#101314"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
        opacity="0.85"
      />
      <path
        d="M 22 88 Q 28 58, 40 64 Q 50 70, 60 64 Q 72 58, 78 88"
        stroke="#101314"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.75"
      />
      <path
        d="M 26 86 Q 30 65, 40 70 Q 50 75, 60 70 Q 70 65, 74 86"
        stroke="#101314"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        opacity="0.7"
      />
      <path
        d="M 30 84 Q 33 70, 40 74 Q 50 78, 60 74 Q 67 70, 70 84"
        stroke="#101314"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.65"
      />
      <path
        d="M 34 82 Q 36 74, 40 77 Q 50 80, 60 77 Q 64 74, 66 82"
        stroke="#101314"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      />
      
      {/* House structure */}
      {/* Main body */}
      <rect
        x="35"
        y="45"
        width="30"
        height="25"
        stroke="#101314"
        strokeWidth="2.5"
        fill="none"
      />
      
      {/* Roof */}
      <path
        d="M 30 45 L 50 30 L 70 45 Z"
        stroke="#101314"
        strokeWidth="2.5"
        fill="none"
      />
      
      {/* Chimney */}
      <rect
        x="58"
        y="25"
        width="6"
        height="12"
        stroke="#101314"
        strokeWidth="2.5"
        fill="none"
      />
      
      {/* Window - circular */}
      <circle
        cx="50"
        cy="52"
        r="4"
        stroke="#101314"
        strokeWidth="2"
        fill="none"
      />
      
      {/* Door - rectangular */}
      <rect
        x="43"
        y="60"
        width="8"
        height="10"
        stroke="#101314"
        strokeWidth="2"
        fill="none"
      />
    </svg>
  )
}

