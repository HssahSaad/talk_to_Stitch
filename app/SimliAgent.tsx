"use client";

import React, { useRef, useState } from "react";
import { DailyProvider } from "@daily-co/daily-react";
import Daily from "@daily-co/daily-js";

// Type definition for Daily call object
type DailyCallObject = ReturnType<typeof Daily.createCallObject>;
import VideoBox from "@/app/Components/VideoBox";
import cn from "clsx";
import Link from "next/link";

interface SimliAgentProps {
  onStart: () => void;
  onClose: () => void;
};

// Get your Simli API key from https://app.simli.com/
const SIMLI_API_KEY = process.env.NEXT_PUBLIC_SIMLI_API_KEY;

const SimliAgent: React.FC<SimliAgentProps> = ({ onStart, onClose }) => {
  // State management
  const [isLoading, setIsLoading] = useState(false);
  const [isAvatarVisible, setIsAvatarVisible] = useState(false);

  // Type declarations
  type Participant = {
    user_name: string;
    session_id: string;
  };

  // Type definition for Daily participants
  type DailyParticipants = Record<string, Participant>;

  const [tempRoomUrl, setTempRoomUrl] = useState<string>("");
  const [callObject, setCallObject] = useState<DailyCallObject | null>(null);
  const myCallObjRef = useRef<DailyCallObject | null>(null);
  const [chatbotId, setChatbotId] = useState<string | null>(null);

  const handleStopInteraction = () => {
    if (callObject) {
      callObject.leave().then(() => {
        onClose();
      });
    }
  };

  /**
   * Create a new Simli room and join it using Daily
   */
  const handleJoinRoom = async () => {
    // Set loading state
    setIsLoading(true);

    // 1- Create a new simli avatar at https://app.simli.com/
    // 2- Cutomize your agent and copy the code output
    // 3- PASTE YOUR CODE OUTPUT FROM SIMLI BELOW 👇
    /**********************************/
    const response = await fetch("https://api.simli.ai/session/2418de22-209b-4add-b55f-1192ba81bee2/gAAAAABoNCVuKqiLMDcBI2bG2wTekP4wFzlIKZw27yTqUsbQgo-MJL6K9E3KoswVc954W7xD8vmdfw_dkhH4mdY4fma2k3LBtW5HtNiGWXxeAZypSIeDPxE8qh-3Z9wxQW9AkbbejjgE-A1KmccJqw63pzPdvHaQcNzw5yCZ9iL3YYz-2qXBiQK_DUQHJla1VO6k39Q1YOr-pwHyVfws2fkTWrU_G2A0Zs5U2ZOzKwIidNMwFwuQqUnqquOcI3QHbg9XArivZGb3jkF8wv6N4EilnRDKWbgdzkceksjS9-gH2bMrfxjT454saGTyKmfEFsadbDVP9nnmCAt2w4GOfbNpoMuo2U6Ig_jiW0XJqJOPUW2tfPFO9EYcrnrEnHdLft4wwBnoEwfQsnZY4-80NFm07DndzWSDOQ==", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
    })

    const data = await response.json();
    const roomUrl = data.roomUrl;

    /**********************************/

    // Print the API response 
    console.log("API Response", data);

    // Create a new Daily call object
    let newCallObject = Daily.getCallInstance();
    if (newCallObject === undefined) {
      newCallObject = Daily.createCallObject({
        videoSource: false,
      });
    }

    // Setting my default username
    newCallObject.setUserName("User");

    // Join the Daily room
    await newCallObject.join({ url: roomUrl });
    myCallObjRef.current = newCallObject;
    console.log("Joined the room with callObject", newCallObject);
    setCallObject(newCallObject);

    // Start checking if Simli's Chatbot Avatar is available
    loadChatbot();
  };

  /**
   * Checking if Simli's Chatbot avatar is available then render it
   */
  const loadChatbot = async () => {
    if (myCallObjRef.current) {
      let chatbotFound: boolean = false;

      const participants = myCallObjRef.current.participants();
      for (const [key, participant] of Object.entries(participants)) {
        if (participant.user_name === "Chatbot") {
          setChatbotId(participant.session_id);
          chatbotFound = true;
          setIsLoading(false);
          setIsAvatarVisible(true);
          onStart();
          break; // Stop iteration if you found the Chatbot
        }
      }
      if (!chatbotFound) {
        setTimeout(loadChatbot, 500);
      }
    } else {
      setTimeout(loadChatbot, 500);
    }
  };

  /**
   * Leave the room
   */
  const handleLeaveRoom = async () => {
    if (callObject) {
      await callObject.leave();
      setCallObject(null);
      onClose();
      setIsAvatarVisible(false);
      setIsLoading(false);
    } else {
      console.log("CallObject is null");
    }
  };

  /**
   * Mute participant audio
   */
  const handleMute = async () => {
    if (callObject) {
      callObject.setLocalAudio(false);
    } else {
      console.log("CallObject is null");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <header className="w-full py-4 px-4 bg-gradient-to-r from-indigo-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white rounded-full p-2 shadow-lg mb-4">
            <img src="/lilo-stitch-logo.png" alt="Stitch Assistant Logo" className="w-48 h-48" />
          </div>
          <h1 className="text-3xl font-bold text-primary">Stitch Assistant</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-2xl w-full text-center">
          <div className="flex flex-col items-center space-y-12">
            {isAvatarVisible ? (
              <div className="card p-8 text-center">
                <div className="relative">
                  <DailyProvider callObject={callObject}>
                    {chatbotId && <VideoBox key={chatbotId} id={chatbotId} />}
                  </DailyProvider>
                </div>
                <div className="mt-6 text-center space-y-6">
                  <p className="text-3xl font-bold text-primary">
                    Hi, I'm Lilo – your emotional support buddy.
                  </p>
                  <p className="text-xl text-gray-700">
                    A safe space for you to share your thoughts and feelings
                  </p>
                </div>
                <button
                  onClick={handleStopInteraction}
                  className="button"
                >
                  End Session
                </button>
              </div>
            ) : (
              <div className="text-center">
                <button
                  onClick={handleJoinRoom}
                  disabled={isLoading}
                  className="button disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="animate-pulse">Connecting...</span>
                  ) : (
                    <span>Start Talking to AI</span>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
      <footer className="w-full py-6 px-4 border-t border-gray-200">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">About Stitch</h3>
            <p className="text-gray-700">
              Stitch is a bilingual (Arabic-English) emotional support character inspired by the heart of Lilo & Stitch. 
              She helps young people through life's tough moments — work stress, family issues, friendships, and more — 
              with empathy, humor, and love. Quirky but kind, she reminds you:
            </p>
            <p className="text-primary font-semibold mt-2">"Ohana means no one gets left behind."</p>
            <p className="text-gray-700">أنا هنا علشانك. 💙</p>
          </div>
          <div className="text-center mt-4">
            <Link
              href="https://x.com/StitchTher"
              target="_blank"
              className="flex items-center justify-center space-x-1 text-primary hover:text-primary/80 transition-colors"
            >
              <span>Follow Stitch on Twitter</span>
              <span className="text-primary">💙</span>
            </Link>
            <p className="mt-2 text-gray-700">Built with love using Simli</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SimliAgent;
