import React, { useRef, useEffect } from 'react'
import Head from 'next/head'
import { AnimatedText } from '@/components/AnimatedText'
import { Layout } from '@/components/Layout'
import ProfilePic from '../../public/images/profile/fb.png'
import Image from 'next/image'
import { useMotionValue, useInView, useSpring } from 'framer-motion'
import Skills from '@/components/Skills'
import Experience from '@/components/Experience'
import Education from '@/components/Education'
import TransitionEffect from '@/components/TransitionEffect'

const AnimatedNumbers = ({ value }) => {

    const ref = useRef(null);

    const motionValue = useMotionValue(0);
    const springValue = useSpring(motionValue, { duration: 3000 });
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (isInView) {
            motionValue.set(value);
        }
    }, [isInView, value, motionValue])

    useEffect(() => {
        springValue.on('change', (latest) => {
            if (ref.current && latest.toFixed(0) <= value) {
                ref.current.textContent = latest.toFixed(0);
            }
        })

    }, [springValue, value])

    return <span ref={ref}> </span>
}

const about = () => {
    return (
        <>
            <Head>
                <title>Feecon | About Page </title>
                <meta name='description' contents='any description' />

            </Head>
            <TransitionEffect />
            <main className='flex w-full flex-col items-center justify-center dark:text-light'>
                <Layout className='pt-16 '>
                    <AnimatedText text="Passion Empowers Purpose!" className='mb-16 lg:!text-7xl sm:!text-6xl xs:!text-4xl sm:mb-8' />

                    <div className='grid w-full grid-cols-8 gap-16 pt-16 sm:gap-8'>
                        <div className='col-span-3 flex flex-col items-start justify-start xl:col-span-4 md:order-2 md:col-span-8'>
                            <h2 className='mb-4 text-lg font-bold uppercase text-dark/75 dark:text-light/75'>Biography</h2>
                            <p className='font-medium'>
                                Feecon Behera is a dedicated software developer and problem solver with over 2 years of experience in the field. Hailing from Cement Nagar, Bargarh, Odisha, Feecon has established a strong foundation in key technologies, including ReactJs and MySql, and continues to refine his skills through the Scaler Academy.
                            </p>

                            <p className='my-4 font-medium'>
                                Education has been a crucial stepping stone in Feecons journey. He holds a Bachelor of Technology in Electronics and Communication from Siksha O Anusandhan University, acquired between August 2016 and June 2020. His academic journey included a range of relevant coursework such as Data Structures and Algorithms, Database Management, and Web Development, providing him with a robust knowledge base.
                            </p>

                            <p className='my-4 font-medium'>
                                In his professional journey, Feecon joined PwC, where he played a pivotal role in the development of a healthcare domain portal. As an Associate 2, he was part of a collaborative team effort, ensuring the portal met the specific needs of group insurance brokers, streamlining their interactions with the system. He meticulously designed the portal to accommodate various group types, thus ensuring flexibility and customization for the users. His work also extended to creating maintenance flows to ensure data accuracy and compliance with changing requirements.
                            </p>

                            <p className='my-4 font-medium'>
                                Before that, as an Associate, Feecon demonstrated his expertise in developing test strategies, saving substantial testing efforts and helping identify critical defects in a Salesforce project, significantly improving the products efficiency. He also contributed to debugging and defect logging, enhancing product performance.
                            </p>

                            <p className='my-4 font-medium'>
                                In addition to his professional experiences, Feecon is an advocate for continuous learning and skill development. He has acquired cloud certifications from both AWS and Azure, showcasing his proficiency in cloud technologies. Moreover, he possesses knowledge of CRM systems like Salesforce, adding a versatile skill set to his repertoire.
                            </p>

                            <p className='my-4 font-medium'>
                                Feecon is enthusiastic about contributing his skills to a dynamic team and being a driving force for the success of the company. His technical skills include proficiency in languages such as Java, Python, C++, HTML/CSS, and JavaScript, and he is well-versed in developer tools like VS Code and Eclipse. He has hands-on experience with technologies like React, Next, GitHub, Salesforce, and Azure/AWS Cloud Computing.
                            </p>

                            <p className='my-4 font-medium'>
                                With a strong educational background, valuable work experience, and a passion for innovation, Feecon Behera is well-equipped to tackle challenging projects and make a significant impact in the world of software development and technology. You can connect with him on LinkedIn at LinkedIn Profile or explore his projects on GitHub at GitHub Profile.
                            </p>
                        </div>
                        <div className='col-span-3 relative h-max rounded-2xl border-2 border-solid border-dark bg-light p-8 dark:border-light dark:bg-dark xl:col-span-4 md:order-1 md:col-span-8'

                        >
                            <div className='absolute top-0 -right-3 -z-10 w-[102%] h-[103%] rounded-2xl bg-dark' />
                            <Image src={ProfilePic} alt='Feecon' className='w-full h-auto rounded-2xl'
                                priority
                                sizes='(max-widthL768px) 100vw,
                            (max-width:1200px) 60vw,
                            33vw'
                            />
                        </div>

                        <div className='col-span-2 flex flex-col items-end justify-between xl:col-span-8 xl:flex-row xl:items-center md:order-3'>
                            <div className='flex flex-col items-end justify-center xl:items-center'>
                                <span className='inline-block text-7xl font-bold md:text-6xl sm:text-5xl xs:text-4xl '>
                                    <AnimatedNumbers value={4} />+
                                </span>
                                <h2 className='text-xl font-medium capitalize text-dark/75 dark:text-light/75 xl:text-center md:text-lg xs:text-base'>satisfied clients</h2>
                            </div>

                            <div className='flex flex-col items-end justify-center  xl:items-center'>
                                <span className='inline-block text-7xl font-bold md:text-6xl sm:text-5xl xs:text-4xl '>
                                    <AnimatedNumbers value={10} />+
                                </span>
                                <h2 className='text-xl font-medium capitalize text-dark/75 dark:text-light/75 xl:text-center md:text-lg xs:text-base'>projects completed</h2>
                            </div>

                            <div className='flex flex-col items-end justify-center  xl:items-center'>
                                <span className='inline-block text-7xl font-bold md:text-6xl sm:text-5xl xs:text-4xl '>
                                    <AnimatedNumbers value={2} />+
                                </span>
                                <h2 className='text-xl font-medium capitalize text-dark/75 dark:text-light/75 xl:text-center md:text-lg xs:text-base'>years of experiences</h2>
                            </div>
                        </div>

                    </div>

                    <Skills />
                    <Experience />
                    <Education />
                </Layout>
            </main>

        </>
    )
}

export default about