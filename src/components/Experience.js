import React, { useRef } from 'react'
import {motion, useScroll } from 'framer-motion'
import LiIcon from './LiIcon'

const Details = ({ position, company, companyLink, time, address, work }) => {
    return <li className='my-8 first:mt-0 last:mb-0 w-[60%] mx-auto flex flex-col items-center justify-between md:w-[80%]'>

        <LiIcon/>
        <motion.div initial={{ y: 50 }} whileInView={{ y: 0 }} transition={{ duration: 0.5, type: 'spring' }}>
            
            <h3 className='capitalize font-bold text-2xl sm:text-xl cs:text-lg'>
                {position}
                &nbsp;
                <a href={companyLink} target='_blank' className='text-primary capitalize dark:text-primaryDark '>@{company}</a>
            </h3>

            <span className='capitalize font-medium text-dark/75 dark:text-light/75 xs:text-sm'>
                {time} | {address}
            </span>
            
            <p className='font-medium w-full md:text-sm'>
                {work}
            </p>
            
        </motion.div>
    </li>
}

const Experience = () => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll(
        {
            target: ref,
            offset: ['start end','center start']
        }
    )
    return (
        <div className='my-64'>
            <h2 className='font-bold text-8xl mb-32 w-full text-center md:text-6xl xs:text-4xl md:mb-16'>
                Experience
            </h2>

            <div ref={ref} className='w-[75%] mx-auto relative lg:w-[90%] md:w-full'>
                
                <motion.div
                    style={{scaleY:scrollYProgress}}
                    className='absolute left-9 top-0 w-[4px] h-full bg-dark origin-top dark:bg-light 
                    md:w-[2px] md:left-[30px] xs:left-[20px]
                    ' />
                    
                <ul className='w-full flex flex-col items-start justify-between ml-4 xs:ml-2'>
                    
                    <Details
                        position={'Associate Software Engineer'}
                        company={'PwC'}
                        companyLink={'www.pwc.com'}
                        time={'Apr 2021 - Oct 2023'}
                        address={'Bangalore, Karnataka'}
                        work="I was part of a collaborative team effort focused on developing a healthcare domain portal. Developed a dedicated portal tailored to the needs of group insurance brokers, streamlining their interactions with the
                        system. Implemented end-to-end business flows, including quoting, enrollment, and contract renewal, providing a holistic
                        platform for managing insurance operations.Designed the portal to accommodate three distinct group types: Small Groups, Large Groups, and Family and Individual
                        policies, ensuring flexibility and customization. Created robust maintenance flows, enabling quick and secure modification of various records, ensuring data accuracy and
                        compliance with changing requirements."
                    />
                    <Details
                        position={'Intern'}
                        company={'Capgemini'}
                        companyLink={'www.capgemini.com'}
                        time={'2020'}
                        address={'WFH'}
                        work="Worked on a team responsible for designing front-end features using vanila HTML, CSS, and Javascripts. "
                    />
                    
                </ul>
            </div>
        </div>
    )
}

export default Experience