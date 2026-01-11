import { UserCircleIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import "./cards.styles.module.css";

interface ISocialType {
    url: string;
    icon: React.ReactNode;
}
interface IImageCard {
    imageUrl: string;
    title: string;
    description: string;
    socialBtn: ISocialType[];
}

const ImageCard = ({ imageUrl, title, description, socialBtn }: IImageCard) => {
    return (
        <div className='our-team group bg-white text-center overflow-hidden relative p-3'>
            <div className="pic inline-block w-[130px] h-[130px] mb-[56px] /*bg-[#eb1768]*/ relative z-10 group-hover:before:h-full">
                {/* <img src="/" alt="Staff image" className={`w-[100%] h-auto rounded-full scale-100 transition-all duration-700 ease-in-out 0s group-hover: shadow-[0 0 0 14px #f7f5ec] group-hover:scale-75`} /> */}
                <UserCircleIcon width={'100%'} height={'auto'} className={`rounded-full scale-100 transition-all duration-700 ease-in-out 0s bg-white group-hover: shadow-[0 0 0 14px #f7f5ec] group-hover:scale-75`} />
            </div>
            <div className="team-content mb-8">
                <h3 className="title font-semibold text-[#4e5052] capitalize mb-1">{title}</h3>
                <span className="post block font-light text-[#4e5052] capitalize">{description}</span>
            </div>
            <ul className="social w-[100%] p-0 m-0 bg-[#eb1768] absolute -bottom-full left-0 transition-all duration-500 ease-in-out 0s  flex items-center justify-center group-hover:bottom-0">
                {socialBtn.map((item, index) => (
                    <li key={index}><Link href={item.url} className="block p-2 font-semibold text-white transition-all duration-300 ease-in-out hover:text-[#eb1768] hover:bg-[#f7f5ec]">{item.icon}</Link></li>
                ))}
            </ul>
        </div>
    )
}

export default ImageCard