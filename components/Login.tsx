import React from 'react'
import {useMetamask} from '@thirdweb-dev/react'

const Login = () => {
    const connectWithMetamask = useMetamask();
  return (
    <div className='bg-[#091B18] min-h-screen text-center flex flex-col items-center justify-center'>
       <div className='flex flex-col items-center mb-10'>
        <img className='rounded-full h-56 w-50 mb-10' src="https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/themes/3293449/settings_images/3DQ6jYtpQLy6njXpZRot_file.jpg" />

        <h1 className='text-5xl text-white font-bold'>

            THE <span className='text-[#f6b41b]'> SIGMA METAVERSE</span>  DRAW
        </h1>
        <h2 className='text-white mt-4'>
            Get started by Logging in with your Metamask
        </h2>

        <button onClick={connectWithMetamask} className='bg-white  px-8 py-5 mt-6 rounded-lg shadow-lg font-bold '>
            Login With Metamask
        </button>
       </div>
    </div>
  )
}

export default Login