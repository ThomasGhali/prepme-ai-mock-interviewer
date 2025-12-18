'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { vapi } from '@/lib/vapi.sdk';

const CallStatusVars = {
  INACTIVE: 'INACTIVE',
  CONNECTING: 'CONNECTING',
  ACTIVE: 'ACTIVE',
  FINISHED: 'FINISHED',
} as const;

type CallStatus = (typeof CallStatusVars)[keyof typeof CallStatusVars];

const Agent = ({ userName, userId, type }: AgentProps) => {
  const router = useRouter();

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [callStatus, setCallStatus] = useState<CallStatus>(
    CallStatusVars.INACTIVE,
  );
  const [messages, setMessages] = useState<SavedMessages[]>([]);

  // initialize vapi event listeners, e.i. call-start, speech-end, etc.
  useEffect(() => {
    const onCallStart = () => setCallStatus(CallStatusVars.ACTIVE);
    const onCallEnd = () => setCallStatus(CallStatusVars.FINISHED);

    const onMessage = (message: Message) => {
      if (message.type === 'transcript' && message.transcriptType === 'final') {
        const newMessage = { role: message.role, content: message.transcript };

        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const onSpeechStart = () => setIsSpeaking(true);
    const onSpeechEnd = () => setIsSpeaking(false);

    const onError = (error: Error) => console.log('Error', error);

    vapi.on('call-start', onCallStart);
    vapi.on('call-end', onCallEnd);
    vapi.on('message', onMessage);
    vapi.on('speech-start', onSpeechStart);
    vapi.on('speech-end', onSpeechEnd);
    vapi.on('error', onError);

    return () => {
      vapi.off('call-start', onCallStart);
      vapi.off('call-end', onCallEnd);
      vapi.off('message', onMessage);
      vapi.off('speech-start', onSpeechStart);
      vapi.off('speech-end', onSpeechEnd);
      vapi.off('error', onError);
    };
  }, []);

  return (
    <>
      <div className="call-view">
        <div className="card-interviewer">
          <div className="avatar">
            <Image
              src="/ai-avatar.png"
              alt="vapi"
              width={65}
              height={54}
              className="object-cover"
            />
            {isSpeaking && <span className="animate-speak" />}
          </div>
          <h3>AI Interviewer</h3>
        </div>

        <div className="card-border">
          <div className="card-content">
            <Image
              src="/user-avatar.png"
              alt="user avatar"
              width={540}
              height={540}
              className="rounded-full object-cover size-[120px]"
            />
            <h3>{userName}</h3>
          </div>
        </div>
      </div>
      {messages.length > 0 && (
        <div className="transcript-border">
          <div className="transcript">
            <p
              key={lastMessage}
              className={cn(
                'transition-opacity duration-500 opacity-0',
                'animate-fadeIn opacity-100',
              )}
            >
              {lastMessage}
            </p>
          </div>
        </div>
      )}

      <div className="w-full flex justify-center">
        {callStatus !== 'ACTIVE' ? (
          <button className="relative btn-call">
            <span
              className={cn(
                'absolute animate-ping rounded-full opacity-75',
                (callStatus !== 'CONNECTING') & 'hidden',
              )}
            />

            <span>
              {callStatus === 'INACTIVE' || callStatus === 'FINISHED'
                ? 'Call'
                : '. . . '}
            </span>
          </button>
        ) : (
          <button className="btn-disconnect">End</button>
        )}
      </div>
    </>
  );
};
export default Agent;
