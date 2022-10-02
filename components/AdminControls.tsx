import React from "react";
import {
  StarIcon,
  CurrencyDollarIcon,
  ArrowPointer,
  ArrowUturnDownIcon,
} from '@heroicons/react/24/solid'

import {
    useContract,
    useContractRead,
    useContractWrite,
}
from '@thirdweb-dev/react'
import {currency} from '../constant';
import {ethers} from 'ethers'
import toast from 'react-hot-toast'


const AdminControls = () => {
    const {contract , isLoading} = useContract(
        process.env.NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS
    )

    const {data:totalCommission} = useContractRead(
        contract,
        'operatorTotalCommission'
    )

    const {mutateAsync: DrawWinnerTicket} = useContractWrite(
        contract,
        "DrawWinnerTicket"
    )
    const {mutateAsync: RefundAll} = useContractWrite(
        contract,
        "RefundAll"
    )
    const {mutateAsync: restartDraw} = useContractWrite(
        contract,
        "restartDraw"
    )

    const {mutateAsync: WithdrawCommission} = useContractWrite(
        contract,
        "WithdrawCommission"
    )


    const drawWinner = async ()=>{
        const notification = toast.loading("Picking a Lucky Winner")
        try{
            const data = await DrawWinnerTicket([{}]);
            toast.success("A winner has been Selected",{
                id:notification,
            });
            console.info('Contract call Successfull', data)
        }
        catch(err){
            toast.error("Contract call Failure",{
                id:notification
            });
            console.error("contract call failute",err)
        }
    }

    const onWithdrawCommission = async ()=>{
        const notification = toast.loading("Picking a Lucky Winner")
        try{
            const data = await WithdrawCommission([{}]);
            toast.success("A winner has been Selected",{
                id:notification,
            });
            console.info('Contract call Successfull', data)
        }
        catch(err){
            toast.error("Contract call Failure",{
                id:notification
            });
            console.error("contract call failute",err)
        }
    }
    const onRestartDraw = async ()=>{
        const notification = toast.loading("Picking a Lucky Winner")
        try{
            const data = await restartDraw([{}]);
            toast.success("A winner has been Selected",{
                id:notification,
            });
            console.info('Contract call Successfull', data)
        }
        catch(err){
            toast.error("Contract call Failure",{
                id:notification
            });
            console.error("contract call failute",err)
        }
    }


    const onRefundAll = async ()=>{
        const notification = toast.loading("Picking a Lucky Winner")
        try{
            const data = await RefundAll([{}]);
            toast.success("A winner has been Selected",{
                id:notification,
            });
            console.info('Contract call Successfull', data)
        }
        catch(err){
            toast.error("Contract call Failure",{
                id:notification
            });
            console.error("contract call failute",err)
        }
    }
  return (
    <div className='text-white text-center px-5 py-3 rounded-md border-emerald-300/20 border'>
      <h2 className='font-bold'>Admin Controls</h2>
      <p className='mb-5'>Total Commission to be WithDraw:{" "}
      {
        totalCommission && 
        ethers.utils.formatEther(totalCommission?.toString())}
        {" "}
        {currency}
       </p>

      <div className='flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2 '>
        <button onClick={drawWinner} className='admin-button'>
          {/* <StarIcon className="h-6 mx-auto mb-2" /> */}
          Draw Button
        </button>
        <button onClick={onWithdrawCommission} className='admin-button'>
          {/* <CurrencyDollarIcon className="h-6 mx-auto mb-2" /> */}
          WithDraw Commission
        </button>
        <button onClick={onRestartDraw} className='admin-button'>
          {/* <ArrowPointer className="h-6 mx-auto mb-2" /> */}
          Restart Draw
        </button>

        <button onClick={onRefundAll} className='admin-button'>
            {/* <ArrowUturnDownIcon  className='h-6 mx-auto mb-2'/> */}
            Refund All</button>
      </div>
    </div>
  );
};

export default AdminControls;
