import React from 'react'
import { Logo } from './Logo'


export const NavBar = () => {
  return (
    <header className='px-32 py-8 items-center flex justify-between font-medium'>
      <nav>
        <a href={'/'} className='mr4'> Home</a>
        <a href={'/'} className='mx-4'> About</a>
        <a href={'/'} className='mx-4'> Articles</a>
        <a href={'/'} className='ml-4'> Projects</a>
        
      </nav>

      <Logo/>

      <nav>
        <a href='/'className='mr-4'>Icon1</a>
        <a href='/'className='mx-4'>Icon2</a>
        <a href='/'className='mx-4'>Icon3</a>
        <a href='/'className='ml-4'>Icon4</a>
      </nav>


    </header>
  )
}
