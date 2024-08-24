import React, { useRef } from 'react'
import { motion, useScroll } from 'framer-motion'
import LiIcon from './LiIcon'

const Details = ({ position, company, companyLink, time, address, p1, p2, p3, p4, p5, p6, p7 }) => {
    return <li className='my-8 first:mt-0 last:mb-0 w-[60%] mx-auto flex flex-col items-center justify-between md:w-[80%]'>

        <LiIcon />
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
                {p1}
            </p>
            <p className='font-medium w-full md:text-sm'>
                {p2}
            </p>
            <p className='font-medium w-full md:text-sm'>
                {p3}
            </p>
            <p className='font-medium w-full md:text-sm'>
                {p4}
            </p>
            <p className='font-medium w-full md:text-sm'>
                {p5}
            </p>
            <p className='font-medium w-full md:text-sm'>
                {p6}
            </p>
            <p className='font-medium w-full md:text-sm'>
                {p7}
            </p>

        </motion.div>
    </li>
}

const Experience = () => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll(
        {
            target: ref,
            offset: ['start end', 'center start']
        }
    )
    return (
        <div className='my-64'>
            <h2 className='font-bold text-8xl mb-32 w-full text-center md:text-6xl xs:text-4xl md:mb-16'>
                Experience
            </h2>

            <div ref={ref} className='w-[75%] mx-auto relative lg:w-[90%] md:w-full'>

                <motion.div
                    style={{ scaleY: scrollYProgress }}
                    className='absolute left-9 top-0 w-[4px] h-full bg-dark origin-top dark:bg-light 
                    md:w-[2px] md:left-[30px] xs:left-[20px]
                    ' />

                <ul className='w-full flex flex-col items-start justify-between ml-4 xs:ml-2'>

                    <Details
                        position={'Associate'}
                        company={'PwC'}
                        companyLink={'www.pwc.com'}
                        time={'2021 - Present'}
                        address={'WFH'}
                        p1="● Developed test strategies that covered all test scenarios that helped save testing efforts by 40%."
                        p2="● Logged more than 1,000 critical and severe defects in a project in salesforce practice that helped product run smoothly in all stages of SDLC."
                        p3="● Developed quality in working in experience cloud in the Healthcare domain."
                        p4="● Developed skills in cloud technologies and earned multiple cloud certificates (beginner to mid-level) from organizations like AWS and Ms Azure."
                        p5="● Helped in debugging and logging defects in HTTP requests which helped product efficiency
                        increase by 30%."
                        p6="● Created test plan templates for practice level and helped team members in training activities."
                        p7="● Implemented PwC's best practices such as agile methodology, story-driven methodology,
                        customer-centric approach, and so on."

                    />

                </ul>
            </div>
        </div>
    )
}

export default Experience