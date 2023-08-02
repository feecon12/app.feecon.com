import React from 'react'
import Link from 'next/link'

const CustomLink = ({ href, title, className = "" }) => {

  return (
    <Link href={href} >
      {title}
    </Link>
  )
}

export const NavBar = () => {
  return (
    <header className='w-full px-32 py-8 font-medium flex items-center justify-between'>
      <nav>
        <CustomLink href={"/home"} title="Home" className='mr-4'/>
        <CustomLink href={"/about"} title="About" />
        <CustomLink href={"/articles"} title="Articles"  />
        <CustomLink href={"/project"} title="Project"  />
      
      </nav>
    
    </header>
  )
}
