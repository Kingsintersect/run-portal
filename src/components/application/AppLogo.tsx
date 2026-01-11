import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

export default function AppLogo({ image_url, url, classList = "", logo_text, Img_container_style, logo_text_style }: {
    image_url: string,
    url?: string,
    classList?: string,
    logo_text?: string
    Img_container_style?: string,
    logo_text_style?: string,
}) {
    return (
        <Link className={cn(`block leading-none text-white`, classList)} href={url ?? "/"}>
            <div className={cn('flex flex-row items-center gap-2')}>
                <div className={cn("relative h-20 w-40 m-2", Img_container_style)}>
                    <Image
                        src={image_url}
                        alt="LOGO IMAGE"
                        fill
                        className="object-contain"
                    />
                </div>

                {logo_text && <span className={cn(`text-wrap leading-none font-bold text-xl`, logo_text_style)}>{logo_text}</span>}
            </div>
        </Link>
    );
}
