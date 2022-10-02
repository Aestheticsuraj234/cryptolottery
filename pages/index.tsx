import type { NextPage } from "next";
import { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import Header from "../components/Header";
import Login from "../components/Login";
import Loading from "../components/Loading";
import CountDownTimer from "../components/CountDownTimer";
import PropagateLoader from "react-spinners/PropagateLoader";
import { ethers } from "ethers";
import currency from "../constant.ts";
import toast from "react-hot-toast";
import Marquee from "react-fast-marquee";
import AdminControls from "../components/AdminControls";


import {
  useContract,
  useMetamask,
  useDisconnect,
  useAddress,
  useContractData,
  useContractCall,
  useContractRead,
  useContractWrite,
} from "@thirdweb-dev/react";

const Home: NextPage = () => {
  const address = useAddress();

  const [quantity, setQuantity] = useState<number>(1);
  const [userTickets, setUserTickets] = useState(0);

  const { contract, isLoading } = useContract(
    process.env.NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS
  );

  const { data: expiration } = useContractRead(contract, "expiration");

  const { data: remainingTickets } = useContractRead(
    contract,
    "RemainingTickets"
  );

  const { data: currentWinningReward } = useContractRead(
    contract,
    "CurrentWinningReward"
  );

  const { data: ticketPrice } = useContractRead(contract, "ticketPrice");

  const { data: ticketCommission } = useContractRead(
    contract,
    "ticketCommission"
  );

  const { data: tickets } = useContractRead(contract, "getTickets");

  const { mutateAsync: BuyTickets } = useContractWrite(contract, "BuyTickets");

  const { data: winnings } = useContractRead(
    contract,
    "getWinningsForAddress",
    address
  );
  const { mutateAsync: WithdrawWinnings } = useContractRead(
    contract,
    "WithdrawWinnings"
  );

  const { data: lastWinner } = useContractRead(contract, "lastWinner");
  const { data: lastWinnerAmount } = useContractRead(
    contract,
    "lastWinnerAmount"
  );

  const { data: isLotteryOperator } = useContractRead(
    contract,
    "lotteryOperator"
  );

  useEffect(() => {
    if (!tickets) return;

    const totalTickets: string[] = tickets;

    const noOfUserTickets = totalTickets.reduce(
      (total, ticketAddress) => (ticketAddress === address ? total + 1 : total),
      0
    );

    setUserTickets(noOfUserTickets);
  }, [tickets, address]);

  // handle click
  const handleClick = async () => {
    if (!ticketPrice) return;

    const notification = toast.loading("Buying Your Tickets...");

    try {
      const data = await BuyTickets([
        {
          value: ethers.utils.parseEther(
            (
              Number(ethers.utils.formatEther(ticketPrice)) * quantity
            ).toString()
          ),
        },
      ]);
      toast.success("Tickets Purchased successfully!", {
        id: notification,
      });
    } catch (err) {
      toast.error("whoops somethings went wrong!...", {
        id: notification,
      });
      console.error("contract call failure", err);
    }
  };

  const onWithdrawWinnings = async () => {
    const notification = toast.loading("WithDraw Winnings....");
    try {
      const data = await WithdrawWinnings([{}]);
      toast.success("winning withdraw successfully", {
        id: notification,
      });
    } catch (err) {
      toast.error("whoops something went wrong!", {
        id: notification,
      });
      console.error("contract call Failure", err);
    }
  };

  if (!address) return <Login />;
  if (isLoading) return <Loading />;

  return (
    <div className="bg-[#091818] min-h-screen flex flex-col">
      <Head>
        <title>Sigma Draw</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex-1">
        <Header />
        <Marquee className="bg-[#0A1F1C] p-5 mb-5" gradient={false} speed={100}>
          <div className="flex space-x-2 mx-10">
            <h4 className="text-white font-bold">
              Last Winnings {lastWinner?.toString()}{" "}
            </h4>
            <h4 className="text-white font-bold">
              {" "}
              Previous Winnings{" "}
              {lastWinnerAmount &&
                ethers.utils.formatEther(lastWinnerAmount?.toString())}
              {currency}
            </h4>
          </div>
        </Marquee>

        {isLotteryOperator === address && (
          <div className="flex justify-center ">
            <AdminControls />
            
          </div>
        )}

        {winnings > 0 && (
          <div className="max-w-md md:max-2xl lg:max-w-4xl mx-auto mt-5">
            <button
              onClick={onWithdrawWinnings}
              className="p-5 bg-gradient-to-b from-orange-500 to-emerald-600 animate-pulse text-center rounded-xl w-full"
            >
              <p className="font-bold text-white">
                Winner Winner Chicken Dinner
              </p>
              <p className="font-semibold text-white">
                Total Winnings {ethers.utils.formatEther(winnings.toString())}{" "}
                {currency}
              </p>
              <br />
              <p className="font-semibold text-white">Click Here to WithDraw</p>
            </button>
          </div>
        )}

        {/* The next Draw box */}
        <div className="space-y-5 md:space-y-0 m-5 md:flex md:flex-row items-start justify-center md:space-x-5  max-w-6xl ">
          <div className="stats-container">
            <h1 className="text-5xl text-white font-semibold text-center">
              The Next Draw
            </h1>

            <div className="flex justify-between p-2 space-x-2 ">
              <div className="stats">
                <h2 className="text-sm">Total Pool</h2>

                <p className="text-xl">
                  {currentWinningReward &&
                    ethers.utils.formatEther(currentWinningReward.toString())}
                  {currency}
                </p>
              </div>
              <div className="stats">
                <h2>Tickets Remaining</h2>
                <p className="text-xl">{remainingTickets?.toNumber()}</p>
              </div>
            </div>
            <div className="mt-5 mb-3 ">
              <CountDownTimer />
            </div>
          </div>

          {/* Coundown timer */}
          {/* --..--- */}

          <div>
            <div className="stats-container space-y-2">
              <div className="stats-container">
                <div className="flex justify-between items-center text-white pb-2">
                  <h2> Price Per Tickets</h2>
                  <p>
                    {ticketPrice &&
                      ethers.utils.formatEther(ticketPrice.toString())}
                    {currency}
                  </p>
                </div>

                <div className="flex text-white items-center space-x-2 bg-[#091B18] border-[#004337] border p-4">
                  <p>TICKETS</p>
                  <input
                    className="flex w-full bg-transparent text-right outline-none"
                    type="number"
                    min={1}
                    max={10}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                  />
                </div>

                <div className="space-y-2mmt-5 ">
                  <div className="flex items-center justify-between text-emerald-300  text-sm italic font-extrabold">
                    <p>Total cost of Tickets</p>
                    <p>
                      {ticketPrice &&
                        Number(
                          ethers.utils.formatEther(ticketPrice.toString())
                        ) * quantity}
                      {currency}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-emerald-300 text-xs italic">
                    <p>Service fees</p>
                    <p>
                      {ticketCommission &&
                        ethers.utils.formatEther(ticketCommission.toString())}
                      {currency}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-emerald-300 text-xs italic">
                    <p>+ Network Fees</p>
                    <p> TBC</p>
                  </div>
                </div>

                <button
                  onClick={handleClick}
                  disabled={
                    expiration?.toString < Date.now().toString() ||
                    remainingTickets?.toNumber() === 0
                  }
                  className="mt-5 w-full bg-gradient-to-br from-orange-500 to-emerald-600 px-10 py-5
          rounded-md text-white font-bold shadow-xl disabled:from-gray-600 disabled:to-gray-600 disabled:textgray-100 disabled:cursor-not-allowed"
                >
                  Buy {quantity} Ticket(s) for{" "}
                  {ticketPrice &&
                    Number(ethers.utils.formatEther(ticketPrice.toString())) *
                      quantity}
                  {currency}
                </button>
              </div>
              {userTickets > 0 && (
                <div className="stats">
                  <p className="text-lg mb-2">
                    You have {userTickets} Tickets in this Draw
                  </p>
                  <div className="flex max-w-sm flex-wrap gap-x-2 gap-y-2">
                    {Array(userTickets)
                      .fill("")
                      .map((_, index) => (
                        <p
                          key={index}
                          className="text-emerald-300 h-20 w-12 bg-emerald-500/30 rounded-lg flex flex-shrink-0 items-center justify-center text-xs italic"
                        >
                          {" "}
                          {index + 1}
                        </p>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <footer className="border-t border-emerald-500/20 flex items-center text-white justify-center p-5">
        <img
          className="h-10 w-10 fitler hue-rotate-90 opacity-20 rounded-full"
          src="https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/themes/3293449/settings_images/3DQ6jYtpQLy6njXpZRot_file.jpg
      "
          alt=""
        />

        <p className="text-xs text-emerald-900 pl-5">
          There are many variations of passages of Lorem Ipsum available, but
          the majority have suffered alteration in some form, by injected
          humour, or randomised words which don't look even slightly believable.
          If you are going to use a passage of Lorem Ipsum, you need to be sure
          there isn't anything embarrassing hidden in the middle of text. All
          the Lorem Ipsum generators on the Internet tend to repeat predefined
          chunks as necessary, making this the first true generator on the
          Internet. It uses a dictionary of over 200 Latin words, combined with
          a handful of model sentence structures, to generate Lorem Ipsum which
          looks reasonable. The generated Lorem Ipsum is therefore always free
          from repetition, injected humour, or non-characteristic words etc.
        </p>
      </footer>
    </div>
  );
};

export default Home;
