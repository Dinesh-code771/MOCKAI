declare module 'react-speech-recognition' {
  export interface SpeechRecognitionOptions {
    commands?: Array<{
      command: string | string[];
      callback: (...args: any[]) => void;
      matchInterim?: boolean;
      isFuzzyMatch?: boolean;
      fuzzyMatchingThreshold?: number;
      bestMatchOnly?: boolean;
    }>;
    continuous?: boolean;
    interimResults?: boolean;
    lang?: string;
    maxAlternatives?: number;
    serviceURI?: string;
  }

  export interface SpeechRecognitionState {
    transcript: string;
    listening: boolean;
    resetTranscript: () => void;
    browserSupportsSpeechRecognition: boolean;
    isMicrophoneAvailable: boolean;
  }

  export function useSpeechRecognition(options?: SpeechRecognitionOptions): SpeechRecognitionState;

  export default {
    startListening: (options?: SpeechRecognitionOptions) => void;
    stopListening: () => void;
    abortListening: () => void;
  };
} 