import React,{useRef} from 'react'
import Head from 'next/head'
import { AnimatedText } from '@/components/AnimatedText'
import { Layout } from '@/components/Layout'
import Link from 'next/link'
import Image from 'next/image'
import article1 from '../../public/images/articles/pagination component in reactjs.jpg'
import article2 from '../../public/images/articles/create loading screen in react js.jpg'
import { motion, useMotionValue} from 'framer-motion'
import article3 from '../../public/images/articles/create modal component in react using react portals.png'
import article4 from '../../public/images/articles/form validation in reactjs using custom react hook.png'
import article5 from '../../public/images/articles/smooth scrolling in reactjs.png'
import article6 from '../../public/images/articles/What is Redux with easy explanation.png'
import article7 from '../../public/images/articles/What is higher order component in React.jpg'
import TransitionEffect from '@/components/TransitionEffect'
// import article8 from '../../public/images/articles/todo list app built using react redux and framer motion.png'


const FramerImage = motion(Image);

const MovingImage = ({ title, img, link }) => {

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const imgRef = useRef(null);

  function handleMouse(event) {
    imgRef.current.style.display = 'inline-block';
    x.set(event.pageX);
    y.set(-10);
  }
  function handleMouseLeave(event) {
    imgRef.current.style.display = 'none';
    x.set(0);
    y.set(0);
  }

  return (
    <Link href={link} target='_blank'

      onMouseMove={handleMouse}
      onMouseLeave={handleMouseLeave}
    >

      <h2 className='capitalize text-xl font-semibold hover:underline '>
        {title}
      </h2>
      <FramerImage style={{x:x,y:y}} initial={{opacity:0}} whileInView={{opacity:1,transition:{duration:0.2}}} ref={imgRef} src={img} alt={title} className='z-10 w-96 h-auto hidden absolute rounded-lg md:!hidden' />
    </Link>
  )
}

const Article = ({ img, title, date, link }) => {
  return (
    <motion.li
      initial={{ y: 200 }}
      whileInView={{ y: 0, transition: { duration: 0.5, ease: 'easeInOut' } }}
      viewport={{once:true}}
      className='relative w-full p-4 py-6 my-4 rounded-xl flex items-center justify-between bg-light text-dark first:mt-0 border border-solid border-dark dark:bg-dark dark:text-light dark:border-light
      sm:flex-col
      '>
      <MovingImage title={title} img={img} link={link} />
      <span className='text-primary dark:text-primaryDark font-semibold pl-4 sm:self-start sm:pl-0 xs:text-sm'>{date}</span>
    </motion.li>
  )
}

const FeaturedArticle = ({ img, title, time, summary, link }) => {
  return (
    <li className='col-span-1 w-full p-4 bg-light border border-solid border-dark rounded-2xl dark:bg-dark 
    dark:text-light dark:border-light'>
      <Link
        href={link}
        target='_blank'
        className='w-full inline-block cursor-pointer overflow-hidden rounded-lg'
      >
        <FramerImage src={img} alt={title} className='w-full h-auto' whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}
        priority
        sizes='(max-widthL768px) 100vw,
        (max-width:1200px) 60vw,
        50vw'
        />
      </Link>

      <Link href={link} target='_blank'>
        <h2 className='capitalize text-2xl font-bold my-2 mt-4 hover:underline xs:text-lg'>{title}</h2>
      </Link>
      <p className='text-sm mb-2'>{summary}</p>
      <span className='text-primary dark:text-primaryDark font-semibold'>{time}</span>
    </li>
  )
}

const articles = () => {
  return (
    <>
      <Head>
        <title>Feecon | Articles Page </title>
        <meta name='description' contents='any description' />

      </Head>
      <TransitionEffect />
      
      
      <main className='w-full mb-16 flex flex-col items-center justify-center dark:text-light overflow-hidden'>
        <Layout className='pt-16'>
          <AnimatedText text='Words Possess Global Impact!' className='mb-16 lg:!text-7xl sm:mb-8 sm:!text-6xl xs:!text-4xl' />

          <ul className='grid grid-cols-2 gap-16 lg:gap-8 md:grid-cols-1 md:gap-y-16'>
            <FeaturedArticle
              title={'Build A Custom Pagination Component In Reactjs From Scratch'}
              summary=" Learn how to build a custom pagination component in ReactJS from scratch. 
           Follow this step-by-step guide to integrate Pagination component in your ReactJS project."
              time={'9 min read'}
              link='/'
              img={article1}
            />

            <FeaturedArticle
              title={'Build A Custom Pagination Component In Reactjs From Scratch'}
              summary=" Learn how to build a custom pagination component in ReactJS from scratch. 
           Follow this step-by-step guide to integrate Pagination component in your ReactJS project."
              time={'9 min read'}
              link='/'
              img={article2}
            />

          </ul>
          <h2 className='font-bold text-4xl w-full text-center my-16 mt-32 dark:text-light'>All Articles</h2>
          <ul>
            <Article
              title='Form Validation In Reactjs: Build A Reusable Custom Hook For Inputs And Error Handling'
              img={article3}
              date='August 09, 2023'
              link='/'
            />

            <Article
              title='Form Validation In Reactjs: Build A Reusable Custom Hook For Inputs And Error Handling'
              img={article4}
              date='August 09, 2023'
              link='/'
            />

            <Article
              title='Form Validation In Reactjs: Build A Reusable Custom Hook For Inputs And Error Handling'
              img={article5}
              date='August 09, 2023'
              link='/'
            />

            <Article
              title='Form Validation In Reactjs: Build A Reusable Custom Hook For Inputs And Error Handling'
              img={article6}
              date='August 09, 2023'
              link='/'
            />
            <Article
              title='Form Validation In Reactjs: Build A Reusable Custom Hook For Inputs And Error Handling'
              img={article7}
              date='August 09, 2023'
              link='/'
            />
          </ul>
        </Layout>
      </main>
    </>
  )
}

export default articles