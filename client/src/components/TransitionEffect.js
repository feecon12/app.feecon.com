import React from 'react'
import { motion } from 'framer-motion'

const TransitionEffect = () => {
    return (
      <>
        {/* <motion.div className='fixed top-0 bottom-0 right-full w-screen h-screen z-30 bg-primary'
                initial={{ x: '100%', width: '100%' }}
                animate={{ x: '0%', width: '0%' }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
            />

            <motion.div className='fixed top-0 bottom-0 right-full w-screen h-screen z-20 bg-light'
                initial={{ x: '100%', width: '100%' }}
                animate={{ x: '0%', width: '0%' }}
                transition={{delay:0.2, duration: 0.8, ease: 'easeInOut' }}
            />

            <motion.div className='fixed top-0 bottom-0 right-full w-screen h-screen z-10 bg-dark'
                initial={{ x: '100%', width: '100%' }}
                animate={{ x: '0%', width: '0%' }}
                transition={{delay:0.4, duration: 0.8, ease: 'easeInOut' }}
            /> */}

        <div className="fixed top-0 left-0 w-full h-1 z-50 bg-transparent">
          <motion.div
            className="h-full bg-primary"
            initial={{ x: "0%", width: "0%" }}
            animate={{ x: "100%", width: "100%" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
        </div>
        <div className="fixed top-0 left-0 w-full h-1 z-50 bg-transparent">
          <motion.div
            className="h-full bg-light"
            initial={{ x: "0%", width: "0%" }}
            animate={{ x: "100%", width: "100%" }}
            transition={{ delay:0.2, duration: 0.8, ease: "easeInOut" }}
          />
        </div>
        <div className="fixed top-0 left-0 w-full h-1 z-50 bg-transparent">
          <motion.div
            className="h-full bg-dark"
            initial={{ x: "0%", width: "0%" }}
            animate={{ x: "100%", width: "100%" }}
            transition={{ delay:0.4, duration: 0.8, ease: "easeInOut" }}
          />
        </div>
      </>
    );
}

export default TransitionEffect