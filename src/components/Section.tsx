import { cn } from '@/lib/utils'
import React, { ReactNode } from 'react'
import { GenericDataType } from '@/types/generic.types';

export const Section = ({ title, highlight, classList, style = {}, children }: { title: string, highlight?: string, classList?: string, style?: GenericDataType, children: ReactNode }) => {
   return (
      <section className={cn('w-full py-20 text-center', classList)} style={style}>
         <h1 className="heading sm:text-xl md:text-5xl font-bold">
            {title} {" "}
            <span className="text-purple-400">{highlight}</span>
         </h1>
         {children}
      </section>
   )
}

export const CenteredSection = ({
   title,
   classList = "",
   titleClass,
   subtitleClass,
   descriptionClass,
   subtitle = "",
   description = "",
   children }: {
      title: string,
      classList?: string,
      titleClass?: string,
      subtitleClass?: string,
      descriptionClass?: string,
      subtitle?: string,
      description?: string,
      children: ReactNode
   }) => {
   return (
      <section className={cn('w-full bg-white shadow-lg p-7 text-center', classList)}>
         {title && <h2 className={cn(`text-xl font-bold`, titleClass)}>{title}</h2>}
         {subtitle && <p className={cn(`mt-2`, subtitleClass)}>{subtitle}</p>}
         {description && <p className={cn(`mt-7 text-blue-800`, descriptionClass)}>{description}</p>}

         {children}
      </section>
   )
}