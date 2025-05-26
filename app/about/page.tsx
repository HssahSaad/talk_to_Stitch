import React from 'react';
import SimliAgent from '../SimliAgent';

const AboutPage: React.FC = () => {
  const [showDottedFace, setShowDottedFace] = React.useState(true);

  const onStart = () => {
    console.log("Setting showDottedFace to false...");
    setShowDottedFace(false);
  };

  const onClose = () => {
    console.log("Setting showDottedFace to true...");
    setShowDottedFace(true);
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white min-h-screen flex flex-col">
      <header className="w-full py-4 px-6 bg-gradient-to-r from-indigo-50 to-white">
        <div className="flex justify-between items-center max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold">About Stitch</h1>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-2xl w-full">
          <div className="flex flex-col items-center gap-6 bg-white p-6 pb-10 rounded-xl border border-gray-200 shadow-sm">
            <SimliAgent onStart={onStart} onClose={onClose} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AboutPage;
