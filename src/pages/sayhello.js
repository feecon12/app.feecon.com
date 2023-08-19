import { Layout } from '@/components/Layout'
import React from 'react'

const sayhello = () => {
  return (
    <>

      <main>
        <Layout className='md:px-0 md:mx-0'>
          <div className='mx-40 px-40 mt-1 md:px-4'>

            <form className='my-6 items-center flex flex-col border border-solid border-dark rounded-lg py-6 dark:border-light  '>
              <h2 className='text-dark mb-4 text-xl font-bold dark:text-light'>Say Hello</h2>

              <label className='text-dark font-bold dark:text-light'>Name</label>
              <input type='text' className='text-dark dark:text-dark p-1.5 rounded-lg border border-dark focus:outline-none mb-2 lg:text-sm md:text-xs'></input>
              <label className='text-dark font-bold dark:text-light'>Email</label>
              <input type='email' className='dark:text-dark p-1.5 rounded-lg border border-dark focus:outline-none mb-2 lg:text-sm md:text-xs'></input>
              <label type='area' className='text-dark font-bold dark:text-light'>Message</label>
              <input className='dark:text-dark p-1.5 rounded-lg border border-dark focus:outline-none mb-2 lg:text-sm md:text-xs'></input>
              <button className='bg-primary font-bold text-light p-2 my-3 rounded-lg hover:bg-light hover:border hover:border-dark hover:text-dark
          dark:bg-primaryDark dark:text-dark dark:hover:bg-dark dark:hover:text-light dark:hover:border-light
          '
              >Send</button>

            </form>
          </div>


        </Layout>

      </main>

    </>
  )
}

export default sayhello