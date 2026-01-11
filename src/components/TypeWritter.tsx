'use client';

import { cn } from '@/lib/utils';
import { useEffect } from 'react';

const loopTypewriterPhrases = (
    phrases: string[],
    speed = 100,
    pause = 5000
) => {
    const element = document.getElementById('typeWriter');
    if (!element) return;

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentPhrase = phrases[phraseIndex];
        const displayed = isDeleting
            ? currentPhrase.substring(0, charIndex--)
            : currentPhrase.substring(0, charIndex++);

        element!.innerHTML = displayed;

        if (!isDeleting && charIndex === currentPhrase.length + 1) {
            setTimeout(() => {
                isDeleting = true;
                type();
            }, pause);
        } else if (isDeleting && charIndex < 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            setTimeout(type, 500);
        } else {
            setTimeout(type, isDeleting ? speed / 2 : speed);
        }
    }

    type();
};

interface TypewriterProps {
    phrases: string[];
    speed?: number;
    delay?: number;
    className?: string;
}

export default function Typewriter({ phrases, speed, delay, className }: TypewriterProps) {
    useEffect(() => {
        loopTypewriterPhrases(phrases, speed, delay);
    }, [delay, phrases, speed]);

    return (
        <p id="typeWriter" className={cn(`text-3xl font-bold text-primary p-0 min-h-[30px]`, className)}>
            <span className="animate-pulse">|</span>
        </p>
    );
}
