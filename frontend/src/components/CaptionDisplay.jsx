import React from 'react';
import { ReactComponent as ChatBubbleIcon } from './icons/chat-bubble.svg';
import { ReactComponent as ChipIcon } from './icons/chip.svg';

const CaptionDisplay = ({ caption, modelUsed }) => {
  return (
    <div className="w-full max-w-2xl mx-auto mt-8 animate-slide-up">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8 shadow-lg border border-blue-100">
        <div className="flex items-start space-x-3">
          <ChatBubbleIcon className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">
              Generated Caption
            </h3>
            <p className="text-xl text-gray-800 leading-relaxed font-medium">
              {caption}
            </p>
            {modelUsed && (
              <div className="mt-4 pt-4 border-t border-blue-200">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  <ChipIcon className="w-3 h-3 mr-1" />
                  Model: {modelUsed}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaptionDisplay;
