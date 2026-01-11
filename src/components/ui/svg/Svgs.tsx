import React from 'react'

export const Coinbase = () => {
  return (
    <svg aria-hidden="true" className="h-5" viewBox="0 0 292 292" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M145.7 291.66C226.146 291.66 291.36 226.446 291.36 146C291.36 65.5541 226.146 0.339844 145.7 0.339844C65.2542 0.339844 0.0400391 65.5541 0.0400391 146C0.0400391 226.446 65.2542 291.66 145.7 291.66Z" fill="#3259A5" /><path d="M195.94 155.5C191.49 179.08 170.8 196.91 145.93 196.91C117.81 196.91 95.0204 174.12 95.0204 146C95.0204 117.88 117.81 95.0897 145.93 95.0897C170.8 95.0897 191.49 112.93 195.94 136.5H247.31C242.52 84.7197 198.96 44.1797 145.93 44.1797C89.6904 44.1797 44.1104 89.7697 44.1104 146C44.1104 202.24 89.7004 247.82 145.93 247.82C198.96 247.82 242.52 207.28 247.31 155.5H195.94Z" fill="white" /></svg>
  )
}

export function ArrowRightSvg() {
    return (
        <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
        </svg>
    )
}

export function MailSvg() {
    return (
        <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 24"
        width="48"
        height="24"
        >
            <g fill="#23628d">
                <path
                d="M2 6.5C2 5.12 3.12 4 4.5 4h15c1.38 0 2.5 1.12 2.5 2.5v11c0 1.38-1.12 2.5-2.5 2.5h-15C3.12 20 2 18.88 2 17.5v-11zM4.5 6a.5.5 0 00-.5.5v.28l8 5.14 8-5.14V6.5a.5.5 0 00-.5-.5h-15zM20 8.62l-7.46 4.8a1 1 0 01-1.08 0L4 8.62V17.5a.5.5 0 00.5.5h15a.5.5 0 00.5-.5V8.62z"
                />
            </g>
        </svg>
    )
}

export function PhoneSvg() {
    return (
        <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="24"
        height="24"
        fill="none"
        stroke="#23628d"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        >
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2" fill="white"/>
            <circle cx="12" cy="18" r="1" fill="white" stroke="#23628d"/>
            <line x1="8" y1="4" x2="16" y2="4" stroke="#23628d"/>
        </svg>
    )
}
